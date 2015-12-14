/**
 * Created by andi on 14.12.15.
 */

let React = window.React

export class PlotlyWrapper extends React.Component {

    constructor(props) {
        super(props)
        this.state = {}
        this._element = null
    }

    render() {
        return(
            <div ref={c => this._element = c || this._element} ></div>
        )
    }
}