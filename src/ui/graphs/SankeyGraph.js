import {mixin} from '../../util/mixin'
import {TLoggable} from '../../util/logging/TLoggable'
import './util/d3-sankey'

let d3 = window.d3

class SankeyNode {
    get name() {
        return name
    }

    get nodes() {
        return this._connected_nodes
    }

    addNode(node) {
        if (!(node instanceof SankeyNode)) { throw new Error('Node must be of type SankeyNode') }
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
        );
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
            nodes.forEach(x => { nodeList.push(x); if (x.nodes.length > 0) treatNode(x); })
        }
        nodes.forEach(x => {counter = 0; nodeList.push(x); treatNode(x); })
    }

    constructor() {
        super()
        this._init()
    }

}