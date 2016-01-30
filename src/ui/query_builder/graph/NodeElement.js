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
        d3.event.stopPropagation();
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

    _sm_getIncomingNodes() {
        return this._parent._incomingConnectionsOf({node: this});
    }

    _sm_getOutgoingNodes() {
        return this._parent._outgoingConnectionsOf({node: this});
    }

    _sm_setParent(surfaceManager) {
        this._parent = surfaceManager;
    }

    _sm_triggerEvent(name, context) {
        switch (name) {
            case 'connection':
                this._update({nodeConnected: true}, context);
                break;
            case 'disconnection':
                break
        }
    }

    _update({nodeConnected = false}, context) {

    }

    /*
        Serialization methods
     */

    /**
     * Serializes the current object in a representable JSON from, so fromJSON is able to load the item
     * @private
     */
    _sm_serialize() {
        throw new Error('Must be implemented by extending class')
    }

    static fromJSON(json) {
        throw new Error('Must be implemented by extending class')
    }

    constructor(title, id = uuid.v1(), parent = null) {
        super();
        this._id = id;
        this._parent = parent;
        this._x = 0;
        this._y = 0;
        this._title = title;

        this._state = {
            isSelected: false,
            outgoingNodes: new Set(),
            incomingNodes: new Set()
        }
    }
}
