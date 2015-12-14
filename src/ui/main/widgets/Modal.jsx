import {mixin} from '../../../util/mixin'
import {TLoggable} from '../../../util/logging/TLoggable'
import {Button} from './Button'

let React = window.React
let ReactDOM = window.ReactDOM
let $ = window.$

const MODAL_MOUNTPOINT = '#modalMountpoint'

export class Modal extends mixin(React.Component, TLoggable) {
    constructor(props) {
        super()
        this.state = {
            visible: false
        }
    }

    static show(content) {
        ReactDOM.render(
            <Modal content={content} />
        , $(MODAL_MOUNTPOINT)[0])
    }

    static hide() {
        ReactDOM.unmountComponentAtNode($(MODAL_MOUNTPOINT)[0]);
    }

    _handleCloseClick() {
        this.debug('Modal Close invoked...')
        Modal.hide()
    }

    render() {
        return(
            <div className="modal fade in" tabIndex="-1" style={{display: 'block'}} ref={c => this._modalElement = c}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header"></div>
                        <div className="modal-body">
                            {this.props.content}
                        </div>
                        <div className="modal-footer">
                            <Button text="Close" onClick={this._handleCloseClick.bind(this)} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}