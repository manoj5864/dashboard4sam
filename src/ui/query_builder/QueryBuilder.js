import {mixin} from '../../util/mixin'
import {TLoggable} from '../../util/logging/TLoggable'
import {ContentPage} from '../main/Content'
import {app} from  '../../Application'
import 'babel-polyfill'
import {QueryBuilderSurfaceManager} from './interface/QueryBuilderSurfaceManager'
import {QueryBuilderNodeElement} from './interface/QueryBuilderNodeElement'
import {default as _} from 'lodash'
import {QueryUtils} from '../../model/QueryUtils'
import {SankeyGraphPage, SankeyNode} from '../graphs/sankey/SankeyGraphPage'

//http://bl.ocks.org/cjrd/6863459

export class QueryBuilder extends mixin(ContentPage, TLoggable) {

    constructor() {
        super();
        this.state = {
            entityList: [],
            activeView: null
        }
        this._queryBuilderElement = (
            <svg width="100%" height="100%" xmlns="http://www.w3.org/svg/2000" ref={(c) => this._svgElement = c}>
            </svg>
        )
    }

    get name() {
        return "Query Builder"
    }

    async _getEntities() {
        if (!this._entityCache) {
            this._entityCache = await app.socioCortexManager.executeQuery(`
                query EntityTypes {
                    type {
                        id
                        name
                    }
                }
            `);
        }
        return this._entityCache;

    }

    async componentDidMount() {
        this.debug('SVG element mounted, initializing D3 graph');
        this._surfaceManager = new QueryBuilderSurfaceManager(this._svgElement);

        // Request entities
        let entities = _.sortBy((await this._getEntities()).data.type, it=>it.name);
        this.setState({entityList: entities});

        // Register connection event
        /**
         * from: {QueryBuilderNodeElement}
         * to: {QueryBuilderNodeElement}
         */
        this._surfaceManager.registerConnectionEvent(async ({from, to}) => {

            let fromEntity = from.entityType;
            let toEntity = to.entityType;

            let res = await QueryUtils.doTwoEntityTypesRelate(fromEntity.id, toEntity.id);
            return res ? true : false;
        });
    }

    _addToSurface(entity) {
        let qb = new QueryBuilderNodeElement(entity);
        this._surfaceManager.addNode(qb);
    }

    _renderEntityList() {
        return this.state.entityList.map(it => {
           return (
               <li><a href="#" onClick={ev=>this._addToSurface(it)}>{it.name}</a></li>
           )
        });
    }

    async _handleSankeyClick() {
        // Prepare data

        let res = await this._surfaceManager.computeSankey();
/*
        let sankeySvg = (<SankeyGraphPage nodes={[...sankeyNodeMap.values()]} />);
        this.setState({
            activeView: sankeySvg
        });
        */
    }

    _logState() {
        console.log(this._surfaceManager.serialize().toJSON());
    }

    async _importState() {
        const configString = prompt("Enter JSON config");
        await this._surfaceManager.fromJSON(configString, QueryBuilderNodeElement);
    }

    render() {
        return (
            <div>
                <div className="navbar-custom">
                    <div className="container">
                        <ul className="navigation-menu">
                            <li className="has-submenu">
                                <a href="#">Add</a>
                                <ul className="submenu">
                                    {this._renderEntityList()}
                                </ul>
                            </li>
                            <li className="has-submenu">
                                <a href="#">Analytics</a>
                                <ul className="submenu">
                                    <li><a href="#" onClick={this._handleSankeyClick.bind(this)}>Sankey</a></li>
                                    <li><a href="#">Tree Explorer</a></li>
                                </ul>
                            </li>
                            <li className="has-submenu right">
                                <a href="#">Queries</a>
                                <ul className="submenu">
                                    <li><a href="#" onClick={this._logState.bind(this)}>Save</a></li>
                                    <li className="has-submenu right">
                                        <a href="#" onClick={this._importState.bind(this)}>Load</a>
                                        <ul className="submenu">
                                            <li><a href="#" onClick={this._logState.bind(this)}>Fuck</a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
                {this.state.activeView || this._queryBuilderElement}
            </div>
        )
    }

}