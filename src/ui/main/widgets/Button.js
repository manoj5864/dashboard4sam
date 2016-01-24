import {mixin} from '../../../util/mixin'
import {TLoggable} from '../../../util/logging/TLoggable'

let React = window.React
let $ = window.$

export class Button extends mixin(React.Component, TLoggable){
    constructor() {
        super()
    }

    _buildClass() {
        return this.props.className || "btn btn-default waves-effect"
    }

    render() {
        return(
            <button type="button" style={this.props.style} className={this._buildClass()} onClick={this.props.onClick}>{this.props.text}</button>
        )
    }
}