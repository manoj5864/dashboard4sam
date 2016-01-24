import {mixin} from '../../../util/mixin'
import {TLoggable} from '../../../util/logging/TLoggable'
import {NodeElement} from './NodeElement'
import {ReactNodeElement} from './ReactNodeElement'
export {NodeElement, ReactNodeElement}

class ConnectionEventReceiver {
    async handle({from, to}){}
}

class InformationEvent {
    get type() {

    }

    constructor() {

    }
}

export class GraphSurfaceManager extends mixin(null, TLoggable) {

    // Behavior
    _dragMove(d) {
        // Check if we are dragging an arrow or a node
        if (this.state.shiftNodeDrag) {
            this._dragLine.attr('d', 'M' + d.x + ',' + d.y + 'L' + d3.mouse(this._graph[0][0])[0] + ',' + d3.mouse(this._graph[0][0])[1])
        } else if (d instanceof NodeElement) {
            d.x += d3.event.dx;
            d.y +=  d3.event.dy;
        }
        this._update()
    }
    //

    _initMarkers() {
        let defs = this._svg.append('svg:defs');
        defs.append('svg:marker')
            .attr('id', 'end-arrow')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', "10")
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
        return graph.append('svg:path')
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
        d3.event.stopPropagation();
        if (d3.event.shiftKey){
            this.state.shiftNodeDrag = d3.event.shiftKey;
            this.state.connectOperation.startNode = d;
            this._dragLine
                .classed('hidden', false)
                .attr('d', 'M' + d.x + ',' + d.y + 'L' + d.x + ',' + d.y);
        }
    }

    async _handleMouseUp(d) {
        let dragActive = this.state.shiftNodeDrag;

        // Deactivate current dragging operation
        this.state.shiftNodeDrag = false;
        this._dragLine.classed('hidden', true);

        if (dragActive) {
            this.state.connectOperation.endNode = d;
            let from = this.state.connectOperation.startNode;
            let to = this.state.connectOperation.endNode;

            // Only add connection if acknowledged
            this.debug(`Waiting for response of ${this.state.events.connectionEvents.length} acknowledgements...`);
            let promiseOfConnectionAck = await Promise.all(this.state.events.connectionEvents.map(it=>it({from:from, to:to})));
            this.debug(`Received acknowledgements, State: ${promiseOfConnectionAck}`);

            if (promiseOfConnectionAck.every(it=>it)) {
                this.state.connectionList.push({
                    from: from,
                    to: to,
                    path: null
                });

                // Clear connect operation
                this.state.connectOperation.startNode = null;
                this.state.connectOperation.endNode = null;
                this._update();
            }
        }
    }

    _update() {
        // Render elements
        this._elements = this._elements.data(this.state.nodeList, (d) => d.id);
        this._elements.attr('transform', (d) => `translate(${d.x}, ${d.y})`);
        // Add the new nodes
        let newElements = this._elements.enter().append('g');
        newElements
            .attr('transform', (d) => `translate(${d.x}, ${d.y})`)
            .on('mouseover', (d) => {d._handleMouseOver()})
            .on('mouseout', (d) => {d._handleMouseOut()})
            .on('mousedown', (d) => {this._handleNodeMouseDown(d); d._handleMouseDown()})
            .on('mouseup', (d) => {this._handleMouseUp(d); d._handleMouseUp()})
            .on('dblclick', (d) => {d._handleDoubleClick()})
            .call(this._dragBehavior); // Apply drag
        newElements.append((d) => {
            return d._render()
        });

        // Update old paths
        this._paths = this._paths.data(this.state.connectionList, (it) => `${it.from.id}-${it.to.id}`);
        this._paths.style('marker-end', 'url(#end-arrow)')
            //.classed();
            .attr('d', (d) => {
                return `M${d.from.x},${d.from.y}L${d.to.x},${d.to.y}`;
            });

        // Render the paths
        this._paths.enter()
            .append('path')
            .style('marker-end', 'url(#end-arrow)')
            .classed('link', true)
            .attr('d', (d) => `M${d.from.x},${d.from.y}L${d.to.x},${d.to.y}`)
            .on('mousedown', (d) => {});

        // Remove old elements
        this._elements.exit().remove();
        this._paths.exit().remove();
    }

    _init(el) {
        this.debug('Initializing surface manager...')
        let width = window.innerWidth || docEl.clientWidth || bodyEl.clientWidth,
            height =  window.innerHeight|| docEl.clientHeight|| bodyEl.clientHeight;

        this._svg = d3.select(el);
        this._initMarkers();

        this._svg
            .on('mousedown', (d) => {})
            .on('mouseup', (d) => {});

        // Add grouping
        this._graph = this._svg.append('g').classed('graphed', true);
        this._configureSurfaceDragAndZoom();

        this._dragLine = this._initDragLine(this._graph);
        this._dragBehavior = this._configureDragBehavior();

        // Build elements
        this._elements = this._graph.append('g').selectAll('g');

        this._paths = this._graph.append('g').selectAll('g');

        this._update();
    }

    addNode(node) {
        if (!(node instanceof NodeElement)) throw new Error('Invalid node specified')
        this.state.nodeList.push(node);
        this._update()
    }

    addNodes(nodes) {
        nodes.forEach((node) => {
            if (!(node instanceof NodeElement)) throw new Error('Invalid node specified')
            this.state.nodeList.push(node)
        });
        this._update()
    }

    registerConnectionEvent(cb) {
        // Guarantee result
        let customCb = async(...args) => {
            let res = await cb.apply(null, args);
            return (typeof res == 'boolean') ? res : true;
        };
        this.state.events.connectionEvents.push(customCb);
    }

    constructor(element, existingNodes = null, connectionList = null) {
        super();
        this.state = {
            nodeList: (existingNodes || []),
            connectionList: [],

            shiftNodeDrag: false,


            connectOperation: {
                startNode: null,
                endNode: null
            },

            // Event Handlers
            events: {
                connectionEvents: []
            }
        };
        this._init(element)
    }

}