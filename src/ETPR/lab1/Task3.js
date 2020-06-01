import React, {useEffect, useState} from "react";
import {useDebouncedCallback} from "use-debounce";

import TextField from "@material-ui/core/TextField";
import {makeStyles} from "@material-ui/core/styles";

import fill from 'lodash/fill';
import {product} from "iter-tools/es2015";
import Graph from "react-graph-vis";
import TeX from "@matejmazur/react-katex";
import 'katex/dist/katex.min.css';

import RelationSelector from "./relation-select/RelationSelector";
import {comparatorsObj} from "./relation-select/comparators";
import OperationSelector from "../../UI/operator-select/OperationSelector";
import {operationsObj} from "../../UI/operator-select/operations";

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: 200,
    },
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
  const [isSubsetMatrix, setIsSubsetMatrix] = useState(false);
  const [isSymmetricMatrix, setIsSymmetricMatrix] = useState(false);
  const [isASymmetricMatrix, setIsASymmetricMatrix] = useState(false);
  const [isAntiSymmetricMatrix, setIsAntiSymmetricMatrix] = useState(false);
  const [isTransitiveMatrix, setIsTransitiveMatrix] = useState(false);
  const [isCompleteMatrix, setIsCompleteMatrix] = useState(false);
  const [secondMatrix, setSecondMatrix] = useState([]);
  const [resultMatrix, setResultMatrix] = useState([]);
  const [symmetricMatrix, setSymmetricMatrix] = useState([]);
  const [diagonalMatrix, setDiagonalMatrix] = useState([]);
  const [compositionMatrixForTransitive, setCompositionMatrixForTransitive] = useState([]);
  const [binaryRelation, setBinaryRelation] = useState([]);
  const [unionOfBinaryRelations, setUnionOfBinaryRelations] = useState([]);
  const [secondBinaryRelation, setSecondBinaryRelation] = useState([]);
  const [operation, setOperation] = useState(operationsObj.union);
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
  }, []);

  useEffect(() => {
    setBinaryRelation(createBinaryRelation(array, is, comparator.value, false));
    setSecondBinaryRelation(createBinaryRelation(array, is, secondComparator.value, false));
    setAdditionBinaryRelation(createBinaryRelation(array, not, comparator.value, false));
    setReverseBinaryRelation(createBinaryRelation(array, is, comparator.value, true));
    setDualBinaryRelation(createBinaryRelation(array, not, comparator.value, true));

    const zeroArray = fill(Array(array.length), 0);
    const zeroMatrix = clone(zeroArray.map(() => zeroArray));
    setDiagonalMatrix(fillMatrix(zeroMatrix, comparatorsObj.eq.value));
  }, [comparator, secondComparator, array]);

  useEffect(() => {
    setMatrix(binaryRelationToMatrix(binaryRelation))
  }, [binaryRelation]);

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
          BR.push([array[i], array[j]]);
        }
      }
    }
    return BR;
  }

  const binaryRelationToMatrix = (br) => {
    const zeroArray = fill(Array(array.length), 0);
    const zeroMatrix = clone(zeroArray.map(() => zeroArray));
    for (const b of br) {
      zeroMatrix[array.indexOf(b[0])][array.indexOf(b[1])] = 1;
    }
    return zeroMatrix;
  }

  const compositionOfMatrix = (matrix, secondMatrix) => {
    const BR1 = matrixToBinaryRelation(matrix);
    const BR2 = matrixToBinaryRelation(secondMatrix);
    const zeroArray = fill(Array(array.length), 0);
    const zeroMatrix = clone(zeroArray.map(() => zeroArray));
    for (const br1 of BR1) {
      for (const br2 of BR2) {
        if (br1[1] === br2[0]) {
          zeroMatrix[array.indexOf(br1[0])][array.indexOf(br2[1])] = 1;
        }
      }
    }
    return zeroMatrix;
  }

  const binaryRelationsIncludes = (br1, br2) => {
    let matchCount = 0;
    for (const b1 of br1) {
      for (const b2 of br2) {
        if (b1[0] === b2[0] && b1[1] === b2[1]) {
          matchCount += 1;
        }
      }
    }
    return br2.length === matchCount;
  }

  const checkTransitiveMatrix = (matrix) => {
    if (matrix.length) {
      const compositionOfBR = matrixToBinaryRelation(compositionOfMatrix(matrix, matrix));
      const br = matrixToBinaryRelation(matrix);
      const compositionMatrix = binaryRelationToMatrix(compositionOfBR);
      setCompositionMatrixForTransitive(compositionMatrix);
      return binaryRelationsIncludes(br, compositionOfBR);
    }
  }

  const checkAntiSymmetricMatrix = (matrix) => {
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (Boolean(matrix[i][j]) && Boolean(matrix[j][i]) && !(i === j)) {
          return false
        }
      }
    }
    return true
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

  const getSymmetricMatrix = (matrix) => {
    const zeroArray = fill(Array(array.length), 0);
    const zeroMatrix = clone(zeroArray.map(() => zeroArray));
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j]) {
          zeroMatrix[j][i] = 1;
        }
      }
    }
    return zeroMatrix
  }

  const checkReflectiveMatrix = (matrix) => {
    const indexes = [...new Array(matrix.length)].map((n, index) => [index, index]);
    let count = 0;
    for (const indexe of indexes) {
      if (matrix[indexe[0]][indexe[1]] === 1) {
        count += 1;
      }
    }
    return matrix.length === count;
  }

  const checkCompleteMatrix = (matrix) => {
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (!matrix[i][j]) {
          return false;
        }
      }
    }
    return true;
  }

  useEffect(() => {
    if (matrix.length) {
      setGraph(generateGraph(matrix, array));

      setIsReflectMatrix(checkReflectiveMatrix(matrix));
      setIsSymmetricMatrix(checkSymmetricMatrix(matrix));
      setSymmetricMatrix(getSymmetricMatrix(matrix));
      setIsASymmetricMatrix(checkASymmetricMatrix(matrix));
      setIsAntiSymmetricMatrix(checkAntiSymmetricMatrix(matrix));
      setIsTransitiveMatrix(checkTransitiveMatrix(matrix));
      setIsCompleteMatrix(checkCompleteMatrix(matrix));
    }
  }, [matrix]);

  const getUnionOfBinaryRelation = (br1, br2) => {
    const unionObj = {};
    for (const b1 of br1) {
      for (const b2 of br2) {
        if (b1[0] !== b2[0] || b1[1] !== b2[1]) {
          unionObj[`${b1[0]}${b1[1]}`] = b1;
          unionObj[`${b2[0]}${b2[1]}`] = b2;
        }
      }
    }
    return Object.values(unionObj);
  }

  useEffect(() => {
    setUnionOfBinaryRelations(getUnionOfBinaryRelation(binaryRelation, secondBinaryRelation));
  }, [binaryRelation, secondBinaryRelation, operation]);

  const matrixIsSubset = (matrix, secondMatrix) => {
    let matchCount = 0;
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (Boolean(matrix[i][j]) && (matrix[i][j] === secondMatrix[i][j])) {
          matchCount+=1;
        }
      }
    }
    return binaryRelation.length === matchCount;
  }

  useEffect(() => {
    if (matrix.length) {
      setResultMatrix(compositionOfMatrix(matrix, secondMatrix));
      setIsSubsetMatrix(matrixIsSubset(matrix, secondMatrix));
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
    const copy = clone(zeroMatrix);
    for (let i = 0; i < copy.length; i++) {
      for (let j = 0; j < copy[i].length; j++) {
        if (comparatorsObj[comparator].func(i, j)) {
          copy[i][j] = 1;
        }
      }
    }
    return copy;
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
          graph['edges'].push({from: namedArray[i], to: namedArray[j]})
        }
      }
    }
    return graph;
  }

  const handleChange = value => setComparator(value);
  const handleOperationChange = value => setOperation(value);
  const handleSecondChange = value => setSecondComparator(value);
  const binaryRelationToString = binaryRelation => binaryRelation.map(a => a.join(', ')).map(a => `(${a})`).join(', ');
  const matrixToLatex = (mathExp) => String.raw`\begin{pmatrix}${mathExp.map(i => i.join(' & ')).join("\\\\\n")}\end{pmatrix}`;

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
      <p className="mb-3">1.2) Бінарне
        відношення: {binaryRelationToString(binaryRelation)}</p>
      <p className="mb-3">Бінарне
        відношення 2: {binaryRelationToString(secondBinaryRelation)}</p>
      <p className="mb-3">1.5) Доповнення до бінарного
        відношення: {binaryRelationToString(additionBinaryRelation)}</p>
      <p className="mb-3">1.7) Обернене бінарне
        відношення: {binaryRelationToString(reverseBinaryRelation)}</p>
      <p className="mb-3">1.8) Двоїсте бінарне
        відношення: {binaryRelationToString(dualBinaryRelation)}</p>

      <div className="mb-5">
        <p className="mb-3">1.3) Бінарне відношення у матричному вигляді:</p>
        <TeX math={matrixToLatex(matrix)}/>
      </div>

      <div className="mb-5">
        <div className="mb-3">
          <i>1.4. З’ясувати які з бінарних відношень із завдання 1.2 вкладаються (строго вкладаються) в інші бінарні
            відношення. </i>
        </div>
        <TeX className="mr-1" math={comparator.math}/>
        {isSubsetMatrix ? <TeX className="mr-1" math='\subset'/> : <TeX className="mr-1" math='\not\subset'/>}
        <TeX className="mr-1" math={secondComparator.math}/>
        <TeX className="mr-1" math='='/>
        <TeX math={matrixToLatex(matrix)}/>
        {isSubsetMatrix ? <TeX className="mr-1" math='\subset'/> : <TeX className="mr-1" math='\not\subset'/>}
        <TeX math={matrixToLatex(secondMatrix)}/>
      </div>


       <div className="mb-5">
        <div className="mb-3">
          <i>1.6. Побудувати бінарні відношення, які є об’єднанням, перетином і різницею бінарних відношень: </i>
        </div>
       <OperationSelector
         initial={operation.value}
         comparatorChanged={handleOperationChange}
       />
       <p className="mb-3">Бінарне відношення {binaryRelationToString(unionOfBinaryRelations)}</p>
      </div>

      <div className="mb-5">
        <div className="mb-3">
          <i>Рефлексивність:</i>
        </div>
        <div className="flex mb-3 items-center">
          <TeX math='E='/>
          <TeX math={matrixToLatex(diagonalMatrix)}/>
          {isReflectMatrix ? <TeX className="mr-1" math='\subset'/> : <TeX className="mr-1" math='\not\subset'/>}
          <TeX math={comparator.math}/>
          <TeX math=', E - діагональне \, відношення'/>
        </div>
        <p>{`Оскільки у матриці на головній діагоналі стоять ${isReflectMatrix ? 'одиниці' : 'нулі'}, то воно ${isReflectMatrix ? 'рефлексивне' : 'не є рефлексивним'}`}</p>
      </div>

      <p
        className="mb-5">{`Оскільки відношення ${isReflectMatrix ? 'рефлексивне' : 'не рефлексивне'}, то воно ${isReflectMatrix ? 'не антирефлексивне' : 'антирефлексивне'}`}</p>

      <div className="mb-5">
        <div className="mb-3">
          <i>Cиметричність:</i>
        </div>
        <div className="flex items-center">
          <TeX className="mr-1" math={comparator.math.replace('R', 'R^{-1}')}/>
          <TeX className="mr-1" math='='/>
          <TeX math={matrixToLatex(symmetricMatrix)}/>
          {isSymmetricMatrix ? <TeX math='='/> : <TeX math='\neq'/>}
          <TeX className="mr-1" math={comparator.math}/>
        </div>
        <p>{`Отже, дане відношення  ${isSymmetricMatrix && !isAntiSymmetricMatrix ? 'симетричне' : 'не симетричне'}`}</p>
      </div>

      <p>{`Дане відношення  ${isASymmetricMatrix ? 'aсиметричне' : 'не aсиметричне'}`}</p>
      <p className="mb-5">{`Дане відношення  ${isAntiSymmetricMatrix ? 'антисиметричне' : 'не антисиметричне'}`}</p>

      <div className="mb-5">
        <div className="mb-3">
          <i>Транзитивність:</i>
        </div>
        <div className="flex mb-3 items-center">
          <TeX className="mr-1" math={comparator.math}/>
          <TeX className="mr-1" math='\circ'/>
          <TeX className="mr-1" math={comparator.math}/>
          <TeX className="mr-1" math='='/>
          <TeX math={matrixToLatex(matrix)}/>
          <TeX className="mr-1" math='\circ'/>
          <TeX math={matrixToLatex(matrix)}/>
          <TeX className="mr-1" math='='/>
          <TeX className="mr-1" math={matrixToLatex(compositionMatrixForTransitive)}/>
          {isTransitiveMatrix ? <TeX className="mr-1" math='\subset'/> : <TeX className="mr-1" math='\not\subset'/>}
          <TeX math={comparator.math}/>
        </div>
        <p>{`Отже, данне відношення  ${isTransitiveMatrix ? 'транзитивне' : 'не транзитивне'}`}</p>
      </div>

      <p className="mb-5">{`Дане відношення  ${!isASymmetricMatrix ? 'циклічне' : 'не циклічне'}`}</p>
      <p className="mb-5">{`Дане відношення  ${isASymmetricMatrix ? 'ациклічне' : 'не ациклічне'}`}</p>
      <p className="mb-5">{`Дане відношення  ${isCompleteMatrix ? 'зв’язне' : 'не зв’язне'}`}</p>

      <p className="m-3">1.9) Композіція бінарних відношень:</p>
      <div className="flex items-center">
        <TeX className="mr-1" math={comparator.math}/>
        <TeX className="mr-1" math='\circ'/>
        <TeX className="mr-1" math={secondComparator.math}/>
        <TeX className="mr-1" math='='/>
        <TeX math={matrixToLatex(matrix)}/>
        <TeX className="mr-1" math='\circ'/>
        <TeX math={matrixToLatex(secondMatrix)}/>
        <TeX className="mr-1" math='='/>
        <TeX className="mr-1" math={matrixToLatex(resultMatrix)}/>
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
