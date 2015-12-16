import {mixin} from '../../util/mixin'
import {TLoggable} from '../../util/logging/TLoggable'
import './util/d3-sankey'
import {ContentPage} from '../main/Content'
import _ from 'lodash';
let d3 = window.d3

class SankeyNode {
  get name() {
    return name
  }

  get nodes() {
    return this._connected_nodes
  }

  addNode(node) {
    if (!(node instanceof SankeyNode)) {
      throw new Error('Node must be of type SankeyNode')
    }
    this._connected_nodes.push(node)
  }

  constructor(name) {
    this._name = name
    this._connected_nodes = []
  }
}

class SankeyGraph extends mixin(null, TLoggable) {

  _init(svg) {
    let width = d3.select(svg).attr('width')
    let height = d3.select(svg).attr('height')

    this._margin = {top: 1, right: 1, bottom: 6, left: 1}
    this._colorHelper = d3.scale.category20()
    this._numberFormater = d3.format(",.0f")
    this._sankey = this._initSankey()
  }

  static _initSankey(width, height) {
    return (
        d3.sankey()
            .nodeWidth(15)
            .nodePadding(10)
            .size([width, height])
    )
  }

  _d3Link() {

  }

  _buildLinks(nodes) {
    let nodeList = []
    let linkList = []

    // Traverse graph
    let counter = 0
    treatNode = (node) => {
      counter += 1
      if (counter == 3) throw new Error('Level of node connection must be <3')
      let nodes = node.nodes
      nodes.forEach(x => {
        nodeList.push(x)
        if (x.nodes.length > 0) treatNode(x)
      })
    }
    nodes.forEach(x => {
      counter = 0
      nodeList.push(x)
      treatNode(x)
    })
  }

  constructor() {
    super()
    console.log("Are we here?")
    this._init()
  }

}

export class SankeyGraphPage extends mixin(React.Component, TLoggable) {

  constructor() {
    super()
  }

  get name() {
    return "Sankey View"
  }

  async componentDidMount() {

    let surfaceManager = new SankeyGraph(this._svgElement)
    /*
     let entities = await app.socioCortexManager.executeQuery(`
     query EntityTypes {
     type {
     name
     }
     }
     `)
     */


  }

  render() {
    var units = ""

    //let getEntities = async () => {
    //  let entities = await app.socioCortexManager.executeQuery(`
    //            query EntityTypes {
    //                type {
    //                    id
    //                    name
    //                }
    //            }
    //        `)
    //  console.log("data: " + entities)
    //}
    //getEntities()

    var margin = {top: 10, right: 10, bottom: 10, left: 10},
        width = 400 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom

    var formatNumber = d3.format(",.0f"),    // zero decimal places
        format = function (d) {
          return formatNumber(d) + " " + units
        },
        color = d3.scale.category20()

// append the svg canvas to the page
    var someDiv = d3.select(ReactFauxDOM.createElement('svg'))
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")")

// Set the sankey diagram properties
    var sankey = d3.sankey()
        .nodeWidth(25)
        .nodePadding(30)
        .size([width, height])

    var path = sankey.link()

// load the data
//    var graph = fetchData()
    var graph = {
      "nodes": [
        {
          "name": "Req 2"
        },
        {
          "name": "Req 3"
        },
        {
          "name": "Req 3c"
        },
        {
          "name": "Req 3b"
        },
        //{
        //  "name": "System for managing customers"
        //},
        {
          "name": "Req 3a"
        },
        {
          "name": "Req 1"
        },
        {
          "name": "Decision 3a"
        },
        {
          "name": "Cloud Services"
        },
        {
          "name": "Decision 2"
        },
        {
          "name": "Decision 3"
        },
        //{
        //  "name": "Application Server"
        //},
        {
          "name": "Architecture 3"
        },
        {
          "name": "Architecture 1"
        },
        {
          "name": "Architecture 2"
        }
      ],
      "links": [
        {
          "source": "Decision 3a",
          "target": "Req 3c",
          "value": 100
        },
        {
          "source": "Cloud Services",
          "target": "Req 1",
          "value": 100
        },
        {
          "source": "Decision 2",
          "target": "Req 2",
          "value": 100
        },
        {
          "source": "Decision 3",
          "target": "Req 3a",
          "value": 33.333333333333336
        },
        {
          "source": "Decision 3",
          "target": "Req 3",
          "value": 33.333333333333336
        },
        {
          "source": "Decision 3",
          "target": "Req 3b",
          "value": 33.333333333333336
        },
        {
          "source": "Architecture 3",
          "target": "Decision 3",
          "value": 50
        },
        {
          "source": "Architecture 3",
          "target": "Decision 3a",
          "value": 50
        },
        {
          "source": "Architecture 1",
          "target": "Cloud Services",
          "value": 100
        },
        {
          "source": "Architecture 2",
          "target": "Decision 2",
          "value": 100
        }
      ]
    }
    var nodeMap = {}
    graph.nodes.forEach(function (x) {
      nodeMap[x.name] = x
    })
    graph.links = graph.links.map(function (x) {
      return {
        source: nodeMap[x.source],
        target: nodeMap[x.target],
        value: x.value
      }
    })

