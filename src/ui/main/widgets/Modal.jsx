import {mixin} from '../../../util/mixin'
import {TLoggable} from '../../../util/logging/TLoggable'
import {Button} from './Button'

let React = window.React
let $ = window.$

class Modal extends mixin(React.Component, TLoggable) {
    constructor(props) {
        super()
        this.state = {
            visible: false
        }
    }

    show(content) {
        if (this.state.visible) { throw new Error('Modal Dialog is already visible')}

    }

    hide() {

    }

    _handleCloseClick() {
        this.hide()
    }

    render() {
        return(
            <div className="modal fade in" tabindex="-1" style="display: block;" ref={c => this._modalElement = c}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header"></div>
                        <div className="modal-body"></div>
                        <div className="modal-footer">
                            <Button onClick={$.proxy(this._handleCloseClick, this)} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}