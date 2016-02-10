export class FormControl extends React.Component {

    constructor() {
        super()
    }

    get value() {
        return $(this._inputControl).val()
    }

    get placeholder() {
        return this.props.placeholder || ''
    }

    static get defaultProps() {
        return {
            className: '',
            type: 'text'
        }
    }

    _buildInput() {
        return this.props.children ||  (
            <input type={this.props.type} placeholder={this.placeholder} className="form-control" ref={(c) => this._inputControl = c} />
        )
    }

    render() {
        return (
            <div className={'form-group' + this.props.className}>
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

    static getDefaultProps() {
        return {
            className: ''
        }
    }


    render() {
        return (
            <form className={'form-horizontal ' + this.props.className}>
                {this.props.children}
            </form>
        )
    }
}