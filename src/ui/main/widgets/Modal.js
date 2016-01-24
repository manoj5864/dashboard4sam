import {mixin} from '../../../util/mixin'
import {TLoggable} from '../../../util/logging/TLoggable'
import {Button} from './Button'

let React = window.React;
let ReactDOM = window.ReactDOM;
let $ = window.$;

const MODAL_MOUNTPOINT = '#modalMountpoint';

export class Modal extends mixin(React.Component, TLoggable) {

    static get propTypes() {
        return {
            visible: React.PropTypes.bool
        }
    }

    static get defaultProps() {
        return {
            visible: false,
            header: '',
            children: '',
            footer: ''
        }
    }

    constructor(props) {
        super();
        this.state = {
            visible: props.visible,
            header: props.header,
            content: props.children
        }
    }

    static show(title, content) {
        ReactDOM.render(
            <Modal header={title} visible={true}>{content}</Modal>
        , $(MODAL_MOUNTPOINT)[0])
    }

    static hide() {
        ReactDOM.unmountComponentAtNode($(MODAL_MOUNTPOINT)[0]);
    }

    _handleCloseClick() {
        this.debug('Modal Close invoked...')
        Modal.hide()
    }

    _buildClass() {
        return "modal fade" + (this.state.visible ? " in" : "")
    }

    render() {
        return(
            <div className={this._buildClass()} tabIndex="-1" style={{display: 'block'}} ref={c => this._modalElement = c}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">{this.state.header}</h4>
                        </div>
                        <div className="modal-body">
                            {this.state.content}
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