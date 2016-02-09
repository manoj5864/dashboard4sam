import {GraphSurfaceManager} from '../graph/GraphSurfaceManager'
import {QueryUtils} from '../../../model/QueryUtils'
import {SankeyNode} from '../../graphs/sankey/SankeyNode'
import {Modal} from '../../../ui/main/widgets/Modal'
import {TabWrapper, TabbedContent} from '../../../ui/main/widgets/Tabs'
import {EntityTypeDetails} from '../../../ui/query_builder/dialog/EntityTypeDetails'
import {CompletenessStatsView} from '../../../ui/graphs/CompletenessStats'

class CustomSankeyNode extends SankeyNode {

    async _handleDoubleClick() {
        const name = await this.queryBuilderNode.information().name();
        const id = await this.queryBuilderNode.information().id();
        const title = ['Details for EntityType ', <strong>{name}</strong>];
        const instances = this.elements;
        const entitiesTab = (
            <EntityTypeDetails id={id} instances={instances} name={name} />
        );

        const wrappedTabs = [
            new TabWrapper('Entities', null, entitiesTab, '60%'),
            new TabWrapper('Completeness', null, <CompletenessStatsView id={id} name={name} />, '60%')
        ];

        Modal.show(title, <TabbedContent active={0}>{wrappedTabs}</TabbedContent>)
    }

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

        // Nothing to compare? -> Return empty array
        if ((sourceElements.length == 0) || (targetElements.length == 0)) {
            return [];
        }

        let relationMap = await QueryUtils.getElementsInRelationship({typeIdSource: sourceTypeId}, sourceElements, {typeIdTarget: targetTypeId}, targetElements);
        let res = [];
        relationMap.forEach((value, key) => {
            for (let relatedEntity of value) {
                res.push([key, relatedEntity]);
            }
        });
        return res;
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

class NotRelatedCustomSankeyNode extends CustomSankeyNode {
    addElements(elements) {
        this._state.elements = this._state.elements.concat(elements);
    }

    constructor(...args) {
        super(...args);
        this._state.elements = []; // Empty array as there will be no initial entities provided
    }
}

export class QueryBuilderSurfaceManager extends GraphSurfaceManager {

    _checkComputableGraph() {
        return this._state.nodeList.every(it => this._state.graphManager.vertices.has(it));
    }

    async _processSingleNode(node, noneMap) {
        let id = await node.information().id();
        let color = await node.information().color();
        let name = await node.information().name();

        let noneNode = noneMap.get(node) || new NotRelatedCustomSankeyNode(
                name, `${name}: Not related`, null, color, node
        );
        noneMap.set(node, noneNode);

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
            res.push(noneNode);
            return res;
        } else {
            let elements = await node.information().elements();
            let resultNode = new CustomSankeyNode(name, name, null, color, node);
            resultNode.elements = elements;
            return [resultNode, noneNode];
        }
    }


    async computeSankey() {
        if (!this._checkComputableGraph()) {
            throw new Error('Graph computation disallowed')
        }

        // Iterate through the path and build Sankey Nodes
        let sankeyNodeMap = new Map();
        let noneSankeyNodeMap = new Map();
        for (let key of this._state.graphManager.outgoing.keys()) {
            let sourceNodeMapped = sankeyNodeMap.get(key);
            if(!sourceNodeMapped) {
                sourceNodeMapped = await this._processSingleNode(key, noneSankeyNodeMap);
                sankeyNodeMap.set(key, sourceNodeMapped);
            }
            let value = this._state.graphManager.outgoing.get(key);


            // Process targets
            value = [...value].map(it=>it[1]); // Construct Array with targets mapped
            for (let val of value) {
                if (sankeyNodeMap.has(val)) continue;
                sankeyNodeMap.set(val, (await this._processSingleNode(val, noneSankeyNodeMap)));
            }

            // Build relationships
            for (let mappedSourceNode of sourceNodeMapped) {
                for (let targetNode of value) {
                    let targets = sankeyNodeMap.get(targetNode);
                    for (let target of targets) {
                        // Compute connection value
                        let connectedElements = await mappedSourceNode.elementsRelatedTo(target);
                        let connectionStrength = connectedElements.length;
                        if (connectionStrength > 0)
                        mappedSourceNode.addConnectedNode(target, connectionStrength);
                    }
                }
            }
        }

        let nodesOutput = [];
        for (let val of sankeyNodeMap.values()) {
            nodesOutput = nodesOutput.concat([...val]);
        }

        // Add Sankey Node elements for non-connected entities
        for (let val of noneSankeyNodeMap.values()) {
            if (val.connectedNodes.length > 0) {
                nodesOutput.push(val);
            }
        }
        return nodesOutput;
    }

}