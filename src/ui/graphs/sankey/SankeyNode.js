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
        return this._color
    }

    get connectedNodes() {
        return this._targets
    }

    get name() {
        return this._title
    }

    get url() {
        return this._url
    }

    get instanceName() {
        return this._instanceName
    }

    constructor(instanceName, title = 'Unknown', url = 'Not provided', color = 'green') {
        this._id = uuid.v1()
        this._title = title
        this._targets = []
        this._url = url
        this._color = color
        this._instanceName = instanceName
    }

}