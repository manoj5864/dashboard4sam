/**
 *
 *  Graph Manager
 *  inspired by https://github.com/chrisdickinson/digraph-tag
 *
 */
function removeSourceOrSink(vertices, incoming, into, getAttr) {
    for (var vertex of vertices) {
        var edges = incoming.get(vertex)
        if (!edges) {
            vertices.delete(vertex)
            into.add(vertex)
            continue
        }
        var ok = false
        for (var edge of edges) {
            if (vertices.has(getAttr(edge))) {
                ok = true
                break
            }
        }
        if (!ok) {
            vertices.delete(vertex)
            into.add(vertex)
            continue
        }
    }
}

function defaultGetFrom(edge) {
    return edge[0]
}


function defaultGetTo(edge) {
    return edge[1]
}



export class GraphHelper {

    get incoming() {
        return this._incoming;
    }

    get outgoing() {
        return this._outgoing;
    }

    get vertices() {
        return this._vertexlist;
    }

    reverse() {
        if (this._state.reverseLastOperation) {
            this._state.reverseLastOperation();
            this._state.reverseLastOperation = null;
        }
    }

    path() {
        let res = [];
        for (let v of [...this._vertexlist]) {
            let outgoingEdges = this._outgoing.get(v);
            if (outgoingEdges)
            for (let e of [...outgoingEdges]) {
                res.push({
                    from: e[0],
                    to: e[1]
                })
            }
        }
        return res;
    }

    add(from, to){
        const hasFrom = this._vertexlist.has(from);
        const hasTo = this._vertexlist.has(to);
        this._vertexlist.add(from);
        this._vertexlist.add(to);
        let outgoingEdges = this._outgoing.get(from);
        if (!outgoingEdges) {
            this._outgoing.set(from, outgoingEdges = new Set());
        }
        let incomingEdges = this._incoming.get(to);
        if (!incomingEdges) {
            this._incoming.set(to, incomingEdges = new Set());
        }
        let edge = [from, to];
        incomingEdges.add(edge);
        outgoingEdges.add(edge);

        this._state.reverseLastOperation = () => {
            if (!hasFrom) this._vertexlist.delete(from);
            if (!hasTo) this._vertexlist.delete(to);
            incomingEdges.delete(edge);
            outgoingEdges.delete(edge);
        }

        if (this._state.preventCyclicalGraph) {
            let vertexMap = new Map();

            this._vertexlist.forEach(it=>vertexMap.set(it, new Vertex(it.id)));
            let graph = {
                vertices: []
            }
            vertexMap.forEach((value)=>graph.vertices.push(value));
            this._outgoing.forEach((value, key) => {
                let graphElement = vertexMap.get(key);
                value.forEach(it => {
                    graphElement.connections.push(vertexMap.get(it[1]));
                })
            })

            // Check for cycles
            let tarjan = new Tarjan(graph);
            let cons = tarjan.run();

            let hasCycles = cons.some(it=>it.length > 1)
            if (hasCycles) {
                this.reverse();
                return false;
            }
        }

        return true;
    }

    has(node) {
        return this._vertexlist.has(node);
    }

    remove(node) {
        if (this._vertexlist.has(node)) {
            this._vertexlist.delete(node);
            this._incoming.forEach((value, key, map) => {
                if (key == node) { map.delete(key); return; }
                value.forEach(it=>{
                    if (it[0] == node || it[1] == node) value.delete(it);
                })
            })
            this._outgoing.forEach((value, key, map) => {
                if (key == node) { map.delete(key); return; }
                value.forEach(it=>{
                    if (it[0] == node || it[1] == node) value.delete(it);
                })
            })
        }
    }

    constructor({preventCyclicalGraph = false} = {}) {
        this._incoming = new Map();
        this._outgoing = new Map();
        this._vertexlist = new Set();
        this._state = {
            preventCyclicalGraph: preventCyclicalGraph
        };
    }

    toDAG() {
        let incoming = this._incoming;
        let outgoing = this._outgoing;
        let vertices = this._vertexlist;

        const getFrom = defaultGetFrom
        const getTo = defaultGetTo

        vertices     = new Set(vertices)
        const toFlip = new Set()
        const lhs    = new Set()
        const rhs    = new Set()

        while (vertices.size) {
            removeSourceOrSink(vertices, outgoing, rhs, getTo)
            removeSourceOrSink(vertices, incoming, lhs, getFrom)
            if (vertices.size) {
                var max = -Infinity
                var maxVertex = null
                for (let vertex of vertices) {
                    var diff = outgoing.get(vertex).size - incoming.get(vertex).size
                    if (diff > max) {
                        max = diff
                        maxVertex = vertex
                    }
                }
                vertices.delete(maxVertex)
                lhs.add(maxVertex)
            }
        }
        for (let vertex of lhs) {
            for (let edge of outgoing.get(vertex)) {
                if (rhs.has(getTo(edge))) {
                    toFlip.add(edge)
                }
            }
        }

        return toFlip
    }

}

class Vertex {

    equals(it) {
        return this == it;
    }

    constructor(id) {
        this.id = id;
        this.index = -1;
        this.lowLink = -1;
        this.connections = [];
    }

}


class VertexStack {
    constructor(vertices) {
        this.vertices = vertices || [];
    }

    contains(vertex) {
        for (var i in this.vertices){
            if (this.vertices[i].equals(vertex)){
                return true;
            }
        }
        return false;
    }
}

class Tarjan {

    run() {
        for (var i in this.graph.vertices){
            if (this.graph.vertices[i].index<0){
                this.strongconnect(this.graph.vertices[i]);
            }
        }
        return this.scc;
    }

    strongconnect(vertex) {
        // Set the depth index for v to the smallest unused index
        vertex.index = this.index;
        vertex.lowlink = this.index;
        this.index = this.index + 1;
        this.stack.vertices.push(vertex);

        // Consider successors of v
        // aka... consider each vertex in vertex.connections
        for (var i in vertex.connections){
            var v = vertex;
            var w = vertex.connections[i];
            if (w.index<0){
                // Successor w has not yet been visited; recurse on it
                this.strongconnect(w);
                v.lowlink = Math.min(v.lowlink,w.lowlink);
            } else if (this.stack.contains(w)){
                // Successor w is in stack S and hence in the current SCC
                v.lowlink = Math.min(v.lowlink,w.index);
            }
        }

        // If v is a root node, pop the stack and generate an SCC
        if (vertex.lowlink==vertex.index){
            // start a new strongly connected component
            var vertices = [];
            var w = null;
            if (this.stack.vertices.length>0){
                do {
                    w = this.stack.vertices.pop();
                    // add w to current strongly connected component
                    vertices.push(w);
                } while (!vertex.equals(w));
            }
            // output the current strongly connected component
            // ... i'm going to push the results to a member scc array variable
            if (vertices.length>0){
                this.scc.push(vertices);
            }
        }
    }

    constructor(graph) {
        this.index = 0;
        this.stack = new VertexStack();
        this.graph = graph;
        this.scc = [];
    }

}
