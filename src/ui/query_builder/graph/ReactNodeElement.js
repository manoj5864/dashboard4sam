import {NodeElement} from './NodeElement'

let $ = window.$
let ReactDOM = window.ReactDOM

export class ReactNodeElement extends NodeElement {

    constructor(reactElement, ...args) {
        super(args);
        this._reactElement = reactElement;
    }

    _applyReactElement(reactElement) {
        this._reactElement = reactElement;
    }

    _customRenderer() {
        let divContainer = $(document.createElementNS("http://www.w3.org/2000/svg", "foreignObject")).attr({
            height: '20',
            width: '20'
        })[0];

        this._reactDomElement = ReactDOM.render(this._reactElement, divContainer);
        this._reactDomElement.addUpdateHook(() => {
            let domNode = ReactDOM.findDOMNode(this._reactDomElement);
            let height = $(domNode).outerHeight();
            let width = $(domNode).outerWidth();

            $(divContainer).attr({
                height: height,
                width: width
            });
        });
        return divContainer;
    }

}