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
import {LoadingAnimation} from '../main/util/LoadingAnimation'
import {QueryStorageManager} from '../../service/storage/QueryStorageManager'
import {Modal} from '../main/widgets/Modal'

//http://bl.ocks.org/cjrd/6863459

export class QueryBuilder extends mixin(ContentPage, TLoggable) {

    constructor() {
        super();
        this.state = {
            entityList: [],
            sankeyNodes: null
        };
        this._queryBuilderElement = (
            <svg width="100%" height="100%" xmlns="http://www.w3.org/svg/2000" ref={(c) => this._svgElement = c}>
            </svg>
        );
        this._storageManager = new QueryStorageManager();
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
        let activeAninmation = null;
        if (this._viewHost) activeAninmation = LoadingAnimation.start(this._viewHost);
        let res = await this._surfaceManager.computeSankey();

        if (activeAninmation) activeAninmation.stop();
        this.setState({
            sankeyNodes: res
        })
    }

    _logState() {
        console.log(this._surfaceManager.serialize().toJSON());
    }

    async importState(jsonConfig) {
        await this._surfaceManager.fromJSON(jsonConfig, QueryBuilderNodeElement);
    }

    async _loadQuery(name) {
        const query = this._storageManager.getQueryByName(name);
        if (query) {
            window.location.hash = `#/query/${query.query}`;
        }
    }

    _deleteQuery(name) {
        this._storageManager.removeQueryByName(name);
        this.forceUpdate();
    }

    render() {
        let createLink = () => {
            const query = btoa(this._surfaceManager.serialize().toJSON());
            const link = `${window.location.origin}${window.location.pathname}#/query/${query}`;
            Modal.show(
                'Share Query',
                [
                    <h1>The Link for your current query</h1>,
                    <a href={link}>{link}</a>
                ]
            )
        };

        let saveQuery = () => {
            const name = prompt('Name of the query?');
            if (name) {
                const json = this._surfaceManager.serialize().toJSON();
                const base = btoa(json);
                this._storageManager.addQueryByName(name, '', base);
                this.forceUpdate();
            }
        };
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
                                    <li><a onClick={createLink}>Share Query</a></li>
                                    <li><a onClick={saveQuery}>Save</a></li>
                                    <li className="has-submenu right">
                                        <a onClick={() => {const str = prompt("Enter JSON config"); str && this.importState(str)}}>Load</a>
                                        <ul className="submenu">
                                            {this._storageManager.getQueries().map(entry => {
                                                return (
                                                    <li>
                                                        <a onClick={this._loadQuery.bind(this, entry[0])}>
                                                            {entry[0]}
                                                        </a>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </li>
                                    <li className="has-submenu right">
                                        <a>Delete</a>
                                        <ul className="submenu">
                                            {this._storageManager.getQueries().map(entry => {
                                                return (
                                                    <li>
                                                        <a onClick={this._deleteQuery.bind(this, entry[0])}>
                                                            {entry[0]}
                                                        </a>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
                <div>
                    <div ref={c => this._viewHost = c}></div>
                    {this.state.sankeyNodes ? <SankeyGraphPage nodes={this.state.sankeyNodes} ref={c=>{this._sankeyGraphPage = c}} /> : this._queryBuilderElement}
                </div>
            </div>
        )
    }

}