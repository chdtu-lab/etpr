import React from 'react';

import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import {makeStyles} from "@material-ui/core/styles";

import TeX from "@matejmazur/react-katex";


const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  }
}));


function OperationSelector({initial, comparatorChanged}) {
  const classes = useStyles();
  const handleChange = event => comparatorChanged(event.target.value);

  return (
    <FormControl className={classes.formControl}>
      <InputLabel id="demo-simple-select-label">Операція</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={initial}
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
  );
}

export default OperationSelector;
