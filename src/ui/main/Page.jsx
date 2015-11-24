import {mixin} from '../../util/mixin'
import {TLoggable} from '../../util/logging/TLoggable'
import {Menu} from './Menu'
import {Topbar} from './Topbar'
import {Content} from './Content'

let React = window.React
let Parents = mixin(React.Component, TLoggable)

export class Page extends Parents{

    constructor() {
        super()
    }

    render() {
        return (
            <div id="wrapper">
                <Topbar />,
                <Menu/>,
                <Content />
            </div>
        )
    }
}