export class MatrixChecker {

  static checkAntiSymmetricMatrix = (matrix) => {
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (Boolean(matrix[i][j]) && Boolean(matrix[j][i]) && !(i === j)) {
          return false
        }
      }
    }
    return true
  }

  static checkASymmetricMatrix = (matrix) => {
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (Boolean(matrix[i][j]) && Boolean(matrix[j][i])) {
          return false
        }
      }
    }
    return true
  }

  static checkCompleteMatrix = (matrix) => {
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (!matrix[i][j]) {
          return false;
        }
      }
    }
    return true;
  }

  static checkReflectiveMatrix = (matrix) => {
    const indexes = [...new Array(matrix.length)].map((n, index) => [index, index]);
    let count = 0;
    for (const indexe of indexes) {
      if (matrix[indexe[0]][indexe[1]] === 1) {
        count += 1;
      }
    }
    return matrix.length === count;
  }

  static checkSymmetricMatrix = (matrix) => {
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (!(matrix[i][j] === matrix[j][i])) {
          return false
        }
      }
    }
    return true
  }
}
