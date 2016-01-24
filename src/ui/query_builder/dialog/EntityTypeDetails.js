import {mixin} from '../../../util/mixin'
import {TLoggable} from '../../../util/logging/TLoggable'

let React = window.React;

export class EntityTypeDetails extends mixin(React.Component, TLoggable) {

    static get propTypes() {
        return {
            id: React.PropTypes.string.isRequired
        }
    }

    static get defaultProps() {
        return {
            id: null
        }
    }

    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        return(
            <div>

            </div>
        )
    }

} 