import React, {useCallback, useEffect, useState} from 'react'
import * as d3 from 'd3'
import * as venn from 'venn.js'

export default function SelectableVenn(props) {
  
  const getIntersectionAreasMapping = () => {
    let intersectionAreasMapping = {};
    let vennAreas = d3.selectAll(".venn-area");
    vennAreas.each((areaData, areaIdx, areas) => {
      let area = areas[areaIdx];
      let areaSets = areaData.sets;
      let areaSelection = d3.select(area);
      let areaD = areaSelection.select("path").attr("d");
      let areaSetsId = area.dataset.vennSets;
      let intersectedAreas = d3.selectAll(".venn-area")
        .filter((cAreaData, cAreaIdx, cAreas) => {
          let cAreaSetsId = cAreas[cAreaIdx].dataset.vennSets;
          let cAreaSets = cAreaData.sets;
          let isContained = areaSets.every(setId => cAreaSets.indexOf(setId) > -1);
          return (isContained && cAreaSetsId !== areaSetsId);
        })
        .nodes()
        .map(intersectedArea => {
          let intersectedAreaSelection = d3.select(intersectedArea);
          return {
            sets: intersectedAreaSelection.data()[0].sets,
            d: intersectedAreaSelection.select("path").attr("d")
          }
        });
      
      intersectionAreasMapping[areaSetsId] = {
        vennArea: {
          sets: areaSets,
          d: areaD
        },
        intersectedAreas: intersectedAreas
      };
    });
    return intersectionAreasMapping;
  }
  
  const appendVennAreaParts = (svg, intersectionAreasMapping) => {
    for (let areaSetsId in intersectionAreasMapping) {
      let intersectionAreasItem = intersectionAreasMapping[areaSetsId];
      let vennArea = intersectionAreasItem.vennArea;
      let intersectedAreas = intersectionAreasItem.intersectedAreas;
      let partId = getPartId(vennArea, intersectedAreas);
      let d = [vennArea.d].concat(intersectedAreas.map(intersectedArea => intersectedArea.d));
      appendVennAreaPart(svg, d.join(""), partId);
    }
  }
  
  const appendLabels = (svg, labels) => {
    labels.nodes().forEach(label => {
      svg.append(function() {
        return label;
      });
    });
  }
  
  const appendVennAreaPart = (svg, d, partId) => {
    svg.append("g")
      .attr("class", "venn-area-part")
      .attr("venn-area-part-id", partId)
      .append("path")
      .attr("d", d)
      .attr("fill-rule", "evenodd");
  }
  
  const appendPatterns = (defs) => {
    let colors = ["none", "#009fdf"];
    colors.forEach((color, idx) => {
      let diagonal = defs.append("pattern")
        .attr("id", "diagonal" + idx)
        .attr("patternUnits", "userSpaceOnUse")
        .attr("width", "10")
        .attr("height", "10");
      diagonal.append('rect')
        .attr("width", "10")
        .attr("height", "10")
        .attr("x", "0")
        .attr("y", "0")
        .attr("fill", color)
        .attr("fill-opacity", "0.15");
      diagonal.append("path")
        .attr("d", "M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2")
        .attr("stroke", "#000000")
        .attr("opacity", "1")
        .attr("stroke-width", "1");
    })
  }
  
  const getPartId = (vennArea, intersectedAreas) => {
    let partId = "(" + vennArea.sets.join("∩") + ")";
    partId += intersectedAreas.length > 1 ? "\\(" : "";
    partId += intersectedAreas.length === 1 ? "\\" : "";
    partId += intersectedAreas.map(intersectedArea => intersectedArea.sets).map(set => "(" + set.join("∩") + ")").join("∪");
    partId += intersectedAreas.length > 1 ? ")" : "";
    return partId;
  }
  
  const bindVennAreaPartListeners = (div) => {
    div.selectAll("g")
      .on("mouseover", function(d, i) {
        let node = d3.select(this);
        let nodePath = node.select("path");
        let nodeAlreadySelected = node.classed("selected");
        nodePath.attr("style", nodeAlreadySelected ? "fill: url(#diagonal1)" : "fill: #009fdf; fill-opacity: 0.15");
      })
      .on("mouseout", function(d, i) {
        let node = d3.select(this);
        let nodePath = node.select("path");
        let nodeAlreadySelected = node.classed("selected");
        nodePath.attr("style", nodeAlreadySelected ? "fill: url(#diagonal0)" : "fill: #ffffff");
      })
      .on("click", function(d,i) {
        let node = d3.select(this);
        let nodePath = node.select("path");
        let nodeAlreadySelected = node.classed("selected");
        let nodePathStyle = (!nodeAlreadySelected ? "fill: url(#diagonal1)" : "fill: #ffffff");
        nodePath.attr("style", nodePathStyle);
        node.classed("selected", !nodeAlreadySelected);
      });
  }
  
  const removeOriginalVennAreas = () => {
    d3.selectAll("g.venn-area").remove();
  }
  
  const clear = () => {
    d3.selectAll("g").classed("selected", false);
    d3.selectAll("path").attr("style", "fill: #ffffff");
  }
  
  const selectNode = DOMnode => {
    let node = d3.select(DOMnode);
    let nodePath = node.select("path");
    let nodeAlreadySelected = node.classed("selected");
    let nodePathStyle = (!nodeAlreadySelected ? "fill: url(#diagonal0)" : "fill: #ffffff");
    nodePath.attr("style", nodePathStyle);
    node.classed("selected", !nodeAlreadySelected);
  }
  
  const fillVenn = () => {
    for (const selector of props.selectors) {
      const relationSelector = selector.replace(String.fromCharCode(92), String.fromCharCode(92, 92));
      const select = `g[venn-area-part-id='${relationSelector}']`;
      const node = svg.select(select).node();
      if (node) {
        selectNode(node);
      }
    }
  }
  
  const [svg, setSVG] = useState(null);
  
  const measuredRef = useCallback(node => {
    if (node !== null) {
      const chart = venn.VennDiagram();
      const div = d3.select(node).datum(props.sets).call(chart);
      const svg = div.select("svg");
      setSVG(svg);
      const defs = svg.append("defs");
      const labels = div.selectAll("text").remove();
  
      appendPatterns(defs);
      const intersectionAreasMapping = getIntersectionAreasMapping();
      appendVennAreaParts(svg, intersectionAreasMapping);
      appendLabels(svg, labels);
      bindVennAreaPartListeners(div);
      removeOriginalVennAreas();
    }
  }, []);
  
  useEffect(() => {
    if (svg !== null && props.selectors) {
      clear();
      fillVenn();
    }
  }, [props.selectors, svg]);
  
  return (
    <>
      <div id="venn" ref={measuredRef}>
      </div>
    </>
  )
}

SelectableVenn.defaultProps = {
  chart: 'loading'
}
