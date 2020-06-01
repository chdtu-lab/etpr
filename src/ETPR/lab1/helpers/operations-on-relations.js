export class OperationsOnRelations {
  static getUnionOfBinaryRelation = (br1, br2) => {
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

  static getIntersectionOfBinaryRelation = (br1, br2) => {
    const intersection = [];
    for (const b1 of br1) {
      for (const b2 of br2) {
        if (b1[0] === b2[0] && b1[1] === b2[1]) {
          intersection.push([b1[0], b1[1]]);
        }
      }
    }
    return intersection;
  }

  static getDifferenceOfBinaryRelation = (br1, br2) => {
    const difference = [];
    for (const br1Element of br1) {
      const index = br2.findIndex(i => i[0] === br1Element[0] && i[1] === br1Element[1]);
      if (index === -1) {
        difference.push(br1Element);
      }
    }
    return difference;
  }
}
