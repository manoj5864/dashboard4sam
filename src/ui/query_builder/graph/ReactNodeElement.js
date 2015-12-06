import {NodeElement} from './NodeElement'

let $ = window.$
let ReactDOM = window.ReactDOM

export class ReactNodeElement extends NodeElement {

    constructor(reactElement, ...args) {
        super(args)
        this._reactElement = reactElement
    }

    _applyReactElement(reactElement) {
        this._reactElement = reactElement
    }

    _customRenderer() {
        let divContainer = $(document.createElementNS("http://www.w3.org/2000/svg", "foreignObject")).attr({
            height: '20',
            width: '20'
        })[0]
        ReactDOM.render(this._reactElement, divContainer)
        return divContainer
    }

}