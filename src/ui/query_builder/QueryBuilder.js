import {mixin} from '../../util/mixin'
import {TLoggable} from '../../util/logging/TLoggable'
import {ContentPage} from '../main/Content'
import {app} from  '../../Application'
import 'babel-polyfill'
import {GraphSurfaceManager} from './graph/GraphSurfaceManager'
import {QueryBuilderNodeElement} from './interface/QueryBuilderNodeElement'
import {default as _} from 'lodash'
import {QueryUtils} from '../../model/QueryUtils'

let React = window.React
let d3 = window.d3
let $ = window.$

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

            let fromEntity = from.entity;
            let toEntity = to.entity;

            let res = await QueryUtils.doTwoEntitiesRelate(fromEntity.id, toEntity.id);
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

                        </ul>
                    </div>
                </div>
                <svg width="100%" height="100%" xmlns="http://www.w3.org/svg/2000" ref={(c) => this._svgElement = c}>
                </svg>
            </div>
        )
    }

}