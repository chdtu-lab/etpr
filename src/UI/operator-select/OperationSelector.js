import React from 'react';

import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import {makeStyles} from "@material-ui/core/styles";

import TeX from "@matejmazur/react-katex";

import {operationsObj} from "./operations";

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  }
}));


function OperationSelector({initial, comparatorChanged}) {
  const classes = useStyles();
  const handleChange = event => comparatorChanged(event.target.value);
  const keys = Object.keys(operationsObj);

  return (
    <FormControl className={classes.formControl}>
      <InputLabel id="demo-simple-select-label">Операція</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={initial}
        onChange={handleChange}
      >
        {keys.map(o => (
          <MenuItem value={operationsObj[o].value}>
            <TeX className="mr-1" math={operationsObj[o].math}/>- {operationsObj[o].label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default OperationSelector;
