import React, {useEffect, useState} from "react";
import TextField from "@material-ui/core/TextField";
import {makeStyles} from "@material-ui/core/styles";
import TeX from "@matejmazur/react-katex";
import {useDebouncedCallback} from "use-debounce";
import Zet from 'zet';

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: 200,
    },
  }
}));

function DMTask1() {
  const classes = useStyles();
  
  const [valueA, setValueA] = useState([1,3,4,5,10]);
  const [valueB, setValueB] = useState([3,5,7,8,9]);
  const [valueC, setValueC] = useState([3,5,6,9,10]);
  const [result, setResult] = useState('');
  
  const [result1, setResult1] = useState('');
  const [result2, setResult2] = useState('');
  const [result3, setResult3] = useState('');
  const [result4, setResult4] = useState('');
  const [result5, setResult5] = useState('');
  const [result6, setResult6] = useState('');
  const [result7, setResult7] = useState('');
  const [result8, setResult8] = useState('');
  const [result9, setResult9] = useState('');
  const [result10, setResult10] = useState('');
  const [result11, setResult11] = useState('');
  const [result12, setResult12] = useState('');
  const [result13, setResult13] = useState('');
  const [result14, setResult14] = useState('');
  const [result17, setResult17] = useState('');
  const [result18, setResult18] = useState('');
  const [result19, setResult19] = useState('');
  
  const [debouncedCallbackA] = useDebouncedCallback(value => setValueA(value.split(',').map(Number)),1000);
  const [debouncedCallbackB] = useDebouncedCallback(value => setValueB(value.split(',').map(Number)),1000);
  const [debouncedCallbackC] = useDebouncedCallback(value => setValueC(value.split(',').map(Number)),1000);
  
  useEffect(() => {
    const A = new Zet(valueA);
    const B = new Zet(valueB);
    const C = new Zet(valueC);
    const X = new Zet(Array.from(Array(21).keys()));

    setResult(setToString(Zet.union(valueA, valueB, valueC)));
    setResult1(setToString(A.difference(B).difference(C)));
    setResult2(setToString(A.union(B.difference(C))));
    setResult3(setToString(A.intersection(B.difference(C))));
    setResult4(setToString(A.difference(B.intersection(C))));
    setResult5(setToString(A.difference(B.union(C))));
    setResult6(setToString(A.intersection(B).difference(C)));
    setResult7(setToString(X.difference(A).intersection(B).intersection(C)));
    setResult8(setToString(X.difference(A).intersection(B).union(C)));
    // setResult9(setToString(X.difference(A).intersection(B).union(C)));
    setResult10(setToString(X.difference(A.union(B)).union(C)));
    setResult11(setToString(X.difference(A.intersection(B)).intersection(C)));
    setResult12(setToString(X.difference(A.intersection(B)).union(B)));
    setResult13(setToString(A.union(B.intersection(C))));
    setResult14(setToString(A.intersection(B.union(C))));
    setResult17(setToString(X.difference(A.intersection(X.difference(B))).union(B)));
    setResult18(setToString(A.union(X.difference(B).difference(C))));
    setResult19(setToString(A.union(B.intersection(C))));
  }, [valueA, valueB, valueC]);
  const setToString = set => Array.from(set).sort((a, b) => a-b).join(', ');
  
  return (
    <>
      <p><b>Приклад виконання.</b></p>
      <p>Нехай згенеровані на ЕОМ множини А, В, С складаються з елементів:</p>
      <div className="m-3"><TeX math="A =\{1, 3, 4, 5, 10\}"/></div>
      <div className="m-3"><TeX math="B =\{3, 5, 7, 8,  9\}"/></div>
      <div className="m-3"><TeX math="C =\{3, 5, 6, 9, 10\}"/></div>
      <p>Тоді результат виконання операції перетину цих множин має вигляд:</p>
      <div className="m-3"><TeX math="D = A \cap B \cap C = \{3, 5\}"/></div>
      <p>Примітка. Вважати універсальною множиною Х всі натуральні числа від 0 до 20.</p>
      <form className={classes.root} noValidate autoComplete="off">
        <TextField
          id="standard-basic"
          defaultValue={valueA}
          label="A"
          onChange={e => debouncedCallbackA(e.target.value)}
        />
        <TextField
          id="standard-basic"
          defaultValue={valueB}
          label="B"
          onChange={e => debouncedCallbackB(e.target.value)}
        />
        <TextField
          id="standard-basic"
          defaultValue={valueC}
          label="C"
          onChange={e => debouncedCallbackC(e.target.value)}
        />
      </form>
      <p className="m-3">Декартовий добуток: {result}</p>
      <div className="m-3">
        <TeX>
          {String.raw`1.\ (A \setminus B) \setminus C = ${result1}`}
        </TeX>
      </div>
      <div className="m-3">
        <TeX>
          {String.raw`2.\ A \cup (B \setminus C) = ${result2}`}
        </TeX>
      </div>
      <div className="m-3">
        <TeX>
          {String.raw`3.\ A \cap (B \setminus C) = ${result3}`}
        </TeX>
      </div>
      <div className="m-3">
        <TeX>
          {String.raw`4.\ A \setminus (B \cap C) = ${result4}`}
        </TeX>
      </div>
      <div className="m-3">
        <TeX>{String.raw`5.\ A \setminus (B \cup C) = ${result5}`}
        </TeX>
      </div>
      <div className="m-3">
        <TeX>
          {String.raw`6.\ (A \cap B) \setminus C) = ${result6}`}
        </TeX>
      </div>
      <div className="m-3">
        <TeX>
          {String.raw`7.\ \bar A \cap B \cap C = ${result7}`}
        </TeX>
      </div>
      <div className="m-3">
        <TeX>
          {String.raw`8.\ \bar A \cap (B \cup C) = ${result8}`}
        </TeX>
      </div>
      <div className="m-3">
        <TeX>
          {String.raw`9.\ (A \oplus B) \cup C) = ???`}
        </TeX>
      </div>
      <div className="m-3">
        <TeX>
          {String.raw`10.\ \overline{A \cup B} \cup C = ${result10}`}
        </TeX>
      </div>
      <div className="m-3">
        <TeX>
          {String.raw`11.\ \overline{A \cap B} \cap C = ${result11}`}
        </TeX>
      </div>
      <div className="m-3">
        <TeX>
          {String.raw`12.\ \overline{A \cap B} \cup C = ${result12}`}
        </TeX>
      </div>
      <div className="m-3">
        <TeX>
          {String.raw`13.\ A \cup (B \cap C) = ${result13}`}
        </TeX>
      </div>
      <div className="m-3">
        <TeX>
          {String.raw`14.\ A \cap (B \cup C) = ${result14}`}
        </TeX>
      </div>
      <div className="m-3">
        <TeX>
          {String.raw`15.\ (A \oplus B) \cap C) = ???`}
        </TeX>
      </div>
      <div className="m-3">
        <TeX>
          {String.raw`16.\ A \setminus (B \oplus C) = ???`}
        </TeX>
      </div>
      <div className="m-3">
        <TeX>
          {String.raw`17.\ \overline{A \cap \bar B} \cup C = ${result17}`}
        </TeX>
      </div>
      <div className="m-3">
        <TeX>
          {String.raw`18.\ A \cup (\bar B \setminus C) = ${result18}`}
        </TeX>
      </div>
      <div className="m-3">
        <TeX>
          {String.raw`19.\ A \cup (B \cap C) = ${result19}`}
        </TeX>
      </div>
      <div className="m-3">
        <TeX>
          {String.raw`20.\ (A \oplus B) \cup C) = ???`}
        </TeX>
      </div>
    </>
  );
}

export default DMTask1;
