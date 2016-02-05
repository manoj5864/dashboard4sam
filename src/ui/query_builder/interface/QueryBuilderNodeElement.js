import {ReactNodeElement} from '../graph/ReactNodeElement'
import {GraphReactComponent} from '../graph/GraphReactComponent'
import {mixin} from '../../../util/mixin'
import {TLoggable} from '../../../util/logging/TLoggable'
import {InfoWindow} from '../dialog/InfoWindow'
import {app} from  '../../../Application'
import {QueryUtils} from '../../../model/QueryUtils'
import {Modal} from '../../../ui/main/widgets/Modal'
import {TabWrapper, TabbedContent} from '../../../ui/main/widgets/Tabs'
import {EntityTypeDetails} from '../../../ui/query_builder/dialog/EntityTypeDetails'
import {CompletenessStatsView} from '../../../ui/graphs/CompletenessStats'
import {ColorPicker} from '../../main/widgets/util/ColorPicker'
import {Deferred} from '../../../util/wait'
import {default as _} from 'lodash'
import {Select} from '../../main/widgets/forms/Select'

let React = window.React;

class EntityTypeInformation {
    get amountOfElements() {}
}

class QueryBuilderReactElement extends GraphReactComponent {

    constructor(props) {
        super();
        this.state = {
            showAddProperty: false,
            knownAttributes: [],
            knownLinks: [],
            amountOfElements: 0,
            isSelected: false,
            isLoading: false,
            color: props.color
        };
        this._firstUpdate = true;
        this._filters = [];
    }

    //<editor-fold desc="React related">
    static get defaultProps() {
        return {
            name: 'Default Name',
            color: '#5fbeaa',
            entityProvider: {
                name: () => { return 'Default Name' },
                amountOfEntities: async () => { return 0; }
            },
            updateColor: (newColor) => {}
        }
    }

    componentWillMount() {
        this._refresh();
    }

    _buildStyle() {
        let res = {width: '200px'};
        if (this.state.isSelected) res.borderWidth = '4px';
        return res;
    }
    //</editor-fold>

    //<editor-fold desc="SurfaceManager Events">
    _setSelected(val) {
        this.setState({
            isSelected: val
        })
    }
    //</editor-fold>

    componentWillMount() {
        this._refresh();
        this.props.updateColor(this.props.color);
    }

    async _refresh() {
        this.setState({isLoading: true});
        let attributes = app.socioCortexManager.executeQuery(`
            query EntityAttributesAndLinks {
                type(id: "${this.props.entityProvider.id()}") {
                    attributes {
                        name
                        type
                    }
                }
            }
        `);

        let amountOfEntities = await this.props.entityProvider.amountOfEntities();
        let links = app.socioCortexManager.executeQuery(`
            query EntityAttributesAndLinks {
                type(id: "${this.props.entityProvider.id()}") {
                    attributes(includeLinks: true, onlyLinks: true) {
                        name
                        type
                    }
                }
            }
        `);

        // Set states
        const tempAttributes = await attributes;
        const tempLinks = await links;
        const resultAttributes = tempAttributes.data.type[0].attributes;
        const resultLinks = tempLinks.data.type[0].attributes;

        let index = null;
        const options = resultAttributes.concat(resultLinks).map(it=>it.name);
        if (this._firstUpdate && this.props.grouping) {
            index = options.indexOf(this.props.grouping) + 1;
            this._firstUpdate = false;
        }
        this.setState({
            //knownAttributes: ,
            amountOfElements: amountOfEntities,
            isLoading: false,
            knownAttributes: resultAttributes,
            knownLinks: resultLinks,
            isLoading: false,
            groupingOptions: options,
            groupingIndex: 0 || index
        });
    };



