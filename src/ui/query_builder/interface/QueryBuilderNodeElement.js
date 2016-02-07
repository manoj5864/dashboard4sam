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
            filters: [],
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

    async _refresh(propagate = false) {
        this.setState({isLoading: true});
        if (propagate) this.props.entityProvider.clear();
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
        const options = resultAttributes.map(it=>it.name);
        if (this._firstUpdate && this.props.grouping) {
            index = options.indexOf(this.props.grouping) + 2;
            this._firstUpdate = false;
        }
        this.setState({
            //knownAttributes: ,
            amountOfElements: amountOfEntities,
            isLoading: false,
            knownAttributes: resultAttributes,
            knownLinks: resultLinks,
            groupingOptions: options,
            groupingIndex: 0 || index
        });
    };

    render() {
        let renderOptions = (i) => {
            return [{name:'name'}].concat(this.state.knownAttributes)
                .map(it=><option selected={it.name === this._filters[i].name}>{it.name}</option>);
        };

        let removeFilter = (index) => {
            this._filters = this._filters.filter((e,i) => {return i !== index});
            this.setState({filters: this._filters});
        };

        let changeFilterRegex = (event, index) => {
            this._filters[index].regex = event.target.value;
            this.setState({filters: this._filters})
        };

        let changeFilterName = (event, index) => {
            this._filters[index].name = event.target.value;
            this.setState({filters : this._filters})
        };

        let addProperty = () =>{
            let filters = this._filters;
            if (filters.length > 0) {
                return (
                    <table>
                        <tbody>
                        {filters.map((filter, i) => {
                            return [
                            <tr>
                                <td><select onChange={e => {changeFilterName(e,i)}}>{renderOptions(i)}</select></td>
                            </tr>,
                            <tr>
                                <td><input type="text" style={{width: '150px'}} onBlur={this._refresh.bind(this, true)} onChange={e => {changeFilterRegex(e,i)}} value={this.state.filters[i].regex} /></td>
                                <td><button onClick={removeFilter.bind(this, i)}>-</button></td>
                            </tr>
                            ]
                        }).reduce((prev, curr) => {return prev.concat(curr)}, [])}
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
        const renderGrouping = ['(No Grouping)', 'name'].concat(this.state.groupingOptions);
        const addFilter = (e) => {
            e.stopPropagation();
            this._filters.push({name:'name',regex:'',invert:false});
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
                    <button onClick={addFilter}>Add Filter</button>
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
            id: async () => this._refObject.id,
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
        if (state.groupingIndex == 1) return 'name';
        return state.groupingOptions[state.groupingIndex-2]
    }

    get filters() {
        if (!this._reactDomElement) return []; // Might not be available yet
        const state = this._reactDomElement.state;
        if (!state.filters) return [];
        return state.filters
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
        if (this._state.cachedEntities) return this._state.cachedEntities;
        if (this._state.deferredWaitingForEntities) return this._state.deferredWaitingForEntities.promise;
        this._state.deferredWaitingForEntities = new Deferred();

        let attributeFilterMap = {};
        this.filters.forEach(it=>attributeFilterMap[it.name] = it.regex);

        let entities = await QueryUtils.entities({
            typeId: this.entityType.id
        }, {attributeFilter: attributeFilterMap});
        entities = entities.entity.map(it => it.id);
        this._state.cachedEntities = entities;
        this._state.deferredWaitingForEntities.resolve(entities.entity);
        this._state.deferredWaitingForEntities = null;
        return entities;
    }

    _update({nodeConnected = false} = {}, context) {
        if (nodeConnected) {
            if (context.incoming) {
                this.debug(`Incoming connection added`)
                this._refresh()
            }
        }
    }

    _clear() {
        this._state.cachedEntities = null;
    }

    _refresh() {
        // Clear cache
        this._clear();
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
            },
            clear: () => this._clear()
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
            filters: this.filters,
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
            deferredWaitingForEntities: null,
            cachedEntities: null,
            entityRelationMap: null
        };
    }

}
