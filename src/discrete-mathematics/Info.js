import React from "react";
import TeX from "@matejmazur/react-katex";

export default function Info() {
  return (
    <>
      <div className="m-3">
        <TeX className="mr-1" math="A \cup B"/>Об'єднання (Union),
        <TeX className="mx-2" math="A \vee B"/>Диз'юнкція (Disjunction) OR
      </div>
      <div className="m-3">
        <TeX className="mr-1" math="A \cap B"/>Перетин (Intersection)
        <TeX className="mx-2" math="A \wedge B"/>Кон'юнкція (Conjunction) AND
      </div>
      <div className="m-3">
        <TeX className="mr-1" math="A \setminus B"/>Доповнення (Complement)
      </div>
      <div className="m-3">
        <TeX className="mr-1" math="\bar A = X \setminus B"/>Разность (Difference, relative complement)
      </div>
      <div className="m-3">
        <TeX className="mr-1" math="A \subseteq B \leq"/>Підмножина (Subset)
        <TeX className="mr-1" math="A \supseteq B \geq"/>Підмножина (Superset) включено
      </div>
      <div className="m-3">
        <TeX className="mr-1" math="A \subset B \displaystyle <"/>Підмножина (Subset)
        <TeX className="mr-1" math="A \supset B \displaystyle <"/>Підмножина (Subset) строго включено
      </div>
    </>
  );
}