    render() {
        let renderOptions = [{name:'name'}].concat(this.state.knownAttributes).map(it=>it.name);

        const removeFilter = (index, e) => {
            e.stopPropagation();
            let filters = this._filters;
            console.log(`Remove filter ${index}, filters: ${JSON.stringify(filters)}`);
            console.log(JSON.stringify(filters.filter((elem,i) => {return i !== index})));
            this._filters = filters.filter((elem,i) => {return i !== index});
            this.setState({filters: this._filters});
        };

        let addProperty = () =>{
            if (this.state.showAddProperty) {
                return (
                    <table>
                        <tbody>
                            <tr>
                                <td><select>{renderOptions()}</select></td>
                            </tr>
                            <tr>
                                <td><input type="text" style={{width: '150px'}} /></td>
                                <td><button onClick={it=>this.setState({showAddProperty: false})}>-</button></td>
                                <td>
                                    <select onChange={(e)=>{this._filters[i].name = renderOptions[e.target.value]; this.setState({filters: this._filters})}}>
                                        {renderOptions.map(it=>{return <option>{it.name}</option>})}
                                    </select>
                                </td>
                            </tr>,
                            <tr>
                                <td><input onChange={(e)=>{this._filters[i].regex = e.target.value; this.setState({filters: this._filters})}} type="text" style={{width: '150px'}} value={this._filters[i].regex} /></td>
                                <td><button onClick={e=>{removeFilter(i,e)}}>-</button></td>
                            </tr>
                        </tbody>
                    </table>
                );
            } else return null;
        };

        let renderPropertyRows = () => {

        };

        const pickColor = async (e)=>{
            e.stopPropagation();
            const newColor = await ColorPicker.getColor(this.state.color);
            console.log(`Set new color ${newColor}`);
            this.props.updateColor(newColor);
            this.setState({color: newColor})
        };

        let renderLoader = () => {
            if (this.state.isLoading)
            return (
                <div style={{position: 'fixed', width: '100%', height: '100%'}}>
                    <div style={{position: 'absolute',
                                height: '100%',
                                width: '100%',
                                background: 'rgba(255, 255, 255, 0.80)',
                                zIndex: '1'}}>
                        <div className="sk-folding-cube" style={{marginTop: '20%'}}>
                            <div className="sk-cube1 sk-cube"></div>
                            <div className="sk-cube2 sk-cube"></div>
                            <div className="sk-cube4 sk-cube"></div>
                            <div className="sk-cube3 sk-cube"></div>
                        </div>
                    </div>
                </div>
            );
        };
        const selectChange = (i) => {this.setState({groupingIndex: i})};
        const renderGrouping = ['(No Grouping)'].concat(this.state.groupingOptions);
        const addFilter = (e) => {
            e.stopPropagation();
            this._filters.push({name:'',regex:'',invert:false});
            this.setState({filters: this._filters});
        };
        return (
            <div className="panel panel-border panel-custom" style={this._buildStyle()}>
                {renderLoader()}
                <div className="panel-heading" style={{borderColor: this.state.color, color: this.state.color}}>
                    <h3 className="panel-title" style={{color: this.state.color}}>
                        {this.props.entityProvider.name()}
                    </h3>
                </div>
                <div className="panel-body">
                    <p>
                        Amount: {this.state.amountOfElements}<br/>
                        Group by:<Select change={selectChange} style={{width:'150px'}} index={this.state.groupingIndex}>{renderGrouping}</Select>
                    </p>
                </div>
                <div className="panel-footer">
                    <table>
                        {renderPropertyRows()}
                    </table>
                    {addProperty()}
                    <button onClick={it=>this.setState({showAddProperty: true})}>Add Filter</button>
                    <br/>
                    <button onClick={pickColor}>Select Color</button>
                </div>
            </div>
        )
    }
}

export class QueryBuilderNodeElement extends mixin(ReactNodeElement, TLoggable) {

    /**
     * Externally provided information
     * @returns {{name: name, color: color, amount: amount, elements: elements}}
     */
    information() {
        return {
            name: async () => this._refObject.name,
            color: async () => this._color,
            amount: async () => (await this._getElements()).length,
            elements: async () => (await this._getElements()),
            relations: async (node) => this._state.entityRelationMap.get(node)
        }
    }

    get grouping() {
        const state = this._reactDomElement.state;
        if (!state.groupingIndex) return "";
        return state.groupingOptions[state.groupingIndex-1]
    }

    get entityType() {
        return this._refObject;
    }

    //<editor-fold desc="SurfaceManager Events">
    _setSelected(val) {
        this._reactDomElement._setSelected(val)
    }

