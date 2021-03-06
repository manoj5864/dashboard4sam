import {mixin} from '../../util/mixin'
import {TLoggable} from '../../util/logging/TLoggable'
import {Topbar} from './Topbar'
import {Content} from './Content'

export class Page extends mixin(React.Component, TLoggable) {

    constructor() {
        super()
    }

    get contentSpot() {
        return this._contentSpot
    }
    render() {
        return (
            <div id="wrapper">
                <Topbar />
                <Content ref={c => this._contentSpot = c} />
            </div>
        )
    }
}