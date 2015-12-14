import {mixin} from '../../util/mixin'
import {TLoggable} from '../../util/logging/TLoggable'
import './util/d3-sankey'
import {ContentPage} from '../main/Content'
import ReactFauxDOM from 'react-faux-dom'
import _ from 'lodash';
import {app} from  '../../Application'
let d3 = window.d3

class BarChart extends mixin(null, TLoggable) {

  _init(svg) {
    console.log("Barchart init")
    let width = d3.select(svg).attr('width')
    let height = d3.select(svg).attr('height')


    var data = [4, 8, 15, 16, 23, 42];

    var x = d3.scale.linear()
        .domain([0, d3.max(data)])
        .range([0, 420]);

    var y = d3.scale.ordinal()
        .domain(data)
        .rangeBands([0, 120]);

    var chart = d3.select(svg)
        .attr("class", "chart")
        .attr("width", 420)
        .attr("height", 20 * data.length);

    chart.selectAll("rect")
        .data(data)
        .enter().append("rect")
        .attr("y", y)
        .attr("width", x)
        .attr("height", y.rangeBand());

    chart.selectAll("text")
        .data(data)
        .enter().append("text")
        .attr("x", x)
        .attr("y", function(d) { return y(d) + y.rangeBand() / 2; })
        .attr("dx", -3) // padding-right
        .attr("dy", ".35em") // vertical-align: middle
        .attr("text-anchor", "end") // text-align: right
        .text(String);

  }

  constructor(svg) {
    super()
    this.svg = svg
    this._init(svg)
  }

}

export class BarChartPage extends mixin(React.Component, TLoggable) {

  constructor() {
    super()
  }

  get name() {
    return "BarChart View"
  }

  componentDidMount() {
  //
    new BarChart(this._svgElement)
  //  let entities = await app.socioCortexManager.executeQuery(`
  //   query EntityTypes {
  //                  type {
  //                      id
  //                      name
  //                  }
  //              }
  //   `)
  //
  //  console.log(entities)
  //
  }

  render() {
    console.log("render")
    return (
        <svg width="100%" height="100%" xmlns="http://www.w3.org/svg/2000" ref={(c) => this._svgElement = c}>
        </svg>
    )
  }
}