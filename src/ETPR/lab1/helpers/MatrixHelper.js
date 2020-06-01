import fill from "lodash/fill";
import {comparatorsObj} from "../relation-select/comparators";
import {Transformer} from "./transformer";

export class MatrixHelper {

  static clone = (items) => items.map(item => Array.isArray(item) ? this.clone(item) : item);

  static getSymmetricMatrix = (matrix) => {
    const zeroArray = fill(Array(matrix.length), 0);
    const zeroMatrix = this.clone(zeroArray.map(() => zeroArray));
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j]) {
          zeroMatrix[j][i] = 1;
        }
      }
    }
    return zeroMatrix
  }

  static fillMatrix = (zeroMatrix, comparator) => {
    const copy = this.clone(zeroMatrix);
    for (let i = 0; i < copy.length; i++) {
      for (let j = 0; j < copy[i].length; j++) {
        if (comparatorsObj[comparator].func(i, j)) {
          copy[i][j] = 1;
        }
      }
    }
    return copy;
  }

  static compositionOfMatrix = (array, matrix, secondMatrix) => {
    const BR1 = Transformer.matrixToBinaryRelation(matrix, array);
    const BR2 = Transformer.matrixToBinaryRelation(secondMatrix, array);
    const zeroArray = fill(Array(matrix.length), 0);
    const zeroMatrix = this.clone(zeroArray.map(() => zeroArray));
    for (const br1 of BR1) {
      for (const br2 of BR2) {
        if (br1[1] === br2[0]) {
          zeroMatrix[array.indexOf(br1[0])][array.indexOf(br2[1])] = 1;
        }
      }
    }
    return zeroMatrix;
  }

  // https://stackoverflow.com/a/48694670/5774395
  // math.multiply(math.matrix(matrix), math.matrix(secondMatrix));
  static matrixDot = (A, B) => {
    let result = new Array(A.length).fill(0).map(() => new Array(B[0].length).fill(0));
    return result.map((row, i) => {
      return row.map((val, j) => {
        return A[i].reduce((sum, elm, k) => sum + (elm * B[k][j]), 0)
      })
    })
  }
}
