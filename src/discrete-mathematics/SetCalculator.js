import React, {useEffect, useState} from "react";

import TextField from "@material-ui/core/TextField";
import {makeStyles} from "@material-ui/core/styles";

import Zet from "zet";
import {useDebouncedCallback} from "use-debounce";

import SelectableVenn from "./Venn/SelectableVenn";
import OperationSelector from "../UI/operator-select/OperationSelector";
import {operationsObj} from "../UI/operator-select/operations";

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: 200,
    },
  }
}));

export default function SetCalculator() {
  const classes = useStyles();
  const sets = [
    { "sets": ["A"], "size": 12, "label": "A" },
    { "sets": ["B"], "size": 12, "label": "B" },
    { "sets": ['A', "B"], "size": 2 },
  ];
  
  const [valueA1, setValueA1] = useState([1, 2, 3]);
  const [valueB1, setValueB1] = useState([3, 5, 1]);
  const [resultC, setResultC] = useState('');
  const [operation, setOperation] = useState(operationsObj.union);
  
  useEffect(() => {
    const A1 = new Zet(valueA1);
    const B1 = new Zet(valueB1);
    setResultC(setToString(A1[operation.value](B1)));
  }, [valueA1, valueB1, operation]);
  
  const [debouncedCallbackA1] = useDebouncedCallback(value => setValueA1(value.split(',').map(Number)),1000);
  const [debouncedCallbackB1] = useDebouncedCallback(value => setValueB1(value.split(',').map(Number)),1000);
  const handleChange = value => setOperation(value);
  const setToString = set => Array.from(set).sort((a, b) => a-b).join(', ');
  
  return (
    <div className="my-5">
      <form className={classes.root} noValidate autoComplete="off">
        <TextField
          id="standard-basic"
          defaultValue={valueA1}
          label="A"
          onChange={e => debouncedCallbackA1(e.target.value)}
        />
        <OperationSelector
          initial={operation.value}
          comparatorChanged={handleChange}
        />
        <TextField
          id="standard-basic"
          defaultValue={valueB1}
          label="B"
          onChange={e => debouncedCallbackB1(e.target.value)}
        />
      </form>
      <div>{resultC}</div>
      <SelectableVenn sets={sets} selectors={operation.selector}/>
    </div>
  );
}
