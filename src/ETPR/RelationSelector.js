import React from 'react';

import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import {makeStyles} from "@material-ui/core/styles";

import TeX from "@matejmazur/react-katex";

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


function RelationSelector({ initial, comparatorChanged }) {
  const classes = useStyles();
  const handleChange = event => comparatorChanged(event.target.value);

  return (
    <FormControl className={classes.formControl}>
      <InputLabel id="demo-simple-select-label">Відношення</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={initial}
        onChange={handleChange}
      >
        <MenuItem value={'eq'}>
          <TeX className="mr-1" math="R_{x=y}"/>- дорівнює
        </MenuItem>
        <MenuItem value={'neq'}>
          <TeX className="mr-1" math="R_{x \neq y}"/>- не дорівнює
        </MenuItem>
        <MenuItem value={'gt'}>
          <TeX className="mr-1" math="R_{x > y}"/>- більше
        </MenuItem>
        <MenuItem value={'lt'}>
          <TeX className="mr-1" math="R_{x < y}"/>- менше
        </MenuItem>
        <MenuItem value={'lte'}>
          <TeX className="mr-1" math="R_{x \leq y}"/>- не більше
        </MenuItem>
        <MenuItem value={'gte'}>
          <TeX className="mr-1" math="R_{x \geq y}"/>- не менше
        </MenuItem>
      </Select>
    </FormControl>
  );
}

export default RelationSelector;
