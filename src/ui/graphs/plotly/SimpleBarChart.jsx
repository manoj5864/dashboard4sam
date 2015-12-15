/**
 * Created by andi on 14.12.15.
 */

import {PlotlyWrapper} from './PlotlyWrapper'

let React = window.React;
let Plotly = window.Plotly

export class SimpleBarChart extends PlotlyWrapper {

  static get propTypes() {
    return {
      xValues : React.PropTypes.array.isRequired,
      yValues : React.PropTypes.array.isRequired
    }
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let {xValues, yValues, width, height} = this.props
    let data = [
      {
        x: xValues,
        y: yValues,
        type: 'bar'
      }
    ];
    let layout = {}
    if (width) layout.width = width
    if (height) layout.height = height

    Plotly.newPlot(this._element, data, layout);
  }

}