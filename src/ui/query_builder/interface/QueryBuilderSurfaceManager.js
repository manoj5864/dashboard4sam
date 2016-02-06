import {GraphSurfaceManager} from '../graph/GraphSurfaceManager'
import {QueryUtils} from '../../../model/QueryUtils'
import {SankeyNode} from '../../graphs/sankey/SankeyNode'

class CustomSankeyNode extends SankeyNode {

    get elements() {
        return [].concat(this._state.elements); // Copy of internal array
    }

    set elements(val) {
        if (val instanceof Array) {
            this._state.elements = val;
        }
    }

    async elementsRelatedTo(customSankeyNode) {
        let sourceTypeId = await this.queryBuilderNode.information().id();
        let sourceElements = this.elements;
        let targetTypeId = await customSankeyNode.queryBuilderNode.information().id();
        let targetElements = customSankeyNode.elements;

        let res = await QueryUtils.getElementsInRelationship(sourceTypeId, sourceElements, targetTypeId, targetElements);
        debugger;
    }

    get queryBuilderNode() {
        return this._state.queryBuilderNode;
    }

    constructor(groupName, title, url, color, queryBuilderNode) {
        super({
            groupName: groupName,
            title: title,
            url: url,
            color: color
        });
        this._state = {
            // Elements inside this SankeyNode
            elements: null,
            queryBuilderNode: queryBuilderNode
        }
    }
}

export class QueryBuilderSurfaceManager extends GraphSurfaceManager {

    _checkComputableGraph() {
        return this._state.nodeList.every(it => this._state.graphManager.vertices.has(it));
    }

    async _processSingleNode(node) {
        let id = await node.information().id();
        let color = await node.information().color();
        let name = await node.information().name();

        // Check for grouping
        let entityGrouping = node.grouping;
        if (entityGrouping) {
            // Determine groups
            let groupToIdMap = await QueryUtils.entitiesGroupedBy(id, entityGrouping);
            let res = [];
            groupToIdMap.forEach((value, key, map) => {
                let sankeyNode = new CustomSankeyNode(name, key, null, color, node);
                sankeyNode.elements = [...value];
                res.push(sankeyNode)
            });
            return res;
        } else {
            let elements = await node.information().elements();
            let resultNode = new CustomSankeyNode(name, name, null, color, node);
            resultNode.elements = elements;
            return [resultNode];
        }
    }


    async computeSankey() {

        if (!this._checkComputableGraph()) {
            throw new Error('Graph computation disallowed')
        }

        // Iterate through the path and build Sankey Nodes
        let sankeyNodeMap = new Map();
        this._state.graphManager.outgoing.forEach(async (value, key, map) => {
            // Source Node Processing
            let sourceNodeMapped = await this._processSingleNode(key);
            sankeyNodeMap.set(key, sourceNodeMapped);

            // Process targets
            value = [...value].map(it=>it[1]); // Construct Array with targets mapped
            for (let val of value) {
                if (sankeyNodeMap.has(val)) continue;
                sankeyNodeMap.set(val, (await this._processSingleNode(val)));
            }

            // Build relationships
            for (let mappedSourceNode of sourceNodeMapped) {
                for (let targetNode of value) {
                    let targets = sankeyNodeMap.get(targetNode);
                    for (let target of targets) {
                        // Compute connection value
                        mappedSourceNode.elementsRelatedTo(target);
                        //mappedSourceNode.addConnectedNode(target, );
                    }
                }
            }
        })

    }

}