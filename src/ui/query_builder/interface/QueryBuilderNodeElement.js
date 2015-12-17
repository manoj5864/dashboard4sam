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
            name: 'Default Name'
        }
    }

    render() {
        return (
            <svg version="1.1" width="293.5px" height="89.5px" viewBox="0 0 293.5 89.5" enable-background="new 0 0 293.5 89.5">
                    <path fill="#FFFFFF" stroke="#B3B3B3" stroke-miterlimit="10" d="M293.5,77.5c0,6.627-5.373,12-12,12h-269c-6.627,0-12-5.373-12-12
                        v-65c0-6.627,5.373-12,12-12h269c6.627,0,12,5.373,12,12V77.5z"/>
                    <path fill="#B3B3B3" d="M83,1v88.5L12.934,90C5.653,90,0,84.409,0,77.512V12.988C0,6.091,5.903,1,13.184,1H83"/>
                    <circle fill="#FFFFFF" stroke="#CCCCCC" stroke-miterlimit="10" cx="83.5" cy="44.955" r="36.364"/>
                    <text transform="matrix(1 0 0 1 129.7728 52.9089)" font-family="'SegoeUI-SemiBold'" font-size="24">{this.props.name}</text>
                    <rect x="58" y="22" fill="none" width="51" height="47"/>
            </svg>
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