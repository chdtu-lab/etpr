import React, {useEffect, useState} from "react";
import {useDebouncedCallback} from "use-debounce";
import TextField from "@material-ui/core/TextField";
import {makeStyles} from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TeX from "@matejmazur/react-katex";
import Zet from "zet";
import SelectableVenn from "./SelectableVenn";
import SelectableVennClass from "./SelectableVennClass";

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: 200,
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  }
}));

export default function SetCalculator() {
  const classes = useStyles();
  const operationsSelector = {
    union: ['(A∩B)', String.raw`(B)\(A∩B)`, String.raw`(A)\(A∩B)`],
    intersection: ['(A∩B)'],
    difference: [String.raw`(A)\(A∩B)`],
  }
  const sets = [
    { "sets": ["A"], "size": 12, "label": "A" },
    { "sets": ["B"], "size": 12, "label": "B" },
    { "sets": ['A', "B"], "size": 2 },
  ];
  
  const [valueA1, setValueA1] = useState([1, 2, 3]);
  const [valueB1, setValueB1] = useState([3, 5, 1]);
  const [resultC, setResultC] = useState('');
  const [operation, setOperation] = useState('union');
  const [selectors, setSelectors] = useState(operationsSelector[operation]);
  
  useEffect(() => {
    const A1 = new Zet(valueA1);
    const B1 = new Zet(valueB1);
    setSelectors(operationsSelector[operation]);
    setResultC(setToString(A1[operation](B1)));
  }, [valueA1, valueB1, operation]);
  
  const [debouncedCallbackA1] = useDebouncedCallback(value => setValueA1(value.split(',').map(Number)),1000);
  const [debouncedCallbackB1] = useDebouncedCallback(value => setValueB1(value.split(',').map(Number)),1000);
  const handleChange = event => setOperation(event.target.value);
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
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">Відношення</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={operation}
            onChange={handleChange}
          >
            <MenuItem value={'union'}>
              <TeX className="mr-1" math="A \cup B"/>- Об'єднання
            </MenuItem>
            <MenuItem value={'intersection'}>
              <TeX className="mr-1" math="A \cap B"/>- Перетин
            </MenuItem>
            <MenuItem value={'difference'}>
              <TeX className="mr-1" math="A \setminus B"/>- Різниця
            </MenuItem>
          </Select>
        </FormControl>
        <TextField
          id="standard-basic"
          defaultValue={valueB1}
          label="B"
          onChange={e => debouncedCallbackB1(e.target.value)}
        />
      </form>
      <div>{resultC}</div>
      <SelectableVenn sets={sets} selectors={selectors}/>
      {/*<SelectableVennClass sets={sets} selectors={selectors}/>*/}
    </div>
  );
}
