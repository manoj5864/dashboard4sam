class ColorPicker {

    static getColor() {
        // Must be triggered from click event
        let divContainer = $('<div></div>');
        divContainer.appendTo($('body'));
        let colorElement = ReactDOM.render(<ColorPicker />, divContainer[0]);
        let color =  colorElement._getColor();

        // Cleanup
        React.unmountComponentAtNode(divContainer[0]);
        divContainer.remover();
    }

    _getColor() {
        // Click on the element
        $(this._element).click();
        return $(this._element).val();
    }

    render() {
        return (
            <input type="color" style={{'display': 'none'}} ref={c => this._element = c} />
        )
    }

}