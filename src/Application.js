import {mixin} from './util/mixin'
import {TLoggable} from './util/logging/TLoggable'
import {Page} from './ui/main/Page'
import {SocioCortexApi} from './service/api/SocioCortexApi'
import {graphql} from 'graphql'


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

    _handleHashChange(hash) {
        this.info(`Dealing with hash change ${hash}`)
    }

    init() {
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


export class ApplicationContext {

    constructor() {
        this._managerRegistry = {}
    }

    get pageManager() {
        return this._managerRegistry.pageManager
    }

    get socioCortexManager() {
        return this._managerRegistry.cortexManager
    }

    start() {
        //this.info("Starting up application...")
        // Initialize page
        ReactDOM.render(<Page />, $('body')[0])

        // Register manager
        this._managerRegistry.pageManager = new PageManager()
        this._managerRegistry.cortexManager = new SocioCortexManager()
    }
}

let applicationInstance = new ApplicationContext()
export {applicationInstance as app}