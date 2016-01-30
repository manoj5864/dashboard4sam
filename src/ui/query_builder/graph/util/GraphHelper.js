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
            let dag = [...this.toDAG()];
            if ((dag.length == 1) && (dag[0][0] == from) && (dag[0][1] == to)) {
               return true;
            } else {
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