    console.log(graph.nodes)
    //// TODO Change the coding style
    //var indexesToBeRemoved = []
    //var linksExists = false
    //_.forEach(graph.nodes, function(x){
    //    _.forEach(graph.links, function(link){
    //      if (x.name == link.source.name || x.name == link.target.name) {
    //        linksExists = true
    //        return
    //      }
    //    })
    //  if (!linksExists) {
    //    indexesToBeRemoved.push(graph.nodes.indexOf(x))
    //  }
    //  linksExists = false
    //})
    //
    //console.log(indexesToBeRemoved)
    //_.forEach(indexesToBeRemoved, function(x){
    //  graph.nodes.splice(x, 1)
    //})


    sankey
        .nodes(graph.nodes)
        .links(graph.links)
        .layout(32)

// add in the links
    var link = someDiv.append("g").selectAll(".link")
        .data(graph.links)
        .enter().append("path")
        .attr("class", "link")
        .attr("d", path)
        .style("stroke-width", function (d) {
          return Math.max(1, d.dy)
        })
        .sort(function (a, b) {
          return b.dy - a.dy
        })

// add the link titles
    link.append("title")
        .text(function (d) {
          return d.source.name + " -> " +
              d.target.name
        })

// add in the nodes
    var node = someDiv.append("g").selectAll(".node")
        .data(graph.nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function (d) {
          return "translate(" + d.x + "," + d.y + ")"
        })
        .on("click", function () {
          clickAction()
        })
        //.call(d3.behavior.drag()
        //    .origin(function(d) { return d; })
        //    .on("dragstart", function() {
        //      this.parentNode.appendChild(this); })
        //    .on("drag", dragmove))


    function clickAction() {
      console.log("clicked")

    }


    //d3.behavior.drag().call(someDiv.selectAll("g").selectAll(".node"))
    //        .origin(function (d) {
    //          return d
    //        })
    //        .on("dragstart", function () {
    //          this.parentNode.appendChild(this)
    //        })
    //        .on("drag", dragmove)

// add the rectangles for the nodes
    node.append("rect")
        .attr("height", function (d) {
          return d.dy
        })
        .attr("width", sankey.nodeWidth())
        .style("fill", function (d) {
          return d.color = color(d.name.replace(/ .*/, ""))
        })
        .style("stroke", function (d) {
          return d3.rgb(d.color).darker(4)
        })
        .append("title")
        .text(function (d) {
          return d.name
        })

// add in the title for the nodes
    node.append("text")
        .attr("x", -6)
        .attr("y", function (d) {
          return d.dy / 2
        })
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .attr("transform", null)
        .text(function (d) {
          return d.name
        })
        .filter(function (d) {
          return d.x < width / 2
        })
        .attr("x", 4 + sankey.nodeWidth())
        .attr("text-anchor", "start")

    //the function for moving the nodes
    function dragmove(d) {
      d3.select(this).attr("transform",
          "translate(" + (
              d.x = Math.max(0, Math.min(width - d.dx, d3.event.x))
          )
          + "," + (
              d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
          ) + ")")
      sankey.relayout()
      link.attr("d", path)
    }


    return (
        <div id="chart">
          <svg width="800" height="700">
            {someDiv.node().toReact()}
          </svg>
        </div>
    )

  }

}