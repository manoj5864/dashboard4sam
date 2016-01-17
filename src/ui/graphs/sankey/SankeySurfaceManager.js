import {mixin} from '../../../util/mixin'
import {TLoggable} from '../../../util/logging/TLoggable'
import {SankeyNode} from './SankeyNode'
import {legend} from '../util/d3-legend.js'


export class SankeySurfaceManager extends mixin(null, TLoggable) {

  constructor(svg, {allowZooming = true, allowPanning = false, alignHorizontal = false, nodeList = []}) {
    super()
    this._svg = d3.select(svg)
    this._options = {
      allowZooming: allowZooming,
      allowPanning: allowPanning,
      alignHorizontal: alignHorizontal
    }

    nodeList.forEach((it) => {
      if (!(it instanceof SankeyNode)) {
        throw new Error('Instance not of type SankeyNode')
      }
    })
    this._nodeList = nodeList

    // Initialize diagram
    this._init(svg)
  }

  addNode(node) {
    if (!(node instanceof SankeyNode)) {
      throw new Error('Instance not of type SankeyNode')
    }
    this._nodeList.push(node)
    this._update()
  }

  _dragNode(d) {
    let width = d3.select(this._svg).attr('width')
    let height = d3.select(this._svg).attr('height')
    d3.select(this).attr("transform",
        "translate(" + (
            d.x = Math.max(0, Math.min(width - d.dx, d3.event.x))
        )
        + "," + (
            d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
        ) + ")");
    this._sankey.relayout()
  }

  _update(svg) {
    // Compute data
    let nodeList = []
    let width = this._svg.attr('width')
    this._nodeList.forEach((it) => {
      nodeList.push(it)
    })
    let connectionList = []
    this._nodeList.forEach((it) => {
      it.connectedNodes.map((connectedNode) => {
        return {
          source: it,
          target: connectedNode.node,
          value: connectedNode.value || 50
        }

      }).forEach((entry) => {
        connectionList.push(entry)
      })
    })

    this._sankey
        .nodes(nodeList)
        .links(connectionList)
        .layout(32);

    // Build the links
    let links = this._svg.select(".group").append("g").selectAll(".link")
        .data(connectionList)
        .enter().append("path")
        .attr("class", "link")
        .attr("d", this._path)
        .style("stroke-width", (d) => {
          return Math.max(1, d.dy);
        })
        .sort(function (a, b) {
          return b.dy - a.dy;
        });

    links.on("mouseover", function() {
      d3.select(this)
          .style("stroke-opacity", .5)
    }).on("mouseout", function() {
      d3.select(this)
          .style("stroke-opacity", .2)
    })
    ;
    // Apply link short descriptions
    links.append("title")
        .text(function (d) {
          return d.source.name + " -> " +
              d.target.name;
        })


    // Build the nodes
    //let nodeDragging = d3.behavior.drag()
    //    .origin(function (d) {
    //        return d;
    //    })
    //    .on("dragstart", function () {
    //        this.parentNode.appendChild(this);
    //    })
    //    .on("drag", (d) => {
    //        this._dragNode(d)
    //        links.attr("d", path);
    //    })

    let nodes = this._nodeGroup.selectAll(".node")
        .data(nodeList)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function (d) {
          return "translate(" + d.x + "," + d.y + ")";
        })
    //.call(nodeDragging);
    // Apply node styling
    nodes.append("rect")
        .attr("class", function (d) {
          return d.instanceName
        })
        .attr("height", function (d) {
          return d.dy;
        })
        .attr("width", this._sankey.nodeWidth())
        .style("fill", function (d) {
          return d.color;
        })
        .style("stroke", function (d) {
          return d3.rgb(d.color).darker(2);
        })


    // Apply the node text
    nodes.append("text")
        .attr("transform", function (d) {
          return "translate(" + d.dx / 2 + "," + d.dy / 2 + ")rotate(-90)"
        })
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .text(function (d) {
          return d.name;
        })
        .attr("text-anchor", "start")
        .style("fill", "white")
        .attr("data-legend", function (d) {
          return d.instanceName
        })
        .attr("data-legend-color", function (d) {
          return d.color
        })

