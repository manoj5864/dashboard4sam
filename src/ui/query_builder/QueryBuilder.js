import {mixin} from '../../util/mixin'
import {TLoggable} from '../../util/logging/TLoggable'
import {ContentPage} from '../main/Content'
import {app} from  '../../Application'
import 'babel-polyfill'
import {GraphSurfaceManager} from './graph/GraphSurfaceManager'
import {QueryBuilderNodeElement} from './interface/QueryBuilderNodeElement'
import {default as _} from 'lodash'
import {QueryUtils} from '../../model/QueryUtils'

//http://bl.ocks.org/cjrd/6863459

export class QueryBuilder extends mixin(ContentPage, TLoggable) {

    constructor() {
        super();
        this.state = {
            entityList: []
        }
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
        this._surfaceManager = new GraphSurfaceManager(this._svgElement);

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
        let unconnectedNodes = this._surfaceManager.state().unconnnectedNodes();
        if (unconnectedNodes.length > 0) {
            this.warn(`There may be no unconnected nodes when triggering computation`)
            return;
        }

        // Construct the query
        let nodes = this._surfaceManager.state().firstNodes();
        if (nodes.length != 1) {
            this.warn(`Multiple start paths were discovered`);
            return;
        }

        let firstElement = nodes[0];
        let cursor = this._surfaceManager.state().path(firstElement);

        let lastElement = firstElement;
        for (let nextElement of cursor) {
            let relationships = await QueryUtils.doTwoEntityTypesRelate(lastElement.entityType.id, nextElement.entityType.id);

            // Forward relationships
            let relationshipNames = relationships
                .filter(it=>it.id==lastElement.entityType.id)
                .map(it=>it.relations)
                .reduce((a,b)=> a.concat(b))
                .map(it=>it.name);

            let query = `
                query RelatedElements {
                    entity(typeId: "${firstElement.entityType.id}") {
                        links(names: ${JSON.stringify(relationshipNames)}) {
                            id
                            name
                            value {
                                id
                                name
                            }
                        }
                    }
                }
            `
            let queryResult = await app.socioCortexManager.executeQuery(query);
            console.log(queryResult);

            // Reverse relationships

            lastElement = nextElement;
        }


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
                        </ul>
                    </div>
                </div>
                <svg width="100%" height="100%" xmlns="http://www.w3.org/svg/2000" ref={(c) => this._svgElement = c}>
                </svg>
            </div>
        )
    }

}