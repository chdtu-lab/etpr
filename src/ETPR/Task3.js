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

import Graph from "react-graph-vis";
import {product} from "iter-tools/es2015";
import 'katex/dist/katex.min.css';
import RelationSelector from "./RelationSelector";
import MatrixTable from "./MatrixTable";

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
  const [secondMatrix, setSecondMatrix] = useState([]);
  const [resultMatrix, setResultMatrix] = useState([]);
  const [binaryRelation, setBinaryRelation] = useState([]);
  const [additionBinaryRelation, setAdditionBinaryRelation] = useState([]);
  const [reverseBinaryRelation, setReverseBinaryRelation] = useState([]);
  const [dualBinaryRelation, setDualBinaryRelation] = useState([]);
  const [comparator, setComparator] = React.useState('eq');
  const [secondComparator, setSecondComparator] = React.useState('eq');
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

  useEffect(() => {
    const zeroArray = fill(Array(array.length), 0);
    const zeroMatrix = clone(zeroArray.map(() => zeroArray));
    const filledMatrix = fillMatrix(zeroMatrix, secondComparator);
    setSecondMatrix(filledMatrix);
  }, [secondComparator, array]);

  // https://stackoverflow.com/a/48694670/5774395
  const matrixDot = (A, B) => {
    let result = new Array(A.length).fill(0).map(() => new Array(B[0].length).fill(0));
    return result.map((row, i) => {
      return row.map((val, j) => {
        return A[i].reduce((sum, elm, k) => sum + (elm * B[k][j]), 0)
      })
    })
  }

  useEffect(() => {
    setResultMatrix(matrixDot(matrix, secondMatrix));
  }, [matrix, secondMatrix]);


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

  const handleChange = value => setComparator(value);
  const handleSecondChange = value => setSecondComparator(value);
  const binaryRelationToString = binaryRelation => binaryRelation.map(a => a.join(', ')).map(a => `(${a})`).join(', ');

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
      <RelationSelector
        initial={comparator}
        comparatorChanged={handleChange}
      />
      <RelationSelector
        initial={secondComparator}
        comparatorChanged={handleSecondChange}
      />
      <p className="m-3">1.2) Бінарне
        відношення: {binaryRelationToString(binaryRelation)}</p>
      <p className="m-3">1.5) Доповнення до бінарного
        відношення: {binaryRelationToString(additionBinaryRelation)}</p>
      <p className="m-3">1.7) Обернене бінарне
        відношення: {binaryRelationToString(reverseBinaryRelation)}</p>
      <p className="m-3">1.8) Двоїсте бінарне
        відношення: {binaryRelationToString(dualBinaryRelation)}</p>
      <p className="m-3">1.3) Бінарне відношення у матричному вигляді:</p>
      <MatrixTable matrix={matrix}/>
      <p className="m-3">1.9) Композіція бінарних відношень:</p>
      <div className="flex">
        <div className="mr-4">
          <MatrixTable matrix={matrix}/>
        </div>
        <div className="mr-4">
          <MatrixTable matrix={secondMatrix}/>
        </div>
        <div>
          <MatrixTable matrix={resultMatrix}/>
        </div>
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
