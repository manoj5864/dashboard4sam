import {mixin} from '../../util/mixin'
import {TLoggable} from '../../util/logging/TLoggable'


let Parents = mixin(React.Component, TLoggable)

export class Topbar extends Parents {

    constructor() {
        super()
    }

    render() {
        return (
            <div className="topbar">
                <div className="topbar-left">
                    <div className="text-center">
                        <a><span>Dashboard4SAM</span></a>
                    </div>
                </div>

            </div>

        )
    }
}