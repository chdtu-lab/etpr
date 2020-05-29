import React, {useEffect, useState} from "react";
import {useDebouncedCallback} from "use-debounce";

import TextField from "@material-ui/core/TextField";
import {makeStyles} from "@material-ui/core/styles";
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';

import fill from 'lodash/fill';
import lt from 'lodash/lt';
import lte from 'lodash/lte';
import gte from 'lodash/gte';
import gt from 'lodash/gt';
import eq from 'lodash/eq';

import Graph from "react-graph-vis";
import {product} from "iter-tools/es2015";
import 'katex/dist/katex.min.css';
import TeX from '@matejmazur/react-katex';

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

function Task3() {
  const comparators = {
    'eq': eq,
    'neq': (a, b) => !eq(a, b),
    'gt': gt,
    'lt': lt,
    'lte': lte,
    'gte': gte,
  }
  const options = {
    height: "350px",
    width: "500px"
  };
  const initialGraph = {
    nodes: [],
    edges: []
  };

  const classes = useStyles();
  const [array, setArray] = useState([0, 1, 2, 3, 4]);
  const [graph, setGraph] = useState(initialGraph);
  const [matrix, setMatrix] = useState([]);
  const [binaryRelation, setBinaryRelation] = useState([]);
  const [additionBinaryRelation, setAdditionBinaryRelation] = useState([]);
  const [reverseBinaryRelation, setReverseBinaryRelation] = useState([]);
  const [dualBinaryRelation, setDualBinaryRelation] = useState([]);
  const [comparator, setComparator] = React.useState('eq');
  const [debouncedCallback1] = useDebouncedCallback(value => {
    setArray(value.split(',').map(Number));
  }, 1000);

  const not = (bool) => !bool;
  const is = (bool) => bool;
  const clone = (items) => items.map(item => Array.isArray(item) ? clone(item) : item);

  useEffect(() => {
    setBinaryRelation(createBinaryRelation(array, is, comparator, false));
    setAdditionBinaryRelation(createBinaryRelation(array, not, comparator, false));
    setReverseBinaryRelation(createBinaryRelation(array, is, comparator, true));
    setDualBinaryRelation(createBinaryRelation(array, not, comparator, true));
    const zeroArray = fill(Array(array.length), 0);
    const zeroMatrix = clone(zeroArray.map(() => zeroArray));
    const filledMatrix = fillMatrix(zeroMatrix, comparator);
    setMatrix(filledMatrix);
    const graph = generateGraph(filledMatrix, array);
    setGraph(graph);
  }, [comparator, array]);


  const createBinaryRelation = (array, predicate, comparator, isReverse) => {
    const bR = [];
    const cartesianProduct = Array.from(product(array, array));
    for (let i = 0; i < cartesianProduct.length; i++) {
      if (predicate(comparators[comparator](cartesianProduct[i][0], cartesianProduct[i][1]))) {
        if (isReverse) {
          bR.push(cartesianProduct[i].reverse());
        } else {
          bR.push(cartesianProduct[i]);
        }
      }
    }
    return bR;
  }

  const fillMatrix = (zeroMatrix, comparator) => {
    for (let i = 0; i < zeroMatrix.length; i++) {
      for (let j = 0; j < zeroMatrix[i].length; j++) {
        if (comparators[comparator](i, j)) {
          zeroMatrix[i][j] = 1;
        }
      }
    }
    return zeroMatrix;
  }

  const addTitleToMatrix = (matrix, titles) => {
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (i === 0 && j !== 0) {
          matrix[0][j] = titles[j - 1];
        }
        if (j === 0 && i !== 0) {
          matrix[i][0] = titles[i - 1];
        }
        if (j === 0 && i === 0) {
          matrix[i][0] = '--';
        }
      }
    }
    return matrix;
  }

  const generateGraph = (matrix, namedArray) => {
    const graph = {};
    graph['nodes'] = namedArray.map(i => {
      return {id: i, label: `${i}`}
    });
    graph['edges'] = [];
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] === 1) {
          graph['edges'].push({from: i, to: j})
        }
      }
    }
    return graph;
  }

  const handleChange = event => setComparator(event.target.value);

  return (
    <>
      <p className="m-3">1.3</p>
      <form className={classes.root} noValidate autoComplete="off">
        <TextField
          id="standard-basic"
          label="X1"
          defaultValue={array}
          onChange={e => debouncedCallback1(e.target.value)}
        />
      </form>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">Відношення</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={comparator}
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
      <p className="m-3">1.2) Бінарне
        відношення: {binaryRelation.map(a => a.join(', ')).map(a => `(${a})`).join(', ')}</p>
      <p className="m-3">1.5) Доповнення до бінарного
        відношення: {additionBinaryRelation.map(a => a.join(', ')).map(a => `(${a})`).join(', ')}</p>
      <p className="m-3">1.7) Обернене бінарне
        відношення: {reverseBinaryRelation.map(a => a.join(', ')).map(a => `(${a})`).join(', ')}</p>
      <p className="m-3">1.8) Двоїсте бінарне
        відношення: {dualBinaryRelation.map(a => a.join(', ')).map(a => `(${a})`).join(', ')}</p>
      <p className="m-3">1.3) Бінарне відношення у матричному вигляді:</p>
      <table id='students'>
        <tbody>
        {matrix.map((row, i) => (
          <tr key={i}>
            {row.map((col, j) => (
              <td key={j} className="border-solid border-2 border-gray-600">{col}</td>
            ))}
          </tr>
        ))}
        </tbody>
      </table>
      <p className="m-3">Бінарне відношення у вигляді орієнтованого графа:</p>
      <div className="m-3">
        <Graph
          graph={graph}
          options={options}
        />
      </div>
    </>
  );
}

export default Task3;
