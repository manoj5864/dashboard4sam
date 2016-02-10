import {mixin} from './util/mixin'
import {TLoggable} from './util/logging/TLoggable'
import {Enum} from './util/enum'
import {SocioCortexApi} from './service/api/SocioCortexApi'
import {graphql} from 'graphql'
import {schema} from './model/CortexSchema'
import {default as store} from 'store'
import {LoginWindow} from './ui/main/windows/LoginWindow'
import {PageManager} from './PageManager'


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

    logout() {
        store.remove('login');
    }

    async getUserDetails() {
        return (await this._getClient()).getUser();
    }

    async executeQuery(query, args = null) {
        this.debug(`Executing query: ${query}`);
        try {
            let res = await graphql(schema(await this._getWorkspace()), query, args);

            if (res.errors) {
                this.error(`Error occured on query: ${query}`);
                console.log(res);
            }
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