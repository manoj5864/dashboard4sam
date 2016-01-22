import {ReactNodeElement} from '../graph/ReactNodeElement'
import {mixin} from '../../../util/mixin'
import {TLoggable} from '../../../util/logging/TLoggable'
import {Modal} from '../../main/widgets/Modal'
import {InfoWindow} from '../dialog/InfoWindow'
import {app} from  '../../../Application'

let React = window.React

class QueryBuilderReactElement extends React.Component {

    constructor() {
        super();
        this.state = {
            showAddProperty: false,
            knownAttributes: []
        };
    }

    static get defaultProps() {
        return {
            name: 'Default Name',
            color: '#5d9cec',
            entityObject: {
                id: null,
                name: ''
            }
        }
    }

    componentWillMount() {
        this._refresh();
    }

    async _refresh() {

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

        // Set states
        let resultAttributes = await attributes;
        resultAttributes.data.type[0].attributes;
        console.log(resultAttributes);
        //this.setState({knownAttributes: (await attributes).data.type.attributes});
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

        return (
          <div className="row" style={{width: '200px'}}>
            <div className="panel panel-border panel-custom">
                <div className="panel-heading" style={{color: this.props.color}}>
                    <h3 className="panel-title">{this.props.entityObject.name}</h3>
                </div>
                <div className="panel-body">
                    <p>
                        Amount:
                    </p>
                </div>
                <div className="panel-footer">
                    <table>
                        {renderPropertyRows()}
                    </table>
                    {addProperty()}
                    <button onClick={it=>this.setState({showAddProperty: true})}>Add</button>
                </div>
            </div>
          </div>
        )
    }

    /*

     */
}

export class QueryBuilderNodeElement extends mixin(ReactNodeElement, TLoggable) {

    constructor(reference) {
        super();
        this._refObject = reference;
        this._applyReactElement(
            <QueryBuilderReactElement
                entityObject={this._refObject}
                onDblClick={this._handleDoubleClick.bind(this)}
            />
        )
    }

}
