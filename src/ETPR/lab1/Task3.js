import React, {useEffect, useState} from "react";
import {useDebouncedCallback} from "use-debounce";

import TextField from "@material-ui/core/TextField";
import {makeStyles} from "@material-ui/core/styles";

import fill from 'lodash/fill';
import Graph from "react-graph-vis";
import {product} from "iter-tools/es2015";
import 'katex/dist/katex.min.css';

import RelationSelector from "./RelationSelector";
import MatrixTable from "./MatrixTable";
import {comparatorsObj} from "./comparators";
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

function Task3() {
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
  const [isReflectMatrix, setIsReflectMatrix] = useState(false);
  const [isSymmetricMatrix, setSymmetricMatrix] = useState(false);
  const [isASymmetricMatrix, setASymmetricMatrix] = useState(false);
  const [secondMatrix, setSecondMatrix] = useState([]);
  const [resultMatrix, setResultMatrix] = useState([]);
  const [binaryRelation, setBinaryRelation] = useState([]);
  const [additionBinaryRelation, setAdditionBinaryRelation] = useState([]);
  const [reverseBinaryRelation, setReverseBinaryRelation] = useState([]);
  const [dualBinaryRelation, setDualBinaryRelation] = useState([]);
  const [comparator, setComparator] = React.useState(comparatorsObj.eq);
  const [secondComparator, setSecondComparator] = React.useState(comparatorsObj.eq);
  const [debouncedCallback1] = useDebouncedCallback(value => {
    setArray(value.split(',').map(Number));
  }, 1000);

  const not = (bool) => !bool;
  const is = (bool) => bool;
  const clone = (items) => items.map(item => Array.isArray(item) ? clone(item) : item);

  useEffect(() => {
    setBinaryRelation(createBinaryRelation(array, is, comparator.value, false));
    setAdditionBinaryRelation(createBinaryRelation(array, not, comparator.value, false));
    setReverseBinaryRelation(createBinaryRelation(array, is, comparator.value, true));
    setDualBinaryRelation(createBinaryRelation(array, not, comparator.value, true));
    const zeroArray = fill(Array(array.length), 0);
    const zeroMatrix = clone(zeroArray.map(() => zeroArray));
    const filledMatrix = fillMatrix(zeroMatrix, comparator.value);
    setMatrix(filledMatrix);
    const graph = generateGraph(filledMatrix, array);
    setGraph(graph);
  }, [comparator, array]);

  useEffect(() => {
    const zeroArray = fill(Array(array.length), 0);
    const zeroMatrix = clone(zeroArray.map(() => zeroArray));
    const filledMatrix = fillMatrix(zeroMatrix, secondComparator.value);
    setSecondMatrix(filledMatrix);
  }, [secondComparator, array]);

  // https://stackoverflow.com/a/48694670/5774395
  // math.multiply(math.matrix(matrix), math.matrix(secondMatrix));
  const matrixDot = (A, B) => {
    let result = new Array(A.length).fill(0).map(() => new Array(B[0].length).fill(0));
    return result.map((row, i) => {
      return row.map((val, j) => {
        return A[i].reduce((sum, elm, k) => sum + (elm * B[k][j]), 0)
      })
    })
  }

  const matrixToBinaryRelation = (matrix) => {
    const BR = [];
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] === 1) {
          BR.push([i, j]);
        }
      }
    }
    return BR;
  }

  const checkASymmetricMatrix = (matrix) => {
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (Boolean(matrix[i][j]) && Boolean(matrix[j][i])) {
          return false
        }
      }
    }
    return true
  }

  const checkSymmetricMatrix = (matrix) => {
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (!(matrix[i][j] === matrix[j][i])) {
          return false
        }
      }
    }
    return true
  }

  const checkReflectiveMatrix = (matrix) => {
    const indexes = [...new Array(matrix.length)].map((n, index) => [index, index]);
    let count = 0;
    for (const indexe of indexes) {
      if (matrix[indexe[0]][indexe[1]] === 1) {
        count+=1;
      }
    }
    return matrix.length === count;
  }

  useEffect(() => {
    if (matrix.length) {
      setIsReflectMatrix(checkReflectiveMatrix(matrix));
      setSymmetricMatrix(checkSymmetricMatrix(matrix));
      setASymmetricMatrix(checkASymmetricMatrix(matrix));
    }
  }, [matrix, secondMatrix]);


  useEffect(() => {
    if (matrix.length) {
      const BR1 = matrixToBinaryRelation(matrix);
      const BR2 = matrixToBinaryRelation(secondMatrix);
      const zeroArray = fill(Array(array.length), 0);
      const zeroMatrix = clone(zeroArray.map(() => zeroArray));
      for (const br1 of BR1) {
        for (const br2 of BR2) {
           if (br1[1] === br2[0]) {
             zeroMatrix[br1[0]][br2[1]] = 1;
           }
        }
      }
      setResultMatrix(zeroMatrix);
    }
  }, [matrix, secondMatrix]);


  const createBinaryRelation = (array, predicate, comparator, isReverse) => {
    const bR = [];
    const cartesianProduct = Array.from(product(array, array));
    for (let i = 0; i < cartesianProduct.length; i++) {
      if (predicate(comparatorsObj[comparator].func(cartesianProduct[i][0], cartesianProduct[i][1]))) {
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
        if (comparatorsObj[comparator].func(i, j)) {
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
  const matrixToLatex  = (mathExp) => String.raw`\begin{pmatrix}${mathExp.map(i => i.join(' & ')).join("\\\\\n")}\end{pmatrix}`;

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
        initial={comparator.value}
        comparatorChanged={handleChange}
      />
      <RelationSelector
        initial={secondComparator.value}
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
      <p>{`Оскільки у матриці на головній діагоналі стоять ${isReflectMatrix ? 'одиниці': 'нулі'}, то воно ${isReflectMatrix ? 'рефлексивне': 'не є рефлексивним'}`}</p>
      <p>{`Оскільки відношення ${isReflectMatrix ? 'рефлексивне': 'не рефлексивне'}, то воно ${isReflectMatrix ? 'не антирефлексивне': 'антирефлексивне'}`}</p>
      <p>{`Дане відношення  ${isSymmetricMatrix ? 'симетричне': 'не симетричне'}`}</p>
      <p>{`Дане відношення  ${isASymmetricMatrix ? 'aсиметричне': 'не aсиметричне'}`}</p>
      <p className="m-3">1.9) Композіція бінарних відношень:</p>
      <div className="flex">
        <div className="flex mr-2 items-center">
          <TeX className="mr-1" math={comparator.math}/>
          <TeX className="mr-1" math='\circ'/>
          <TeX className="mr-1" math={secondComparator.math}/>
          <TeX className="mr-1" math='='/>
          <TeX math={matrixToLatex(matrix)}/>
        </div>
        <div className="flex mr-2 items-center">
          <TeX className="mr-1" math='\circ'/>
          <TeX math={matrixToLatex(secondMatrix)}/>
        </div>
        <div className="flex items-center">
          <TeX className="mr-1" math='='/>
          <TeX className="mr-1" math={matrixToLatex(resultMatrix)}/>
        </div>
      </div>
      <p className="m-3">1.3) Бінарне відношення у вигляді орієнтованого графа:</p>
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
