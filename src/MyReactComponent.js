import React from 'react'
import * as d3 from 'd3'
import {withFauxDOM} from 'react-faux-dom'
import * as venn from 'venn.js'

class MyReactComponent extends React.Component {
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
    const faux = this.props.connectFauxDOM('div', 'chart');
    d3.select(faux).datum(this.sets).call(this.chart);
    this.props.animateFauxDOM(800)
  }
  
  render () {
    return (
      <>
        <div className='renderedD3'>
          {this.props.chart}
        </div>
      </>
    )
  }
}

MyReactComponent.defaultProps = {
  chart: 'loading'
}

export default withFauxDOM(MyReactComponent)