    // Legend
    d3.select(svg).select(".legend")
        //.attr("transform", "translate(" + (this._svg.attr('height') - 100) +
        //    "," + (this._svg.attr('width') / 2) + ")")
        .attr("transform", "translate(" + 50 +
            "," + 50 + ")")
        .style("font-size", "12px")
        .call(legend)

    var div = d3.select(".card-box").append("group")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("background", "orange")
        .style("color", "white")
    nodes.on("mouseover", (d) => {
      nodesMouseOver(d)
    }).on("mouseout", () => {
      nodesMouseOut()
    })

    function nodesMouseOut() {
      d3.selectAll("path")[0].forEach(function (x) {
        d3.select(x)
            .style("stroke-opacity", .2)
      })
    }

    function nodesMouseOver(d) {
      div.transition()
          .duration(200)
          .style("opacity", .7);
      div.html("<center><b>" + d.name + "</b></center>" + "For details: <a href=\"" + d.url + "\"" +
              " target=\"_blank\">Click here!</a>")
          .style("left", (d3.event.pageX - 250) + "px")
          .style("top", (d3.event.pageY - 100) + "px");

      d3.selectAll("path")[0].forEach(function (x) {
        var connectedNodes = x.getElementsByTagName("title")[0].textContent.split(" -> ")

        connectedNodes.forEach(function (nodeEntry) {
          if (nodeEntry === d._title) {
            d3.select(x)
                .style("stroke-opacity", .5)
          }
        })

      })
      //}).on("mouseout", function() {
      //    div.transition()
      //        .duration(1000)
      //        .style("opacity", 0);

    }

    d3.selectAll(".tooltip").on("mousemove", function () {
      div.style("opacity", 1)
          .style("background", "orange")
          .style("color", "white");
    }).on("mouseout", function () {
      div.style("opacity", 0)
    })


  }

  _init(svg) {
    // Configure the layout
    let margin = {top: 1, right: 1, bottom: 6, left: 1}
    let width = d3.select(svg).attr('width')
    let height = d3.select(svg).attr('height')
    width = width - margin.left - margin.right
    height = height - margin.top - margin.bottom
    // Apply legend
    d3.select(svg).append('g')
        .classed('legend', true)

    // Apply layout to canvas
    d3.select(svg)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .classed('group', true)
    //.attr("transform",
    //    "translate(" + margin.left + "," + margin.top + ")")

    // Apply Sankey
    this._sankey = d3.sankey()
        .nodeWidth(36)
        .nodePadding(40)
        .size([width, height]);
    this._path = this._sankey.link()

    // Intialize node group
    this._nodeGroup = d3.select(svg).select(".group").append("g")
    if (!this._options.alignHorizontal) {
      d3.select(svg).select(".group").attr("transform",
          //"translate(" + width / 2 + "," + margin.top + ")rotate(90)")
          "translate(" + width + "," + margin.top + ")scale(.6)rotate(90)")
    } else {
      d3.select(svg).select(".group").attr("transform",
          "translate(" + margin.left + "," + margin.top + ")")
    }

    if (this._options.allowZooming) {
      let zoom = d3.behavior.zoom()
          .translate([width , margin.top]).scale(.6)
          .on("zoom", () => {
            //if (d3.event.sourceEvent.shiftKey){
            //    // TODO  the internal d3 state is still changing
            //    return false;
            //} else{
            //    //this._handleSurfaceZoom()

            if (!this._options.alignHorizontal) {
                d3.select(".group").attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")rotate(90)")
            } else {
              d3.select(".group").attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")")
            }
            //}
            //return true;
          })
          .on("zoomstart", () => {
            if (!d3.event.sourceEvent.shiftKey) d3.select('body').style("cursor", "move");
          })
          .on("zoomend", () => {
            d3.select('body').style("cursor", "auto");
          });
      this._svg.call(zoom).on("dblclick.zoom", null);
    }

    if (this._options.allowPanning) {

    }


    //setTimeout(function () {
    //  legend
    //      .style("font-size", "20px")
    //      .attr("data-style-padding", 10)
    //      .call(d3.legend)
    //}, 1000)

    this._update(svg)
  }
}