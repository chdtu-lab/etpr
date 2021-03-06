import React, {useEffect, useState} from "react";
import {useDebouncedCallback} from "use-debounce";

import TextField from "@material-ui/core/TextField";
import {makeStyles} from "@material-ui/core/styles";

import fill from 'lodash/fill';
import Graph from "react-graph-vis";
import TeX from "@matejmazur/react-katex";
import 'katex/dist/katex.min.css';

import RelationSelector from "./relation-select/RelationSelector";
import OperationSelector from "../../UI/operator-select/OperationSelector";

import {GraphHelper} from "./helpers/graph-helper";
import {Transformer} from "./helpers/transformer";
import {MatrixChecker} from "./helpers/matrix-checker";
import {MatrixHelper} from "./helpers/MatrixHelper";
import {BinaryRelation} from "./helpers/binary-relation";

import {operationsObj} from "../../UI/operator-select/operations";
import {comparatorsObj} from "./relation-select/comparators";

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
  const [resultOfOperationOnBinaryRelations, setResultOfOperationOnBinaryRelations] = useState([]);
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
    setBinaryRelation(BinaryRelation.createBinaryRelation(array, is, comparator.value, false));
    setSecondBinaryRelation(BinaryRelation.createBinaryRelation(array, is, secondComparator.value, false));
    setAdditionBinaryRelation(BinaryRelation.createBinaryRelation(array, not, comparator.value, false));
    setReverseBinaryRelation(BinaryRelation.createBinaryRelation(array, is, comparator.value, true));
    setDualBinaryRelation(BinaryRelation.createBinaryRelation(array, not, comparator.value, true));
    
    const zeroArray = fill(Array(array.length), 0);
    const zeroMatrix = clone(zeroArray.map(() => zeroArray));
    setDiagonalMatrix(MatrixHelper.fillMatrix(zeroMatrix, comparatorsObj.eq.value));
  }, [comparator, secondComparator, array]);
  
  useEffect(() => {
    setMatrix(Transformer.binaryRelationToMatrix(binaryRelation, array))
  }, [binaryRelation]);
  
  useEffect(() => {
    const zeroArray = fill(Array(array.length), 0);
    const zeroMatrix = clone(zeroArray.map(() => zeroArray));
    const filledMatrix = MatrixHelper.fillMatrix(zeroMatrix, secondComparator.value);
    setSecondMatrix(filledMatrix);
  }, [secondComparator, array]);
  
  const checkTransitiveMatrix = (matrix) => {
    if (matrix.length) {
      const compositionOfBR = Transformer.matrixToBinaryRelation(MatrixHelper.compositionOfMatrix(array, matrix, matrix), array);
      const br = Transformer.matrixToBinaryRelation(matrix, array);
      const compositionMatrix = Transformer.binaryRelationToMatrix(compositionOfBR, array);
      setCompositionMatrixForTransitive(compositionMatrix);
      return BinaryRelation.binaryRelationsIncludes(br, compositionOfBR);
    }
  }
  
  useEffect(() => {
    if (matrix.length) {
      setGraph(GraphHelper.generateGraph(matrix, array));
      setSymmetricMatrix(MatrixHelper.getSymmetricMatrix(matrix));
      
      setIsReflectMatrix(MatrixChecker.checkReflectiveMatrix(matrix));
      setIsSymmetricMatrix(MatrixChecker.checkSymmetricMatrix(matrix));
      setIsASymmetricMatrix(MatrixChecker.checkASymmetricMatrix(matrix));
      setIsAntiSymmetricMatrix(MatrixChecker.checkAntiSymmetricMatrix(matrix));
      // setIsCompleteMatrix(MatrixChecker.checkCompleteMatrix(matrix));
      
      setIsTransitiveMatrix(checkTransitiveMatrix(matrix));
    }
  }, [matrix]);
  
  useEffect(() => {
    setResultOfOperationOnBinaryRelations(operationsObj[operation.value].brOperation(binaryRelation, secondBinaryRelation));
  }, [binaryRelation, secondBinaryRelation, operation]);
  
  useEffect(() => {
    if (matrix.length) {
      setResultMatrix(MatrixHelper.compositionOfMatrix(array, matrix, secondMatrix));
      setIsSubsetMatrix(MatrixChecker.matrixIsSubset(binaryRelation, matrix, secondMatrix));
    }
  }, [matrix, secondMatrix]);
  
  const handleChange = value => setComparator(value);
  const handleOperationChange = value => setOperation(value);
  const handleSecondChange = value => setSecondComparator(value);
  
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
        відношення: {Transformer.binaryRelationToString(binaryRelation)}</p>
      <p className="mb-3">Бінарне
        відношення 2: {Transformer.binaryRelationToString(secondBinaryRelation)}</p>
      <p className="mb-3">1.5) Доповнення до бінарного
        відношення: {Transformer.binaryRelationToString(additionBinaryRelation)}</p>
      <p className="mb-3">1.7) Обернене бінарне
        відношення: {Transformer.binaryRelationToString(reverseBinaryRelation)}</p>
      <p className="mb-3">1.8) Двоїсте бінарне
        відношення: {Transformer.binaryRelationToString(dualBinaryRelation)}</p>
      
      <div className="mb-5">
        <p className="mb-3">1.3) Бінарне відношення у матричному вигляді:</p>
        <TeX math={Transformer.matrixToLatex(matrix)}/>
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
        <TeX math={Transformer.matrixToLatex(matrix)}/>
        {isSubsetMatrix ? <TeX className="mr-1" math='\subset'/> : <TeX className="mr-1" math='\not\subset'/>}
        <TeX math={Transformer.matrixToLatex(secondMatrix)}/>
      </div>
      
      
      <div className="mb-5">
        <div className="mb-3">
          <i>1.6. Побудувати бінарні відношення, які є об’єднанням, перетином і різницею бінарних відношень: </i>
        </div>
        <OperationSelector
          initial={operation.value}
          comparatorChanged={handleOperationChange}
        />
        <p className="mb-3">Бінарне
          відношення {Transformer.binaryRelationToString(resultOfOperationOnBinaryRelations)}</p>
      </div>
      
      <div className="mb-5">
        <div className="mb-3">
          <i>Рефлексивність:</i>
        </div>
        <div className="flex mb-3 items-center">
          <TeX math='E='/>
          <TeX math={Transformer.matrixToLatex(diagonalMatrix)}/>
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
          <TeX math={Transformer.matrixToLatex(symmetricMatrix)}/>
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
          <TeX math={Transformer.matrixToLatex(matrix)}/>
          <TeX className="mr-1" math='\circ'/>
          <TeX math={Transformer.matrixToLatex(matrix)}/>
          <TeX className="mr-1" math='='/>
          <TeX className="mr-1" math={Transformer.matrixToLatex(compositionMatrixForTransitive)}/>
          {isTransitiveMatrix ? <TeX className="mr-1" math='\subset'/> : <TeX className="mr-1" math='\not\subset'/>}
          <TeX math={comparator.math}/>
        </div>
        <p>{`Отже, данне відношення  ${isTransitiveMatrix ? 'транзитивне' : 'не транзитивне'}`}</p>
      </div>
      
      <p className="mb-5">{`Дане відношення  ${!isASymmetricMatrix ? 'циклічне' : 'не циклічне'}`}</p>
      <p className="mb-5">{`Дане відношення  ${isASymmetricMatrix ? 'ациклічне' : 'не ациклічне'}`}</p>
      <p className="mb-5">
        {`Дане відношення  ${comparatorsObj[comparator.value].isComplete ? 'зв’язне' : 'не зв’язне'}`}
      </p>
      
      <p className="m-3">1.9) Композіція бінарних відношень:</p>
      <div className="flex items-center">
        <TeX className="mr-1" math={comparator.math}/>
        <TeX className="mr-1" math='\circ'/>
        <TeX className="mr-1" math={secondComparator.math}/>
        <TeX className="mr-1" math='='/>
        <TeX math={Transformer.matrixToLatex(matrix)}/>
        <TeX className="mr-1" math='\circ'/>
        <TeX math={Transformer.matrixToLatex(secondMatrix)}/>
        <TeX className="mr-1" math='='/>
        <TeX className="mr-1" math={Transformer.matrixToLatex(resultMatrix)}/>
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
