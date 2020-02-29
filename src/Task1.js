import React, {useEffect, useState} from "react";
import {useDebouncedCallback} from "use-debounce";
import {product} from "iter-tools/es2015";
import TextField from "@material-ui/core/TextField";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: 200,
    },
  },
  task1: {
  }
}));

function Task1() {
  const classes = useStyles();
  const [value1, setValue1] = useState([]);
  const [value2, setValue2] = useState([]);
  const [result, setResult] = useState([]);
  const [debouncedCallback1] = useDebouncedCallback(value => setValue1(value.split(',').map(Number)),1000);
  const [debouncedCallback2] = useDebouncedCallback(value => setValue2(value.split(',').map(Number)),1000);
  useEffect(() => {
    setResult(Array.from(product(value1, value2)));
  }, [value1, value2]);
  
  return (
    <>
      <div className="m-3">Example: 0, 1, 2, 3, 4</div>
      <div className="m-3">1.1</div>
      <form className={classes.root} noValidate autoComplete="off">
        <TextField id="standard-basic" label="X1"  onChange={e => debouncedCallback1(e.target.value)} />
        <TextField id="standard-basic" label="X2"  onChange={e => debouncedCallback2(e.target.value)} />
      </form>
      <p className="m-3">Декартовий добуток: {result.map(a => a.join(', ')).map(a => `(${a})`).join(', ')}</p>
    </>
  );
}

export default Task1;
