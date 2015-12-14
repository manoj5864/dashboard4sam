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

    var total = _.reduce(data, function (sum, el) {
      return sum + el
    }, 0)

    var percentageData = _.map(data, function (x) {
      return x / total * 100
    })

    let categories = ["Architecture with task", "Archtecture without task"]
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

    function selectArc(element) {
      element.style.fillOpacity = 1
      element.style.strokeWidth = "2px"
    }

    function deselectArc(element) {
      element.style.fillOpacity = .7
      element.style.strokeWidth = "1px"
    }

    var arcs = group.selectAll(".arc")
        .data(pie(percentageData))
        .enter()
        .append("g")
        .attr("class", "arc")
        .attr("fill-opacity", ".7")
        .attr("stroke-width", "1px")
    d3.selectAll(".arc").on("mouseover", function () {
          var element = $(this)
              //.style("fillOpacity", 1)
              //.style("strokeWidth", "2px")
          selectArc(element[0])
        })
        .on("mouseout", function () {
          //var element = d3.select(this)
          var element = $(this)
          //d3.select(this)
          //    .style("fillOpacity", .7)
          //    .style("strokeWidth", "1px")
          deselectArc(element[0])
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

    // Adding a legend

    var legendWidth = 250
    group.append("g")
        .attr("class", "legend")

    _.forEach(categories, function (x) {
      d3.selectAll(".legend").append("rect")
          .attr("class", "architecture")
          .attr("id", "architecture" + categories.indexOf(x))
          .attr("width", 20)
          .attr("height", 20)
          //.attr("transform", "translate(150, " + (categories.indexOf(x) * 25 + 55) + ")")
          .attr("x", 160)
          .attr("y", (categories.indexOf(x) * 25 + 55))
          .attr("fill", color(data[categories.indexOf(x)]))
          .attr("fill-opacity", .7)
          .attr("stroke-opacity", 0.8)
      d3.selectAll(".legend").append("text")
          .attr("x", 200)
          .attr("y", 55 + (categories.indexOf(x) + 1) * 20)
          .text(x)
    })

    d3.selectAll(".legend").selectAll(".architecture")
        .on("mouseover", function () {
          var contextId = $(this).context.id
          d3.select(this)
              .attr("fill-opacity", "1")
          var element = d3.selectAll(".arc")[0][0]
          if (contextId == "architecture1") {
            element = d3.selectAll(".arc")[0][1]
          }
          selectArc(element)
        })
        .on("mouseout", function () {
          var contextId = $(this).context.id
          d3.select(this)
              .attr("fill-opacity", ".7")
          var element = d3.selectAll(".arc")[0][0]
          if (contextId == "architecture1") {
            element = d3.selectAll(".arc")[0][1]
          }
          deselectArc(element)
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