    _handleDoubleClick() {
        const name = this._refObject.name;
        const id = this._refObject.id;
        const title = ['Details for EntityType ', <strong>{name}</strong>];
        const entitiesTab = (
            <EntityTypeDetails id={id} name={name} />
        );

        const wrappedTabs = [
            new TabWrapper('Entities', null, entitiesTab, '60%'),
            new TabWrapper('Statistics', null, <CompletenessStatsView id={id} name={name} />, '60%')
        ];

        Modal.show(title, <TabbedContent active={0}>{wrappedTabs}</TabbedContent>)
    }
    //</editor-fold>

    async _getElements() {
        // Already retrieving the data
        if (this._state.promiseWaitingForEntities) return this._state.promiseWaitingForEntities;
        if (this._state.cachedEntities) return this._state.cachedEntities;

        let deferred = new Deferred();
        this._state.promiseWaitingForEntities = deferred.promise;

        let incomingNodes = this._sm_getIncomingNodes();
        if ((!incomingNodes) || (incomingNodes.size == 0)) {
            // Beginning node
            let entities = await QueryUtils.entities({
                type: this.entityType.name
            });
            this._state.cachedEntities = entities.entity;
            deferred.resolve(entities.entity);
            this._state.promiseWaitingForEntities = null;
            return entities.entity;
        } else {
            // Connected node
            let nodeMap = new Map();
            let promisesForIncomingElements = [];
            this._state.entityRelationMap = new Map();
            this.debug("Asking incoming nodes for entities..")
            for (let node of incomingNodes) {
                let fromNode = node[0];
                let promise = fromNode._getElements();
                promisesForIncomingElements.push(promise);
                nodeMap.set(fromNode, promise);
            }
            let res = await Promise.all(promisesForIncomingElements)
            this.debug("Entities retrieved")

            let entities = [];
            for (let key of nodeMap.keys()) {
                let typeSource = key.entityType.id;
                let typeTarget = this.entityType.id;
                let sourceElements = await nodeMap.get(key);
                let res = await QueryUtils.getElementsInRelationship(
                    {typeIdSource: typeSource},
                    sourceElements,
                    {typeIdTarget: typeTarget}
                );
                this._state.entityRelationMap.set(key, res);
                for (let val of res.values()) {
                    entities = entities.concat([...val]);
                }
                entities = _.uniq(entities).map(it=>{return {id: it}});
            }
            this._state.cachedEntities = entities;
            deferred.resolve(entities);
            this._state.promiseWaitingForEntities = null;
            return entities;
        }
    }

    _update({nodeConnected = false} = {}, context) {
        if (nodeConnected) {
            if (context.incoming) {
                this.debug(`Incoming connection added`)
                this._refresh()
            }
        }
    }

    _refresh() {
        // Clear cache
        this._state.cachedEntities = null;
        // Trigger following elements
        let outgoingNodes = this._sm_getOutgoingNodes();
        if (outgoingNodes && outgoingNodes.length > 0) {
            // Trigger following nodes, since they will trigger me
            for (let node of outgoingNodes) {
                node._refresh();
            }
        } else {
            // Update myself only
            this._reactDomElement._refresh();
        }
    }

    addRelation(queryBuilderNodeElement) {

    }

    _buildEntityProvider() {
        return {
            name: () => this.entityType.name,
            id: () => this.entityType.id,
            amountOfEntities: async () => {
                return (await this._getElements()).length
            }
        }
    }

    _sm_serialize() {
        return {
            id: this._id,
            type: 'QueryBuilderNodeElement',
            x: this._x,
            y: this._y,
            color: this._color,
            grouping : this.grouping,
            filters: [],
            data: this._refObject
        }
    }

    static fromJSON(jsonObject) {
        let result = new QueryBuilderNodeElement(jsonObject.data, jsonObject.color, jsonObject.grouping);
        result._id = jsonObject.id;
        result._x = jsonObject.x;
        result._y = jsonObject.y;
        return result;
    }

    constructor(reference, color = undefined, grouping = undefined) {
        super();
        this._refObject = reference;
        this._color = color;
        this._applyReactElement(
            <QueryBuilderReactElement
                entityProvider={this._buildEntityProvider()}
                color={this._color}
                updateColor={(newColor) => {this._color = newColor}}
                grouping={grouping}
            />
        );

        this._state = {
            promiseWaitingForEntities: null,
            cachedEntities: null,
            entityRelationMap: null
        };
    }

}
