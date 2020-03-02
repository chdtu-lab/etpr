import React from "react";
import SimpleExpansionPanel from "../UI/SimpleExpansionPanel";
import Info from "./Info";
import SetCalculator from "./SetCalculator";
import DMTask1 from "./DMTask1";
import SelectableVenn from "./Venn/SelectableVenn";
// import SimpleVenn from "./SimpleVenn";
import SelectableVennClass from "./Venn/SelectableVennClass";

export default function DM() {
  const sets2 = [
    { "sets": ["A"], "size": 12, "label": "A" },
    { "sets": ["B"], "size": 12, "label": "B" },
    { "sets": ['A', "B"], "size": 2 },
  ];
  
  // const selectors2 = ['(A∩B)', String.raw`(B)\(A∩B)`, String.raw`(A)\(A∩B)`];
  const selectors2 = ['(A∩B)'];
  
  const sets3 = [
    { "sets": [0], "size": 12, "label": "A" },
    { "sets": [1], "size": 12, "label": "B" },
    { "sets": [2], "size": 12, "label": "C" },
    { "sets": [0, 1], "size": 2 },
    { "sets": [0, 2], "size": 2 },
    { "sets": [1, 2], "size": 2 },
    { "sets": [0, 1, 2], "size": 2 }
  ];
  
  return (
    <>
      <SimpleExpansionPanel>
        <Info/>
      </SimpleExpansionPanel>
      <SetCalculator/>
      <DMTask1/>
      <SelectableVennClass sets={sets2} selectors={selectors2}/>
      <SelectableVenn sets={sets3}/>
      {/*<SimpleVenn/>*/}
    </>
  );
}
