import {mixin} from './util/mixin'
import {TLoggable} from './util/logging/TLoggable'
import {Page} from './ui/main/Page'
import {SocioCortexApi} from './service/api/SocioCortexApi'
import {graphql} from 'graphql'
import {schema} from './model/CortexSchema'


let $ = window.$
let React = window.React
let ReactDOM = window.ReactDOM

class PageManager extends mixin(null, TLoggable) {
    get currentHash() {
        return window.location.hash
    }

    set currentHash(value) {
        this._switchPage(value)
    }

    _switchPage() {
        window.location.hash = value
    }

    switchPage(page) {
        this._pageElement.contentSpot.currentPage = page
    }

    _handleHashChange(hash) {
        this.info(`Dealing with hash change ${hash}`)
    }

    init() {
        this._pageElement = ReactDOM.render(<Page />, $('#wrapper')[0])

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

    executeQuery(query) {
        this.debug(`Executing query: ${query}`)
        return graphql(schema(this._workspace), query)
    }

    init() {
        this._cortexClient = new SocioCortexApi(
            'christopher@janietz.eu',
            '105u60id1kf1w',
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