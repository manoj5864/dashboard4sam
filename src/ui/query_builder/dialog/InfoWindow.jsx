import {Form, FormControl} from '../../main/form/Form'

let React = window.React

export class InfoWindow extends React.Component {
    constructor() {
        super()
    }

    _buildControls() {
        debugger
        this.props.attributes.map((entry) => {
            return (
                <FormControl name={entry.name}/>
            )
        })
    }

    render() {
        return(
            <Form>
                {this._buildControls()}
            </Form>
        )
    }
}