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

    constructor(title, id = uuid.v1(), parent = null) {
        super()
        this._id = id
        this._parent = parent
        this._x = 0
        this._y = 0
        this._title = title
    }
}
