import {waitFor} from '../../../../util/wait'

export class ColorPicker extends React.Component {

    static async getColor(preset = '#ffffff') {
        // Must be triggered from click event
        let divContainer = $("<div></div>");
        $('body').append(divContainer);
        let colorElement = ReactDOM.render(<ColorPicker preset={preset} />, divContainer[0]);
        let color = await colorElement._getColor();

        // Cleanup
        ReactDOM.unmountComponentAtNode(divContainer[0]);
        divContainer.remove();
        return color;
    }

    constructor(props) {
        super();
        this._changed = false;
        this._observer = () => {return this._changed}
    }

    async _getColor() {
        // Click on the element
        $(this._element).focus();
        $(this._element).click();
        const change = await waitFor(this._observer.bind(this));
        if (!change) return null;
        return $(this._element).val();
    }

    _buildStyle() {
        return {
            position: 'absolute',
            top: '0px',
            left: '-1000px',
            overflow: 'hidden'
        }
    }

    componentDidMount() {
        $(this._element).val(this.props.preset)
    }

    render() {
        return (
            <input type="color" style={this._buildStyle()}
                   ref={c => this._element = c} onChange={()=> this._changed = true} />
        )
    }

}