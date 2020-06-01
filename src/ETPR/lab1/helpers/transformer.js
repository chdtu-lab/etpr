import fill from "lodash/fill";

export class Transformer {
  static clone = (items) => items.map(item => Array.isArray(item) ? this.clone(item) : item);

  static binaryRelationToString = binaryRelation => binaryRelation.map(a => a.join(', ')).map(a => `(${a})`).join(', ');

  static matrixToLatex = (mathExp) => String.raw`\begin{pmatrix}${mathExp.map(i => i.join(' & ')).join("\\\\\n")}\end{pmatrix}`;

  static matrixToBinaryRelation = (matrix, array) => {
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

  static binaryRelationToMatrix = (br, array) => {
    const zeroArray = fill(Array([...new Set(br.flat())].length), 0);
    const zeroMatrix = this.clone(zeroArray.map(() => zeroArray));
    for (const b of br) {
      zeroMatrix[array.indexOf(b[0])][array.indexOf(b[1])] = 1;
    }
    return zeroMatrix;
  }

  static addTitleToMatrix = (matrix, titles) => {
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
}
