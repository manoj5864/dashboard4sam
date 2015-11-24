import {mixin} from '../../util/mixin'
import {TLoggable} from '../../util/logging/TLoggable'

let React = window.React
let Parents = mixin(React.Component, TLoggable)

export class Menu extends Parents {
    constructor() {
        super()
    }

    render() {
        return (
            <div className="menu"></div>
        )
    }
}