import {mixin} from '../../util/mixin'
import {TLoggable} from '../../util/logging/TLoggable'
import {Menu} from './Menu'
import {Topbar} from './Topbar'
import {Content} from './Content'

let React = window.React

export class Page extends mixin(React.Component, TLoggable) {

    constructor() {
        super()
    }

    get contentSpot() {
        return this._contentSpot
    }

    get menuSpot() {
        return this._menuSpot
    }

    render() {
        return (
            <div id="wrapper">
                <Topbar />
                <div id="modalMountpoint"></div>
                <Menu ref={c => this._menuSpot = c}/>
                <Content ref={c => this._contentSpot = c} />
            </div>
        )
    }
}