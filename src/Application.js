import {mixin} from './util/mixin'
import {TLoggable} from './util/logging/TLoggable'
import {Enum} from './util/enum'
import {Page} from './ui/main/Page'
import {SocioCortexApi} from './service/api/SocioCortexApi'
import {graphql} from 'graphql'
import {schema} from './model/CortexSchema'
import {default as store} from 'store'
import {LoginWindow} from './ui/main/windows/LoginWindow'
import {QueryBuilderNodeElement} from './ui/query_builder/interface/QueryBuilderNodeElement'

// Pages
import {SankeyGraphPage} from './ui/graphs/sankey/SankeyGraphPage'
import {CompletenessStatsView} from './ui/graphs/CompletenessStats'
import {QueryBuilder} from './ui/query_builder/QueryBuilder'

export const StateDescriptors = Enum(
    "PAGE_VISIBLE",
    "PAGE_STATE"
);

class PageState {

    constructor() {
        this[StateDescriptors.PAGE_VISIBLE] = ''

    }

    set visiblePage(value) {
        this[StateDescriptors.PAGE_VISIBLE] = value
    }

    toJSON() {
        let json = {};
        json[StateDescriptors.PAGE_VISIBLE] = this[StateDescriptors.PAGE_VISIBLE];

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

    get queryBuilder() {
        return this._queryBuilder;
    }

    set queryBuilder(queryBuilder) {
        this._queryBuilder = queryBuilder;
    }

    switchPage(page) {
        this._pageState.visiblePage = page.name;
        this._pageElement.contentSpot.currentPage = page;
        this._updateHash()
    }

    _handleHashChange(hash) {
        this.info(`Dealing with hash change ${hash}`);
        let hashParts = hash.split('/');
        hashParts.shift(); //throw out '#'
        if (hashParts.length < 2) {
            this.error('Invalid hash format');
            return;
        }

        const mainRoute = hashParts.shift();
        switch (mainRoute) {
            case 'query':
                this.debug(`Interpreting query...`);
                this._loadQuery(hashParts[0]);
                break;
            default:
                this.error(`Invalid target ${mainRoute}`);
                break;
        }
    }

    _loadQuery(base64Query) {
        const state = atob(base64Query);
        if (this._queryBuilder) {
            this._queryBuilder.importState(state);
        }
    }

    _updateHash() {
        //this.currentHash = window.btoa(this._pageState.toJSON())
    }

    init() {
        // Check current hash
        let hash = this.currentHash;
        //window.atob(hash)

        this._pageState = new PageState();

        this._queryBuilder = null;
        this._pageElement = ReactDOM.render(<Page />, $('#wrapper')[0]);

        $(document).ready(() => {
            $(window).bind('hashchange', () => {
                this._handleHashChange(this.currentHash)
            });
            this._handleHashChange(this.currentHash)
        })
    }

    constructor() {
        super();
        this.init();
    }

}

class SocioCortexManager extends mixin(null, TLoggable) {
    constructor() {
        super();
    }

    async _getClient() {
        if (!this._cortexClient) {
            let login = await this._getUserLogin();
            this._cortexClient = new SocioCortexApi(
                login.username,
                login.password,
                'http://vmmatthes21.informatik.tu-muenchen.de/api/v1'
            );
        }
        return this._cortexClient;
    }

    async _getWorkspace() {
        return (await this._getClient()).getWorkspace('16eh5j1cwrrny');
    }

    async _getUserLogin() {
        if (this._loginData) {
            // Login is in progress
            if (this._loginData instanceof Promise) await this._loginData;
            return this._loginData;
        }

        if (store.enabled) {
            let storeLoginData = store.get('login');
            if (storeLoginData && storeLoginData.username && storeLoginData.password) {
                this._loginData = {
                    username: storeLoginData.username,
                    password: storeLoginData.password
                }
            }
        } else {
            this.warn(`Warning: Local Storage is not enabled`);
            this.warn(`It will not be possible to persist login data`);
        }

        if (!this._loginData) {
            // Show login screen
            this._loginData = LoginWindow.getLoginDetails();

            if (store.enabled) {
                store.set('login', await this._loginData);
            }
        }

        // Will return null if not set
        return this._loginData;
    }

    async getUserDetails() {
        return (await this._getClient()).getUser();
    }

    async executeQuery(query, args = null) {
        this.debug(`Executing query: ${query}`);
        try {
            let res = await graphql(schema(await this._getWorkspace()), query, args);
            console.log(res);
            return res;
        } catch (ex) {
            this.error("Error occured in GraphQL execution");
            console.log(ex);
        }
    }
}


export class ApplicationContext extends mixin(null, TLoggable) {

    constructor() {
        super();
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
        this.info('Starting application context...');

        this._managerRegistry.cortexManager = new SocioCortexManager();
        this._managerRegistry.pageManager = new PageManager();

    }
}

let applicationInstance = new ApplicationContext();
export {applicationInstance as app}