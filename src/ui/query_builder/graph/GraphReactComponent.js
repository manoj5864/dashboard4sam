export class GraphReactComponent extends React.Component {

    componentDidUpdate() {
        this._updateHooks.forEach(it=>it());
    }

    addUpdateHook(cb) {
        this._updateHooks.push(cb);
    }

    constructor() {
        super();
        this._updateHooks = [];
    }

}