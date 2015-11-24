import {mixin} from '../../util/mixin'
import {TLoggable} from '../../util/logging/TLoggable'

let React = window.React
let Parents = mixin(React.Component, TLoggable)

export class Content extends Parents{

    constructor() {
        super()
    }

    render() {
        return(
            <div></div>
        )
    }
}