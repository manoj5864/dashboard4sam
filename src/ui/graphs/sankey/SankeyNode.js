import {default as uuid} from 'node-uuid'

export class SankeyNode {

    static _handleDragMove(d) {

    }

    _handleClick() {

    }

    _handleDoubleClick() {

    }

    _init() {

    }

    addConnectedNode(node, value = 50) {
        if (!(node) instanceof SankeyNode) { throw new Error('Node type must be of SankeyNode')}
        this._targets.push({
            node: node,
            value: value
        })
    }

    get color() {
        return 'green'
    }

    get connectedNodes() {
        return this._targets
    }

    get name() {
        return this._title
    }

    constructor(title = 'Unknown') {
        this._id = uuid.v1()
        this._title = title
        this._targets = []
    }

}