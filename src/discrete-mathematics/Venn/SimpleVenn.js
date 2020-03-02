import React from 'react'
import * as d3 from 'd3'
import * as venn from 'venn.js'

class SimpleVenn extends React.Component {
  sets = [
    {sets: ['A'], size: 12},
    {sets: ['B'], size: 12},
    {sets: ['C'], size: 12},
    {sets: ['A','B'], size: 2},
    {sets: ['C','B'], size: 2},
    {sets: ['C','A'], size: 2}
  ];
  chart = venn.VennDiagram();
  
  componentDidMount () {
    d3.select(this.svg).datum(this.sets).call(this.chart);
  }
  
  render () {
    return (
      <>
        <div ref={ svg => this.svg = svg }/>
      </>
    )
  }
}

SimpleVenn.defaultProps = {
  chart: 'loading'
}

export default SimpleVenn
