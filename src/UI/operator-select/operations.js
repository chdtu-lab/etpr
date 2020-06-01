import {OperationsOnRelations} from "../../ETPR/lab1/helpers/operations-on-relations";

export const operationsObj = {
  union: {
    value: 'union',
    math: String.raw`A \cup B`,
    label: "Об'єднання",
    selector: ['(A∩B)', String.raw`(B)\(A∩B)`, String.raw`(A)\(A∩B)`],
    brOperation: OperationsOnRelations.getUnionOfBinaryRelation
  },
  intersection: {
    value: "intersection",
    math: String.raw`A \cap B`,
    label: 'Перетин',
    selector: ['(A∩B)'],
    brOperation: OperationsOnRelations.getIntersectionOfBinaryRelation
  },
  difference: {
    value: 'difference',
    math: String.raw`A \setminus B`,
    label: 'Різниця',
    selector: [String.raw`(A)\(A∩B)`],
    brOperation: OperationsOnRelations.getIntersectionOfBinaryRelation
  },
}
