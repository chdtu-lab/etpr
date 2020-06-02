import lt from 'lodash/lt';
import lte from 'lodash/lte';
import gte from 'lodash/gte';
import gt from 'lodash/gt';
import eq from 'lodash/eq';
import {gcd} from 'mathjs';

export const comparatorsObj = {
  eq: {
    value: 'eq',
    math: 'R_{x=y}',
    label: 'дорівнює',
    func: eq,
    isComplete: false,
  },
  neq: {
    value: 'neq',
    math: String.raw`R_{x \neq y}`,
    label: 'не дорівнює',
    func: (a, b) => !eq(a, b),
    isComplete: true,
  },
  gt: {
    value: 'gt',
    math: 'R_{x > y}',
    label: 'більше',
    func: gt,
    isComplete: true,
  },
  lt: {
    value: 'lt',
    math: 'R_{x < y}',
    label: 'менше',
    func: lt,
    isComplete: true,
  },
  gte: {
    value: 'gte',
    math: String.raw`R_{x \geq y}`,
    label: "не менше",
    func: gte,
    isComplete: true,
  },
  lte: {
    value: 'lte',
    math: String.raw`R_{x \leq y}`,
    label: "не більше",
    func: lte,
    isComplete: true,
  },
  dev2: {
    value: 'dev2',
    math: '(a + b) \\% 2 = 0',
    label: "сума двох чисел ділитися на 2",
    func: (a, b) => (a + b) % 2 === 0,
    isComplete: false,
  },
  gcdr: {
    value: 'gcdr',
    math: String.raw`gcd(a, b) = 1`,
    label: "є взаємно простими",
    func: (a, b) => gcd(a, b) === 1,
    isComplete: false,
  },
}
