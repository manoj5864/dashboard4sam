import {mixin} from '../../../util/mixin'
import {TLoggable} from '../../../util/logging/TLoggable'
import {NodeElement} from './NodeElement'
import {ReactNodeElement} from './ReactNodeElement'
export {NodeElement, ReactNodeElement}

export class GraphSurfaceManager extends mixin(null, TLoggable) {

    // Behavior
    _dragMove(d) {
        // Check if we are dragging an arrow or a node
        if (d instanceof NodeElement) {
            d.x += d3.event.dx
            d.y +=  d3.event.dy
        }
        this._update()
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
            .on("drag", (args) => {
                this._justDragged = true;
                this._dragMove(args)
            })
            .on("dragend", function() {
                // todo check if edge-mode is selected
            });
    }

    _configureSurfaceDragAndZoom() {
        let zoom = d3.behavior.zoom()
            .on("zoom", () => {
                if (d3.event.sourceEvent.shiftKey){
                    // TODO  the internal d3 state is still changing
                    return false;
                } else{
                    this._handleSurfaceZoom()
                }
                return true;
            })
            .on("zoomstart", () => {
                if (!d3.event.sourceEvent.shiftKey) d3.select('body').style("cursor", "move");
            })
            .on("zoomend", () => {
                d3.select('body').style("cursor", "auto");
            });
        this._svg.call(zoom).on("dblclick.zoom", null);
    }

    _handleSurfaceZoom() {
        this._graph.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")")
    }

    _handleNodeMouseDown(d) {
        // Show arrow for connection
        d3.event.stopPropagation()
        if (d3.event.shiftKey){
            this._dragLine
                .classed('hidden', false)
                .attr('d', 'M' + d.x + ',' + d.y + 'L' + d.x + ',' + d.y);
        }
    }

    _update() {
        this.debug('Updating surface elements...')

        // Render elements
        this._elements = this._elements.data(this.state.nodeList, (d) => d.id)
        this._elements.attr('transform', (d) => `translate(${d.x}, ${d.y})`)
        // Add the new nodes
        let newElements = this._elements.enter().append('g')
        newElements
            .attr('transform', (d) => `translate(${d.x}, ${d.y})`)
            .on('mouseover', (d) => {d._handleMouseOver()})
            .on('mouseout', (d) => {d._handleMouseOut()})
            .on('mousedown', (d) => {this._handleNodeMouseDown(); d._handleMouseDown()})
            .on('mouseup', (d) => {d._handleMouseUp()})
            .on('dblclick', (d) => {d._handleDoubleClick()})
            .call(this._dragBehavior) // Apply drag
        newElements.append((d) => {
            return d._render()
        })

        // Remove old elements
        this._elements.exit().remove()
    }

    _init(el) {
        this.debug('Initializing surface manager...')
        let width = window.innerWidth || docEl.clientWidth || bodyEl.clientWidth,
            height =  window.innerHeight|| docEl.clientHeight|| bodyEl.clientHeight

        this._svg = d3.select(el)
        this._initMarkers()

        this._svg
            .on('mousedown', (d) => {})
            .on('mouseup', (d) => {})

        // Add grouping
        this._graph = this._svg.append('g').classed('graphed', true)
        this._configureSurfaceDragAndZoom()

        this._dragLine = this._initDragLine(this._graph)
        this._dragBehavior = this._configureDragBehavior()

        // Build elements
        this._elements = this._graph.append('g').selectAll('g')

        this._update()
    }

    addNode(node) {
        if (!(node instanceof NodeElement)) throw new Error('Invalid node specified')
        this.state.nodeList.push(node)
        this._update()
    }

    addNodes(nodes) {
        nodes.forEach((node) => {
            if (!(node instanceof NodeElement)) throw new Error('Invalid node specified')
            this.state.nodeList.push(node)
        })
        this._update()
    }

    constructor(element, existingNodes = null) {
        super()
        this.state = {nodeList: (existingNodes || [])}
        this._init(element)
    }

}