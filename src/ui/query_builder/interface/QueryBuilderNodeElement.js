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
            amountOfElements: 0,
            isSelected: false,
            isLoading: false,
            color: props.color
        };
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

        let amountOfEntities = await this.props.entityProvider.amountOfEntities();

        this.setState({
            //knownAttributes: ,
            amountOfElements: amountOfEntities,
            isLoading: false
        });
    };



    render() {
        let renderOptions = () => {
            return this.state.knownAttributes.map(it=><option>{it.name}</option>)
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
                                <td><input type="text" /></td>
                                <td><button onClick={it=>this.setState({showAddProperty: false})}>+</button></td>
                            </tr>
                        </tbody>
                    </table>
                );
            } else return null;
        };

        let renderPropertyRows = () => {

        };

        const pickColor = async ()=>{
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
        }

        return (
            <div className="panel panel-border panel-custom" style={this._buildStyle()}>
                {renderLoader()}
                <div className="panel-heading" style={{borderColor: this.state.color, color: this.state.color}}>
                    <h3 className="panel-title" style={{color: this.state.color}}>
                        {this.props.entityObject.name}
                    </h3>
                </div>
                <div className="panel-body">
                    <p>
                        Amount: {this.state.amountOfElements}<br/>
                        Group By: <span style={{color: 'lightgray'}}>(Nothing)</span>
                    </p>
                </div>
                <div className="panel-footer">
                    <table>
                        {renderPropertyRows()}
                    </table>
                    {addProperty()}
                    <button onClick={it=>this.setState({showAddProperty: true})}>Add</button>
                    <button onClick={pickColor}>Color</button>
                </div>
            </div>
        )
    }
}

export class QueryBuilderNodeElement extends mixin(ReactNodeElement, TLoggable) {

    get color() {
        return this._color
    }

    set color(color) {
        this._color = color
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
                )
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
            amountOfEntities: async () => {
                return (await this._getElements()).length
            }
        }
    }

    constructor(reference) {
    _sm_serialize() {
        return {
            id: this._id,
            type: 'QueryBuilderNodeElement',
            x: this._x,
            y: this._y,
            color: this._color,
            data: this._refObject
        }
    }

    static fromJSON(jsonObject) {
        let result = new QueryBuilderNodeElement(jsonObject.data, jsonObject.color);
        result._id = jsonObject.id;
        result._x = jsonObject.x;
        result._y = jsonObject.y;
        return result;
    }

    constructor(reference, color = undefined) {
        super();
        this._refObject = reference;
        this._color = color;
        this._applyReactElement(
            <QueryBuilderReactElement
                entityProvider={this._buildEntityProvider()},
            color={this._color}
            updateColor={(newColor) => {this.color = newColor}}/>
        );

        this._state = {
            promiseWaitingForEntities: null,
            cachedEntities: null
        };
    }

}
