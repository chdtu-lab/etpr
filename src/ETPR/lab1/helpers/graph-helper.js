export class GraphHelper {
  static generateGraph = (matrix, namedArray) => {
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
}
