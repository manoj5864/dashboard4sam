import {mixin} from '../../../util/mixin'
import {TLoggable} from '../../../util/logging/TLoggable'
import {default as uuid} from 'node-uuid'

export class NodeElement extends mixin(null, TLoggable) {
    get id() {
        return this._id
    }

    get x() {
        return this._x
    }

    get y() {
        return this._y
    }

    set x(val) {
        this._x = val
    }

    set y(val) {
        this._y = val
    }

    _setSelected(val) {
        this._state.isSelected = val;
    }

    _handleMouseDown(d3node, d) {
        d3.event.stopPropagation()
        if (d3.event.shiftKey){
            // Connecting bevior starts
            // Inform -> Parent
            //dragLine.classed('hidden', false)
            //    .attr('d', 'M' + d.x + ',' + d.y + 'L' + d.x + ',' + d.y);
        }
    }

    _handleMouseOut() {

    }

    _handleMouseUp() {

    }

    _handleMouseOver() {

    }

    _handleDoubleClick() {

    }

    _render() {
        if (this._customRenderer) {
            return this._customRenderer()
        }
        return $(document.createElementNS("http://www.w3.org/2000/svg", "circle")).attr('r', '12')[0]
    }


    _sm_informConnectedNode({node = null, connected = false, outgoing = false, incoming = false}) {
        if (!node) throw new Error('No node was connected');

        // Determine the set
        let relevantSet = null;
        if (outgoing) {
            relevantSet = this._state.outgoingNodes;
        } else if (incoming) {
            relevantSet = this._state.incomingNodes;
        }
        if (!relevantSet) throw new Error(`Invalid use of node connection`);

        let hasEntry = relevantSet.has(node);

        if (connected) {
            if (hasEntry) throw new Error(`Node already connected`);
            relevantSet.add(node);
        } else {
            if (!hasEntry) throw new Error(`Node not present`);
            relevantSet.remove(node);
        }
        this._update({nodeConnected: true});
    }

    _update({nodeConnected = false}) {

    }

    constructor(title, id = uuid.v1(), parent = null) {
        super()
        this._id = id
        this._parent = parent
        this._x = 0
        this._y = 0
        this._title = title

        this._state = {
            isSelected: false,
            outgoingNodes: new Set(),
            incomingNodes: new Set()
        }
    }
}
