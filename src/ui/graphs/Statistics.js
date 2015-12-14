/**
 * Created by sayanh on 12/14/15.
 */
import {mixin} from '../../util/mixin'
import {TLoggable} from '../../util/logging/TLoggable'
import './util/d3-sankey'
import {ContentPage} from '../main/Content'
import ReactFauxDOM from 'react-faux-dom'
import _ from 'lodash';
import {app} from  '../../Application'
let d3 = window.d3

class Statistics extends mixin(null, TLoggable) {

  _init(svg) {
    console.log("Barchart init")
    let w = d3.select(svg).attr('width')
    let h = d3.select(svg).attr('height')
    let r = h / 4

    // TODO- Fetch data from SocioCortex
    // 1st element - % of Architecture elements with task
    // 2nd element - Architecture elements without task
    let data = [70, 30]
    let actualArchitectureElems = 110
    //let actualArchitectureElems = 110
    let color = d3.scale.ordinal()
        .range(["orange", "red"])


    var group = d3.select(svg)
        .append("g")
        .attr("transform", "translate( 200, 200)")

    var arc = d3.svg.arc()
        .innerRadius(0)
        .outerRadius(r)

    var pie = d3.layout.pie()
        .value(function (d) {
          return d
        })

    var arcs = group.selectAll(".arc")
        .data(pie(data))
        .enter()
        .append("g")
        .attr("class", "arc")
        .on("mouseover", function (d) {
          console.log("mouseover action" + d.data)
          d3.select(this)
              .style("stroke-width", "2px")
              .style("stroke", "black")
        })
        .on("mouseout", function (d) {
          d3.select(this)
              .style("stroke-width", "1px")
              .style("stroke", function (d) {
                return color(d.data)
              })
        })

    arcs.append("path")
        .attr("d", arc)
        .attr("fill", function (d) {
          return color(d.data)
        })

    arcs.append("text")
        .attr("font-size", "2em")
        .attr("border", "black")
        .attr("transform", function (d) {
          return "translate(" + arc.centroid(d) + ")"
        })
        .text(function (d) {
          return d.data + "%"
        })
  }

  constructor(svg) {
    super()
    this.svg = svg
    this._init(svg)
  }

}

export class StatisticsPage extends mixin(React.Component, TLoggable) {

  constructor() {
    super()
  }

  get name() {
    return "Statistics"
  }

  componentDidMount() {
    //
    new Statistics(this._svgElement)
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
        <svg width="600" height="600" xmlns="http://www.w3.org/svg/2000" ref={(c) => this._svgElement = c}>
        </svg>
    )
  }
}