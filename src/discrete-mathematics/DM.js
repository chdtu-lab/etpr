import React from "react";
import SimpleExpansionPanel from "../UI/SimpleExpansionPanel";
import Info from "./Info";
import SetCalculator from "./SetCalculator";
import DMTask1 from "./DMTask1";
import SelectableVenn from "./SelectableVenn";
import SimpleVenn from "./SimpleVenn";

export default function DM() {
  const sets2 = [
    { "sets": [0], "size": 12, "label": "A" },
    { "sets": [1], "size": 12, "label": "B" },
    { "sets": [0, 1], "size": 2 },
  ];
  
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
      <SelectableVenn sets={sets2}/>
      <SelectableVenn sets={sets3}/>
      <SimpleVenn/>
    </>
  );
}
