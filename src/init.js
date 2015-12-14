/*
const margin = {top: -5, right: -5, bottom: -5, left: -5},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// D3 Zoom
let zoom = d3.behavior.zoom()
    .scaleExtent([1, 10])
    .on("zoom", zoomed);

let drag = d3.behavior.drag()
    .origin(function(d) { return d; })
    .on("dragstart", dragstarted)
    .on("drag", dragged)
    .on("dragend", dragended);

let svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.right + ")")
    .call(zoom);

let container = svg.append("g");

container.append("g")
    .attr("class", "x axis")
    .selectAll("line")
    .data(d3.range(0, width, 10))
    .enter().append("line")
    .attr("x1", function(d) { return d; })
    .attr("y1", 0)
    .attr("x2", function(d) { return d; })
    .attr("y2", height);

container.append("g")
    .attr("class", "y axis")
    .selectAll("line")
    .data(d3.range(0, height, 10))
    .enter().append("line")
    .attr("x1", 0)
    .attr("y1", function(d) { return d; })
    .attr("x2", width)
    .attr("y2", function(d) { return d; });

let barOuterPad = .2
let barPad = .1
let xBand = d3.scale.ordinal()
    .domain(data.map((d) => d.letter))
    .rangeRoundBands([0, width], barPad, barOuterPad)


function zoomed() {
    container.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
}

function dragstarted(d) {
    d3.event.sourceEvent.stopPropagation();
    d3.select(this).classed("dragging", true);
}

function dragged(d) {
    d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
}

function dragended(d) {
    d3.select(this).classed("dragging", false);
}


d3.json('../src/test/data.json', (err, res) =>  {
    console.log(res)
});
*/
import {app} from './Application'
import {QueryBuilder} from './ui/query_builder/QueryBuilder'
import {SankeyGraphPage} from './ui/graphs/SankeyGraph'
import {BarChartPage} from './ui/graphs/BarChart'
app.start()


//let queryBuilder = new QueryBuilder()
//let sankeyGraphPage = new SankeyGraphPage()
//debugger;
//app.pageManager.switchPage(<SankeyGraphPage/>)
app.pageManager.switchPage(<BarChartPage/>)