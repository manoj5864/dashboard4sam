import {ReactNodeElement} from '../graph/ReactNodeElement'
import {mixin} from '../../../util/mixin'
import {TLoggable} from '../../../util/logging/TLoggable'
import {Modal} from '../../main/widgets/Modal'
import {InfoWindow} from '../dialog/InfoWindow'
import {app} from  '../../../Application'

let React = window.React

class QueryBuilderReactElement extends React.Component {

    constructor() {
        super()
    }

    static get defaultProps() {
        return {
            name: 'Default Name',
            color: '#5d9cec'
        }
    }

    render() {
        return (
          <div className="row" style={{width: '200px'}}>
            <div className="panel panel-border panel-custom">
                <div className="panel-heading" style={{color: this.props.color}}>
                    <h3 className="panel-title">{this.props.name}</h3>
                </div>
                <div className="panel-body">
                    <p>
                        Decription of element
                    </p>
                </div>
                <div className="panel-footer">
                </div>
            </div>
          </div>
        )
    }

    /*

     */
}

export class QueryBuilderNodeElement extends mixin(ReactNodeElement, TLoggable) {

    async _handleDoubleClick() {
        let entities = await app.socioCortexManager.executeQuery(`
            query EntityAttributes {
                type(id: "${this._refObject.id}") {
                    attributes {
                        name
                        type
                    }
                }
            }
        `)
        Modal.show(<InfoWindow attributes={entities.data.type[0].attributes} />)
    }

    constructor(reference) {
        super()
        this._refObject = reference
        this._applyReactElement(<QueryBuilderReactElement name={reference.name} onDblClick={this._handleDoubleClick.bind(this)}/>)
    }

}
