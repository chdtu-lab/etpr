import React from 'react';

import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import {makeStyles} from "@material-ui/core/styles";

import TeX from "@matejmazur/react-katex";

import {comparatorsObj} from "./comparators";

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


function RelationSelector({initial, comparatorChanged}) {
  const classes = useStyles();
  const handleChange = event => comparatorChanged({
    value: event.target.value,
    math: comparatorsObj[event.target.value]
  });

  const keys = Object.keys(comparatorsObj);

  return (
    <FormControl className={classes.formControl}>
      <InputLabel id="demo-simple-select-label">Відношення</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={initial}
        onChange={handleChange}
      >
        {keys.map(c => (
          <MenuItem value={comparatorsObj[c].value}>
            <TeX className="mr-1" math={comparatorsObj[c].math}/>- {comparatorsObj[c].label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default RelationSelector;
