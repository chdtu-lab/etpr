import {product} from "iter-tools/es2015";

import {comparatorsObj} from "../relation-select/comparators";

export class BinaryRelation {
  static createBinaryRelation = (array, predicate, comparator, isReverse) => {
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

  static binaryRelationsIncludes = (br1, br2) => {
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
}
