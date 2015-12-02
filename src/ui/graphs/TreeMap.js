import {mixin} from '../../util/mixin'
import {TLoggable} from '../../util/logging/TLoggable'

let d3 = window.d3

let buildRect = function (rect) {
    rect.attr("x", function(d) { return x(d.x); })
        .attr("y", function(d) { return y(d.y); })
        .attr("width", function(d) { return x(d.x + d.dx) - x(d.x); })
        .attr("height", function(d) { return y(d.y + d.dy) - y(d.y); });
}

let buildText = function(text) {
    text.attr("x", function(d) { return x(d.x) + 6; })
        .attr("y", function(d) { return y(d.y) + 6; });

}

export class TreeNode extends mixin(null, TLoggable) {

    get name() {
        return this._name
    }

    get children() {
        return this._children
    }
    get value() {
        return this._value || this.aggregateValue()
    }

    addChild(node) {
        if (!(node instanceof TreeNode)) { throw new Error('No Treenode specified') }
        this._children.push(node)
    }

    aggregateValue() {
        let aggregatedChildValue = this.children.reduce(function(p, v) { return p + accumulate(v); }, 0)
        return aggregatedChildValue
    }

    constructor(name) {
        super()
        this._name = name
        this._children = []
    }
}

export class TreeMap extends mixin(null, TLoggable) {

    _init() {
        this._margin = {top: 0, right: 0, bottom: 0, left: 0}
        let svg = d3.select(this._svgElement)
        svg
            .append('g')
            .attr(`transform(${this._margin.left},${this._margin.top})`)
            .style('shape-rendering', 'crispEdges')

        let width = this._width
        let height = this._height



        this._xScale = d3.scale.linear()
            .domain([0, width])
            .range([0, width]);

        this._yScale = d3.scale.linear()
            .domain([0, height])
            .range([0, height]);

        this._treemap =  d3.layout.treemap()
            .children(function(d, depth) { return depth ? null : d._children; })
            .sort(function(a, b) { return a.value - b.value; })
            .ratio(height / width * 0.5 * (1 + Math.sqrt(5)))
            .round(false);
    }

    _layoutNodes(el) {
        this._treemap.nodes({_children: el.children})
        el.children.forEach((c) => {
            c.x = el.x + c.x * el.dx;
            c.y = el.y + c.y * el.dy;
            c.dx *= el.dx;
            c.dy *= el.dy;
            c.parent = el;
            layout(c);
        });
    }

    _transition(el, oldGroup) {
        if (this._transitioning || !el) return
        this._transitioning = true
        let newGroup = this._display(el),
            t1 = oldGroup.transition().duration(750),
            t2 = newGroup.transition().duration(750)

        // Update the domain
        this._x.domain([el.x, el.x + el.dx])
        this._y.domain([el.y, el.y + el.dy])

        // Enable anti-alias
        let svg = d3.select(this._svgElement)
        svg.style('shape-rendering', null)

        svg.selectAll('.depth').sort(function(a, b) { return a.depth - b.depth; })

        // Make new text invisible
        newGroup.selectAll("text").style("fill-opacity", 0)
        // Start transition
        t1.selectAll("text").call(text).style("fill-opacity", 0)
        t2.selectAll("text").call(text).style("fill-opacity", 1)
        t1.selectAll("rect").call(rect)
        t2.selectAll("rect").call(rect)

        // Remove the old node
        t1.remove().each('end', () => {
            svg.style("shape-rendering", "crispEdges");
            this._transitioning = false;
        })
    }

    _display(el) {
    }

    constructor(svgElement, width, height) {
        super()
        this._svgElement = svgElement
        this._width = width
        this._height = height
    }
}