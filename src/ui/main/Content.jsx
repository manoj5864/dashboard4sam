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
            <div className="content-page">
                <div className="content">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="page-header-2">
                                    <h4 className="page-title">

                                    </h4>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        )
    }
}