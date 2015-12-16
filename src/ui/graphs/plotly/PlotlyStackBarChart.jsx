/**
 * Created by shazra
 */

import {PlotlyWrapper} from './PlotlyWrapper'

let React = window.React;
let Plotly = window.Plotly

export class PlotlyStackBarChart extends PlotlyWrapper {

  static get propTypes() {
    return {
      labels: React.PropTypes.array.isRequired,
      values1: React.PropTypes.array.isRequired,
      name1: React.PropTypes.string.isRequired,
      values2: React.PropTypes.array.isRequired,
      name2: React.PropTypes.string.isRequired,
      title: React.PropTypes.string.isRequired
    }
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let {labels, values1 , name1, values2, name2, width, height, title} = this.props

    var trace1 = {
      x: labels,
      y: values1,
      name: name1,
      type: 'bar'
    };

    var trace2 = {
      x: labels,
      y: values2,
      name: name2,
      type: 'bar'
    };

    var data = [trace1, trace2];

    var layout = {
      barmode: 'stack',
      title: title
    };
    if (width) layout.width = width
    if (height) layout.height = height

    Plotly.newPlot(this._element, data, layout);
  }

}