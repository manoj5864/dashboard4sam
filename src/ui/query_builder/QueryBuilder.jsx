import {mixin} from '../../util/mixin'
import {TLoggable} from '../../util/logging/TLoggable'
import {ContentPage} from '../main/Content'
import {app} from  '../../Application'
import 'babel-polyfill'
import {GraphSurfaceManager} from './graph/GraphSurfaceManager'
import {QueryBuilderNodeElement} from './interface/QueryBuilderNodeElement'

let React = window.React
let d3 = window.d3
let $ = window.$

//http://bl.ocks.org/cjrd/6863459

export class QueryBuilder extends mixin(ContentPage, TLoggable) {

    constructor() {
        super()
    }

    get name() {
        return "Query Builder"
    }

    componentDidMount() {
        this.debug('SVG element mounted, initializing D3 graph')
        let surfaceManager = new GraphSurfaceManager(this._svgElement)

        let getEntities = async () => {
            let entities = await app.socioCortexManager.executeQuery(`
                query EntityTypes {
                    type {
                        id
                        name
                    }
                }
            `)
            entities.data.type.forEach((el) => {
                let qb = new QueryBuilderNodeElement(el)
                surfaceManager.addNode(qb)
            })
        }
        getEntities()
    }

    render() {
        return (
            <svg width="100%" height="100%" xmlns="http://www.w3.org/svg/2000" ref={(c) => this._svgElement = c}>
            </svg>
        )
    }

}