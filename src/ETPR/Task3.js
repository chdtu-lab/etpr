import React, {useEffect, useState} from "react";
import {useDebouncedCallback} from "use-debounce";
import TextField from "@material-ui/core/TextField";
import {makeStyles} from "@material-ui/core/styles";
import fill from 'lodash/fill';
import lt from 'lodash/lt';
import lte from 'lodash/lte';
import gte from 'lodash/gte';
import gt from 'lodash/gt';
import eq from 'lodash/eq';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Graph from "react-graph-vis";
import {product} from "iter-tools/es2015";
import 'katex/dist/katex.min.css';
import TeX from '@matejmazur/react-katex';
import {bool} from "prop-types";

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
  const [comparator, setComparator] = React.useState('eq');
  const [debouncedCallback1] = useDebouncedCallback(value => {
    setArray(value.split(',').map(Number));
  },1000);

  const not = (bool) => !bool;
  const is = (bool) => bool;

  useEffect(() => {
    setBinaryRelation(createBinaryRelation(array, is, comparator));
    setAdditionBinaryRelation(createBinaryRelation(array, not, comparator));
    const zeroArray = fill(Array(array.length + 1), 0);
    const zeroMatrix = clone(zeroArray.map(() => zeroArray));
    const filledMatrix = fillMatrix(zeroMatrix, comparator);
    const matrixWithTitle = addTitleToMatrix(filledMatrix, array)
    setMatrix(matrixWithTitle);
    const graph = generateGraph(matrixWithTitle, array);
    setGraph(graph);
  }, [comparator, array]);
  
  const createBinaryRelation = (array, predicate, comparator) => {
    const bR = [];
    const cartesianProduct = Array.from(product(array, array));
    for (let i = 0; i < cartesianProduct.length; i++) {
      if (predicate(comparators[comparator](cartesianProduct[i][0],cartesianProduct[i][1]))) {
        bR.push(cartesianProduct[i]);
      }
    }
    return bR;
  }
  
  const clone = (items) => items.map(item => Array.isArray(item) ? clone(item) : item);
  
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
    graph['nodes'] = namedArray.map(i => { return {id: i, label: `${i}`}});
    graph['edges'] = [];
    for (let i = 1; i < matrix.length; i++) {
      for (let j = 1; j < matrix[i].length; j++) {
        if (matrix[i][j] === 1) {
          graph['edges'].push({ from: i-1, to: j-1 })
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
      <p className="m-3">Бінарне відношення:  {binaryRelation.map(a => a.join(', ')).map(a => `(${a})`).join(', ')}</p>
      <p className="m-3">Доповнення до бынарного відношення:  {additionBinaryRelation.map(a => a.join(', ')).map(a => `(${a})`).join(', ')}</p>
      <p className="m-3">Бінарне відношення у матричному вигляді:</p>
      <div className="m-3">
        {matrix.map((row, i) => (
          <div key={i}>
            {row.map((col, j) => (
              <span key={j}>{col} {" "}</span>
            ))}
          </div>
        ))}
      </div>
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
