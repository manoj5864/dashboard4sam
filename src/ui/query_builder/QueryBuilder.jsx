import {mixin} from '../../util/mixin'
import {TLoggable} from '../../util/logging/TLoggable'

let React = window.React
let d3 = window.d3

//http://bl.ocks.org/cjrd/6863459

class GraphSurfaceManager {

    _initMarkers() {
        let defs = this._svg.append('svg:defs');
        defs.append('svg:marker')
            .attr('id', 'end-arrow')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', "32")
            .attr('markerWidth', 3.5)
            .attr('markerHeight', 3.5)
            .attr('orient', 'auto')
            .append('svg:path')
            .attr('d', 'M0,-5L10,0L0,5');
        defs.append('svg:marker')
            .attr('id', 'mark-end-arrow')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 7)
            .attr('markerWidth', 3.5)
            .attr('markerHeight', 3.5)
            .attr('orient', 'auto')
            .append('svg:path')
            .attr('d', 'M0,-5L10,0L0,5');
    }

    _initDragLine() {
        svgG.append('svg:path')
            .attr('class', 'link dragline hidden')
            .attr('d', 'M0,0L0,0')
            .style('marker-end', 'url(#mark-end-arrow)');
    }

    _init() {
        let width = window.innerWidth || docEl.clientWidth || bodyEl.clientWidth,
            height =  window.innerHeight|| docEl.clientHeight|| bodyEl.clientHeight

        this._svg =
            d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height);

        _initMarkers()
        _initDragLine()
    }

}

export class QueryBuilder extends mixin(React.Component, TLoggable) {

    constructor() {
        super()
    }



}