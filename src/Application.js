import {mixin} from './util/mixin'
import {TLoggable} from './util/logging/TLoggable'
import {Enum} from './util/enum'
import {Page} from './ui/main/Page'
import {SocioCortexApi} from './service/api/SocioCortexApi'
import {graphql} from 'graphql'
import {schema} from './model/CortexSchema'

// Pages
import {SankeyGraphPage} from './ui/graphs/sankey/SankeyGraph'
import {CompletenessStatsView} from './ui/graphs/CompletenessStats'
import {QueryBuilder} from './ui/query_builder/QueryBuilder'


let $ = window.$
let React = window.React
let ReactDOM = window.ReactDOM

export const StateDescriptors = Enum(
    "PAGE_VISIBLE",
    "PAGE_STATE"
)

class PageState {

    constructor() {
        this[StateDescriptors.PAGE_VISIBLE] = ''

    }

    set visiblePage(value) {
        this[StateDescriptors.PAGE_VISIBLE] = value
    }

    toJSON() {
        let json = {}
        json[StateDescriptors.PAGE_VISIBLE] = this[StateDescriptors.PAGE_VISIBLE]

        return JSON.stringify(json)
    }

}

class PageManager extends mixin(null, TLoggable) {
    get currentHash() {
        return window.location.hash
    }

    set currentHash(value) {
        window.location.hash = value
    }

    switchPage(page) {
        this._pageState.visiblePage = page.name
        this._pageElement.contentSpot.currentPage = page
        this._updateHash()
    }

    _handleHashChange(hash) {
        this.info(`Dealing with hash change ${hash}`)
    }

    _updateHash() {
        this.currentHash = window.btoa(this._pageState.toJSON())
    }

    init() {
        // Check current hash
        let hash = this.currentHash
        //window.atob(hash)

        this._pageState = new PageState()

        this._pageElement = ReactDOM.render(<Page />, $('#wrapper')[0])

        // Add pages
        this._pageElement.menuSpot.addItem('Query Builder', () => { this.switchPage(<QueryBuilder />)  })
        this._pageElement.menuSpot.addItem('Sankey Diagram', () => { this.switchPage(<SankeyGraphPage />)  })
        this._pageElement.menuSpot.addItem('Treemap Diagram', () => { this.info("Testing") })
        this._pageElement.menuSpot.addItem('Statistics', () => { this.switchPage(<CompletenessStatsView />) })

        $(document).ready(() => {
            $(window).bind('hashchange', () => {
                this._handleHashChange(this.currentHash)
            })
        })
    }

    constructor() {
        super()
        this.init()
    }

}

class SocioCortexManager extends mixin(null, TLoggable) {
    constructor() {
        super()
        this.init()
    }

    get workspace() {
        return this._workspace
    }

    get client() {
        return this._cortexClient
    }

    async executeQuery(query) {
        this.debug(`Executing query: ${query}`);
        try {
            return await graphql(schema(this._workspace), query);
        } catch (ex) {
            this.error("Error occured in GraphQL execution");
            console.log(ex);
        }
    }

    init() {
        this._cortexClient = new SocioCortexApi(
            'sayan.mnit@gmail.com',
            '16rz3ulpit60k',
            'http://vmmatthes21.informatik.tu-muenchen.de/api/v1'
        )
        this._workspace = this._cortexClient.getWorkspace('16eh5j1cwrrny')
    }
}


export class ApplicationContext extends mixin(null, TLoggable) {

    constructor() {
        super()
        this._managerRegistry = {}
    }

    get pageManager() {
        return this._managerRegistry.pageManager
    }

    get socioCortexManager() {
        return this._managerRegistry.cortexManager
    }

    start() {
        // Register manager
        this.info('Starting application context...')

        this._managerRegistry.pageManager = new PageManager()
        this._managerRegistry.cortexManager = new SocioCortexManager()
    }
}

let applicationInstance = new ApplicationContext()
export {applicationInstance as app}