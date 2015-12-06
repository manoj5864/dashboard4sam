import {default as uuid} from 'node-uuid'

class TreeNode {

    get id() {
        return this._id
    }

    get name() {

    }

    _handleMouseClick() {
        // Handles mouse click
    }

    get children() {
        if (this._collapsed) return null; else return this._children
    }

    set collapsed(value) {
        this._collapsed = value
    }

    get x() {
        return this._x
    }

    get y() {
        return this._y
    }

    set x(value) {
        this._x = value
    }

    set y(value) {
        this._y = value
    }

    _render() {

    }

    constructor(id = uuid.v1(), parent = null) {
        if (!(parent instanceof TreeNode)) throw new Error('Children must be of type TreeNode')
        this._children = []
        this._x = 0
        this._y = 0
    }
}

class TreeChartSurfaceManager {

    _handleNodeClick() {

    }

    _init(svgElement) {
        this._svg = d3.select(svgElement)
        this._treeLayout = d3.layout.tree().size([height, width])
    }

    _update() {
        // Build data structure
        let nodes = this._treeLayout.node().reverse()
        let links = this._treeLayout.links(nodes)

        nodes.forEach((d) => { d.y = d.depth * 180; })

        let nodeData = this._svg
            .selectAll('g.node')
            .data(nodes, (d) => { return d.id })

        let nodeElements = node
            .enter()
            .append('g')
            .attr('class', 'node')
            .attr('transform', (d) => { return `translate(${d.y}, ${d.x})` })
            .on('click', (d) => { this._handleNodeClick(); d._handleMouseClick() })

        // Animation stuff
        let nodeTransition = node.transition().duration()
    }

    constructor(svgElement, rootNode) {
        this._init(svgElement)

    }

}