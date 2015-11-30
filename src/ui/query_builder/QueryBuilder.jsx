import {mixin} from '../../util/mixin'
import {TLoggable} from '../../util/logging/TLoggable'
import {ContentPage} from '../main/Content'
import {app} from  '../../Application'
import 'babel-polyfill'

let React = window.React
let d3 = window.d3
let $ = window.$

//http://bl.ocks.org/cjrd/6863459

class NodeElement extends mixin(null, TLoggable) {
    get id() {
        return this._id
    }

    get name() {
        return this._name
    }

    get x() {

    }

    get y() {

    }

    _emit() {

    }

    _handleMousedown(d3node, d) {
        d3.event.stopPropagation()
        if (d3.event.shiftKey){
            // Connecting bevior starts
            // Inform -> Parent
            //dragLine.classed('hidden', false)
            //    .attr('d', 'M' + d.x + ',' + d.y + 'L' + d.x + ',' + d.y);
        }
    }

    _handleMouseUp() {

    }

    _init() {

    }

    constructor(parent, title, id = null) {
        super()
        this._parent = parent
    }
}

class GraphSurfaceManager extends mixin(null, TLoggable) {

    // Behavior
    _dragMove() {

    }
    //

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

    _initDragLine(graph) {
        graph.append('svg:path')
            .attr('class', 'link dragline hidden')
            .attr('d', 'M0,0L0,0')
            .style('marker-end', 'url(#mark-end-arrow)');
    }

    _configureDragBehavior(graph) {
        return d3.behavior.drag()
            .origin(function(d){
                return {x: d.x, y: d.y};
            })
            .on("drag", function(args){
                this._justDragged = true;
                this.dragmove.call(this, args);
            })
            .on("dragend", function() {
                // todo check if edge-mode is selected
            });
    }

    _init(el) {
        let width = window.innerWidth || docEl.clientWidth || bodyEl.clientWidth,
            height =  window.innerHeight|| docEl.clientHeight|| bodyEl.clientHeight

        this._svg = d3.select(el)
        _initMarkers()

        // Add grouping
        this._graph = this._svg.append('g').classed('graphed', true)
        this._drag_line = _initDragLine(this._graph)
        //this._drag = _configureDragBehavior()
    }

    constructor(element, existingNodes = null) {
        super()
        this._init(element)

        if (existingNodes) {

        }

        // Selected Node
        this._selectedNode = null
    }

}

export class QueryBuilder extends ContentPage {

    constructor() {
        super()
    }

    get name() {
        return "Query Builder"
    }

    async componentDidMount() {
        let surfaceManager = new GraphSurfaceManager(this._svgElement)
        /*
        let entities = await app.socioCortexManager.executeQuery(`
            query EntityTypes {
                type {
                    name
                }
            }
        `)
        */


    }

    render() {
        return (
            <svg width="100%" height="100%" ref={(c) => this._svgElement = c}>
            </svg>
        )
    }

}