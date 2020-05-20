import React, {useEffect} from "react";

import TextField from '@material-ui/core/TextField';
import {makeStyles} from '@material-ui/core/styles';

import {evaluate} from 'mathjs';
import {useDebouncedCallback} from "use-debounce";

const comaratorsCharacters = {
  '≥': '>=',
  '≤': '<='
}

const defaultRawInequalities = [
  'x1 або x2 + x3 + x4 + x5',
  'x1 або x2 + x3 + x4',
  'x1 або x2 + x3 + x5',
  'x1 або x2 + x3',
  'x2 або x3 + x4 + x5',
  'x2 або x3 + x4',
  'x3 або x4 + x5'
].join('\n');

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

function Lab3() {

  const classes = useStyles();
  const [rawInequalities, setRawInequalities] = React.useState('');
  const [inequalities, setInequalities] = React.useState([]);
  const [XIdentifiers, setXIdentifiers] = React.useState([]); // ['x1', 'x2']

  const [replacedExpressions, setReplacedExpressions] = React.useState([]);
  const [XIdentifiersReplacement, setXIdentifiersReplacement] = React.useState([]);
  const [rawComparators, setRawComparators] = React.useState([]); // ['≥', '≤', '≥', '≤', '≥', '≤', '≥']
  const [evaluated, setEvaluated] = React.useState([]);
  const [historyesult, setHistoryesult] = React.useState([]);

  const [updateInequalities] = useDebouncedCallback(value => {
    setInequalities(value.split('\n'));
  }, 300);

  useEffect(() => {
    setRawInequalities(defaultRawInequalities)
    setInequalities(defaultRawInequalities.split('\n'));
  }, []);

  useEffect(() => {
    if (inequalities[0]) {
      setXIdentifiers([...inequalities[0]?.matchAll(/x\d/g)].map(result => result[0]));
    }
  }, [inequalities]);

  useEffect(() => {
    const o = XIdentifiers.map(x => ({
      label: x,
      value: 1
    }))
    setXIdentifiersReplacement(o);
  }, [XIdentifiers]);

  const [updateXIdentifiersReplacement] = useDebouncedCallback((x, value) => {
    const index = XIdentifiersReplacement.findIndex(item => item.label === x.label);
    const newArray = [...XIdentifiersReplacement];
    newArray[index].value = Number(value);
    setXIdentifiersReplacement(newArray);
  }, 300);

  const [updateRawComparators] = useDebouncedCallback(value => {
    setRawComparators(value.split(', '));
  }, 300);

  useEffect(() => {
    let newExpressions = [...replacedExpressions];
    for (let i = 0; i < rawComparators.length; i++) {
      newExpressions[i] = newExpressions[i].replace('==', comaratorsCharacters[rawComparators[i]]);
    }
    setReplacedExpressions(newExpressions);
  }, [rawComparators]);


  useEffect(() => {
    let newExpressions = [...inequalities];
    for (const val of XIdentifiersReplacement) {
      for (let i = 0; i < newExpressions.length; i++) {
        newExpressions[i] = newExpressions[i].replace(val.label, val.value).replace(';', '').replace('або', '==').replace(',', '');
      }
    }
    for (let i = 0; i < rawComparators.length; i++) {
      newExpressions[i] = newExpressions[i].replace('==', comaratorsCharacters[rawComparators[i]]);
    }
    setReplacedExpressions(newExpressions);
  }, [XIdentifiersReplacement]);


  useEffect(() => {
    let newEvaluated = [];
    const newExpression = [...replacedExpressions];
    for (const replacedExpression of newExpression) {
      newEvaluated.push({
        expression: replacedExpression,
        evaluatedResult: evaluate(replacedExpression)
      })
    }
    setEvaluated(newEvaluated)
  }, [rawComparators]);

  useEffect(() => {
    // const history = [];
    // const copy = [...evaluated].reverse();
    // for (let i = 0; i < copy.length; i++) {
    //   // while (!copy[i].evaluatedResult) {
    //   if (!copy[i].evaluatedResult) {
    //     const addition = (Number(copy[i].expression[0]) + 1) + copy[i].expression.slice(1);
    //     copy[i].expression = addition;
    //     copy[i].evaluatedResult = evaluate(addition);
    //     history.push(...copy);
    //   }
    // }
    // console.log(copy);
    // console.log(history);
  }, [evaluated]);

  return (
    <>
      <form className={classes.root} noValidate autoComplete="off">
        <div>
          <TextField
            id="standard-multiline-flexible"
            label="Inequalities"
            multiline
            defaultValue={rawInequalities}
            rowsMax={7}
            onChange={e => updateInequalities(e.target.value)}
          />
        </div>
        {XIdentifiersReplacement.map(x =>
          <TextField id="standard-basic" required key={x.label} label={x.label}
                     onChange={e => updateXIdentifiersReplacement(x, e.target.value)}
          />
        )}
        <div>
          <TextField id="standard-basic" label="Comarators" onChange={e => updateRawComparators(e.target.value)}/>
        </div>
      </form>
      {replacedExpressions.map((expression, index) =>
        <div key={index}>{expression} {rawComparators.length ? String(evaluate(expression)) : ''}</div>
      )}
    </>
  );
}

export default Lab3;
