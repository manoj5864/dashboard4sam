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

    static get defaultProps() {
        return {
            name: 'Default Name',
            color: '#5fbeaa',
            entityObject: {
                id: null,
                name: ''
            },
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
    }

    async _refreshAmount() {

    }

    async _refresh() {
        this.setState({isLoading: true});
        let attributes = app.socioCortexManager.executeQuery(`
            query EntityAttributes {
                type(id: "${this.props.entityObject.id}") {
                    attributes {
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
        let resultAttributes = await attributes;

        this.setState({
            knownAttributes: resultAttributes.data.type[0].attributes,
            amountOfElements: await entityAmount,
            isLoading: false
        });
    };

    _buildStyle() {
        let res = {width: '200px'};
        if (this.state.isSelected) res.borderWidth = '4px';
        return res;
    }


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
                        Amount: {this.state.amountOfElements}
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

    /*

     */
}

export class QueryBuilderNodeElement extends mixin(ReactNodeElement, TLoggable) {

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

    _update({nodeConnected = false} = {}, context) {
        if (nodeConnected) {
            if (context.incoming) {
                this.debug(`Incoming connection added`)
                let incomingNodes = this._sm_getIncomingNodes();

            }

        }
    }

    _refresh() {

    }

    addRelation(queryBuilderNodeElement) {

    }

    constructor(reference) {
        super();
        this._refObject = reference;
        this._applyReactElement(
            <QueryBuilderReactElement
            entityObject={this._refObject}/>
        );

        this._state = {
            promiseWaitingForEntities: null
        };
    }

}
