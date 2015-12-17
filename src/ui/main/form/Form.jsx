let React = window.React

export class FormControl extends React.Component {

    constructor() {
        super()
    }

    get placeholder() {
        return this.props.placeholder || ''
    }

    _buildInput() {
        return (
            <input type="text" placeholder={this.placeholder} className="form-control" />
        )
    }

    render() {
        return (
            <div className="form-group">
                <label className="col-md-2 control-label">{this.props.name}</label>
                <div className="col-md-10">
                    {this._buildInput()}
                </div>
            </div>
        )
    }

}

export class Form extends React.Component{

    constructor() {
        super()
    }

    render() {
        return (
            <form className="form-horizontal">
                {this.props.children}
            </form>
        )
    }
}