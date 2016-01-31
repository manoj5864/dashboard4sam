import {mixin} from '../../../../util/mixin'
import {TLoggable} from '../../../../util/logging/TLoggable'

let Parents = mixin(React.Component, TLoggable);
export class Select extends Parents {

    static get propTypes() {
        return {
            multiple : React.PropTypes.bool,
            change : React.PropTypes.func
        }
    }

    static get defaultProps() {
        return {
            multiple : false,
            change : (newIndex) => {},
            style: {},
            index: 0
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            multiple: props.multiple,
            children : props.children,
            index: props.index
        }
    }

    handleChange(event) {
        this.props.change(event.target.value);
        this.setState({index: event.target.value})
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            children : nextProps.children,
            index: nextProps.index
        })
    }

    render() {
        return (
            <select onChange={ e => this.handleChange(e) } style={this.props.style} value={this.state.index}>
                {this.state.children.map(
                    (option, i) => {
                        return <option value={i}>{option}</option>
                    }
                )}
            </select>
        )
    }

}