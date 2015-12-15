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

  _addPieChartForArchitectureTasks(r, centerX, centerY, svg, colors,
                                   data, categories, uniqueIdentifier) {


    var total = _.reduce(data, function (sum, el) {
      return sum + el
    }, 0)

    var percentageData = _.map(data, function (x) {
      return x / total * 100
    })



    let colorArchiTask = d3.scale.ordinal()
        .range(colors)


    var group = d3.select(svg)
        .append("g")
        .attr("transform", "translate( " + centerX + ", " + centerY + ")")

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

    var arcs = group.selectAll(".arc" + uniqueIdentifier)
        .data(pie(percentageData))
        .enter()
        .append("g")
        .attr("class", "arc" + uniqueIdentifier)
        .attr("fill-opacity", ".7")
        .attr("stroke-width", "1px")
    d3.selectAll(".arc" + uniqueIdentifier).on("mouseover", function () {
          var element = $(this)

          selectArc(element[0])
        })
        .on("mouseout", function () {
          var element = $(this)

          deselectArc(element[0])
        })

    arcs.append("path")
        .attr("d", arc)
        .attr("fill", function (d) {
          return colorArchiTask(d.data)
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
        .attr("class", "legend" + uniqueIdentifier)

    _.forEach(categories, function (x) {
      d3.selectAll(".legend" + uniqueIdentifier).append("rect")
          .attr("class", uniqueIdentifier)
          .attr("id", uniqueIdentifier + categories.indexOf(x))
          .attr("width", 20)
          .attr("height", 20)
          .attr("x", -70)
          .attr("y", (categories.indexOf(x) * 25 + 155))
          .attr("fill", colorArchiTask(data[categories.indexOf(x)]))
          .attr("fill-opacity", .7)
          .attr("stroke-opacity", 0.8)
      d3.selectAll(".legend" + uniqueIdentifier).append("text")
          .attr("x", -40)
          .attr("y", 155 + (categories.indexOf(x) + 1) * 20)
          .text(x)
    })

    d3.selectAll(".legend"+uniqueIdentifier).selectAll("."+uniqueIdentifier)
        .on("mouseover", function () {
          var contextId = $(this).context.id
          d3.select(this)
              .attr("fill-opacity", "1")
          var element = d3.selectAll(".arc" + uniqueIdentifier)[0][0]
          if (contextId == "archiTask1" || contextId == "archiDeci1") {
            element = d3.selectAll(".arc" + uniqueIdentifier)[0][1]
          }
          selectArc(element)
        })
        .on("mouseout", function () {
          var contextId = $(this).context.id
          d3.select(this)
              .attr("fill-opacity", ".7")
          var element = d3.selectAll(".arc" + uniqueIdentifier)[0][0]
          if (contextId == "archiTask1" || contextId == "archiDeci1") {
            element = d3.selectAll(".arc" + uniqueIdentifier)[0][1]
          }
          deselectArc(element)
        })
  }

  _init(svg) {
    let w = d3.select(svg).attr('width')
    let h = d3.select(svg).attr('height')
    let r = 130
    // TODO- Fetch data from SocioCortex
    // 1st element - % of Architecture elements with task
    // 2nd element - Architecture elements without task
    let archiTaskCategories = ["Architecture with task", "Archtecture without task"]
    let archiTaskData = [70, 30] // Fetch from the datasource
    let architectureTaskColors = ["orange", "red"]
    let uniqueIdentifier = "archiTask"
    this._addPieChartForArchitectureTasks(r, 200, 150, svg, architectureTaskColors,
        archiTaskData, archiTaskCategories, uniqueIdentifier)

    // TODO- Fetch data from SocioCortex
    let archiDecisionCategories = ["Architecture with decision", "Archtecture without decision"]
    let archiDecisionData = [70, 30] // Fetch from the datasource
    let architectureDecisionColors = ["green", "red"]
    uniqueIdentifier = "archiDeci"
    this._addPieChartForArchitectureTasks(r, 200, 500, svg, architectureDecisionColors,
        archiDecisionData, archiDecisionCategories, uniqueIdentifier)

    //this._addPieChartForArchitectureTasks(r, 200, 800, svg)



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
        <svg width="600" height="1600" xmlns="http://www.w3.org/svg/2000" ref={(c) => this._svgElement = c}>
        </svg>
    )
  }
}