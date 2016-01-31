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
    }

    static get defaultProps() {
        return {
            name: 'Default Name',
            color: '#5fbeaa',
            entityObject: {
                id: null,
                name: ''
            },
            updateColor: (newColor) => {},
            entityObjectProvider: () => { return ['Abcde'] }
        }
    }

    _setSelected(val) {
        this.setState({
            isSelected: val
        })
    }

    componentWillMount() {
        this._refresh();
        this.props.updateColor(this.props.color);
    }

    async _refreshAmount() {

    }

    async _refresh() {
        this.setState({isLoading: true});
        let attributes = app.socioCortexManager.executeQuery(`
            query EntityAttributesAndLinks {
                type(id: "${this.props.entityObject.id}") {
                    attributes {
                        name
                        type
                    }
                }
            }
        `);

        let links = app.socioCortexManager.executeQuery(`
            query EntityAttributesAndLinks {
                type(id: "${this.props.entityObject.id}") {
                    attributes(includeLinks: true, onlyLinks: true) {
                        name
                        type
                    }
                }
            }
        `);

        let entityAmount = QueryUtils.amountOfEntities({
            type: this.props.entityObject.name
        });


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
            knownAttributes: resultAttributes,
            knownLinks: resultLinks,
            amountOfElements: await entityAmount,
            isLoading: false,
            groupingOptions: options,
            groupingIndex: 0 || index
        });
    };

    _buildStyle() {
        let res = {width: '200px'};
        if (this.state.isSelected) res.borderWidth = '4px';
        return res;
    }


    render() {
        let renderOptions = () => {
            return [{name:'name'}].concat(this.state.knownAttributes)
                .map(it=><option>{it.name}</option>);
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
        };
        const selectChange = (i) => {this.setState({groupingIndex: i})};
        const renderGrouping = ['(No Grouping)'].concat(this.state.groupingOptions);
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

    /*

     */
}

export class QueryBuilderNodeElement extends mixin(ReactNodeElement, TLoggable) {

    get color() {
        return this._color
    }

    set color(color) {
        this._color = color
    }

    get grouping() {
        const state = this._reactDomElement.state;
        if (!state.groupingIndex) return "";
        return state.groupingOptions[state.groupingIndex-1]
    }

    get entityType() {
        return this._refObject;
    }

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

    async _getElements() {
        // Already retrieving the data
        if (this._state.promiseWaitingForEntities) return this._state.promiseWaitingForEntities;
        if (this._state.cachedEntities) return this._state.cachedEntities;

        let incomingNodes = this._sm_getIncomingNodes();
        if (incomingNodes.size == 0) {
            // Beginning node
            let entities = await QueryUtils.entities({
                type: this.props.entityObject.name
            });
            this._state.cachedEntities = entities;
            console.log(entities);
            return entities;
        } else {
            // Connected node
            let promisesForIncomingElements = [];
            for (let node of incomingNodes) {
                let fromNode = node[0];
                promisesForIncomingElements.push(fromNode._getElements());
            }
            let res = await Promise.all(promisesForIncomingElements)
            console.log(res);
        }
    }

    _update({nodeConnected = false} = {}, context) {
        if (nodeConnected) {
            if (context.incoming) {
                this.debug(`Incoming connection added`)
                this._getElements();

            }
        }
    }

    _refresh() {

    }

    addRelation(queryBuilderNodeElement) {

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
            entityObject={this._refObject}
            color={this._color}
            updateColor={(newColor) => {this.color = newColor}}
            grouping={grouping}/>
        );

        this._state = {
            promiseWaitingForEntities: null,
            cachedEntities: null
        };
    }

}
