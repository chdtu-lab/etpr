import lt from 'lodash/lt';
import lte from 'lodash/lte';
import gte from 'lodash/gte';
import gt from 'lodash/gt';
import eq from 'lodash/eq';

export const comparatorsObj = {
  eq: {
    value: 'eq',
    math: 'R_{x=y}',
    label: 'дорівнює',
    func: eq
  },
  neq: {
    value: 'neq',
    math: String.raw`R_{x \neq y}`,
    label: 'не дорівнює',
    func: (a, b) => !eq(a, b),
  },
  gt: {
    value: 'gt',
    math: 'R_{x > y}',
    label: 'більше',
    func: gt
  },
  lt: {
    value: 'lt',
    math: 'R_{x < y}',
    label: 'менше',
    func: lt
  },
  gte: {
    value: 'gte',
    math: String.raw`R_{x \geq y}`,
    label: "не менше",
    func: gte
  },
  lte: {
    value: 'lte',
    math: String.raw`R_{x \leq y}`,
    label: "не більше",
    func: lte
  },
}
