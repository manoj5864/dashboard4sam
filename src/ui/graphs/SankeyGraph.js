import {mixin} from '../../util/mixin'
import {TLoggable} from '../../util/logging/TLoggable'
import './util/d3-sankey'
import {ContentPage} from '../main/Content'
import ReactFauxDOM from 'react-faux-dom'
import _ from 'lodash';
let d3 = window.d3

class SankeyGraph extends mixin(null, TLoggable) {

  constructor(svg) {
    super()
    this.svg = svg
    this._init(svg)
  }

  _init(svg) {
    let width = d3.select(svg).attr('width')
    let height = d3.select(svg).attr('height')

    this._margin = {top: 1, right: 1, bottom: 6, left: 1}
    this._colorHelper = d3.scale.category20()
    this._numberFormater = d3.format(",.0f")

    var units = ""
    // TODO : load the data from SocioCortex
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

    var margin = {top: 10, right: 10, bottom: 10, left: 10}
    width = 1000 - margin.left - margin.right
    height = 500 - margin.top - margin.bottom

    var formatNumber = d3.format(",.0f"),    // zero decimal places
        format = function (d) {
          return formatNumber(d) + " " + units;
        },
        color = d3.scale.category20();

    // append the svg canvas to the page
    var svg = d3.select(svg)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Set the sankey diagram properties
    var sankey = d3.sankey()
        .nodeWidth(36)
        .nodePadding(40)
        .size([width, height]);

    var path = sankey.link();

    // load the data

    var nodeMap = {};
    graph.nodes.forEach(function (x) {
      nodeMap[x.name] = x;
    });
    graph.links = graph.links.map(function (x) {
      return {
        source: nodeMap[x.source],
        target: nodeMap[x.target],
        value: x.value
      };
    });

    sankey
        .nodes(graph.nodes)
        .links(graph.links)
        .layout(32);

// add in the links
    var link = svg.append("g").selectAll(".link")
        .data(graph.links)
        .enter().append("path")
        .attr("class", "link")
        .attr("d", path)
        .style("stroke-width", function (d) {
          return Math.max(1, d.dy);
        })
        .sort(function (a, b) {
          return b.dy - a.dy;
        });

// add the link titles
    link.append("title")
        .text(function (d) {
          return d.source.name + " -> " +
              d.target.name;
        });

// add in the nodes
    var node = svg.append("g").selectAll(".node")
        .data(graph.nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function (d) {
          return "translate(" + d.x + "," + d.y + ")";
        })
        .call(d3.behavior.drag()
            .origin(function (d) {
              return d;
            })
            .on("dragstart", function () {
              this.parentNode.appendChild(this);
            })
            .on("drag", dragmove));

// add the rectangles for the nodes
    node.append("rect")
        .attr("height", function (d) {
          return d.dy;
        })
        .attr("width", sankey.nodeWidth())
        .style("fill", function (d) {
          return d.color = color(d.name.replace(/ .*/, ""));
        })
        .style("stroke", function (d) {
          return d3.rgb(d.color).darker(2);
        })
        .append("title")
        .text(function (d) {
          return d.name ;
        });

// add in the title for the nodes
    node.append("text")
        .attr("x", -6)
        .attr("y", function (d) {
          return d.dy / 2;
        })
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .attr("transform", null)
        .text(function (d) {
          return d.name;
        })
        .filter(function (d) {
          return d.x < width / 2;
        })
        .attr("x", 6 + sankey.nodeWidth())
        .attr("text-anchor", "start");

// the function for moving the nodes
    function dragmove(d) {
      d3.select(this).attr("transform",
          "translate(" + (
              d.x = Math.max(0, Math.min(width - d.dx, d3.event.x))
          )
          + "," + (
              d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
          ) + ")");
      sankey.relayout();
      link.attr("d", path);
    }
  }
}

export class SankeyGraphPage extends mixin(React.Component, TLoggable) {

  constructor() {
    super()
  }

  get name() {
    return "Sankey View"
  }

  componentDidMount() {

    new SankeyGraph(this._svgElement)
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
    return (
        <svg width="600" height="1600" xmlns="http://www.w3.org/svg/2000" ref={(c) => this._svgElement = c}>
        </svg>
    )


  }

}