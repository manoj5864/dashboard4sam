import {mixin} from '../../../util/mixin'
import {TLoggable} from '../../../util/logging/TLoggable'

let React = window.React
let $ = window.$

export class Button extends mixin(React.Component, TLoggable){
    constructor() {
        super()
    }

    render() {
        return(
            <button type="button" className="btn btn-default waves-effect" onClick={this.props.onClick}>{this.props.text}</button>
        )
    }
}