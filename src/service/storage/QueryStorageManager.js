import {Query} from './model/Query'
import {default as store} from 'store'

class QueryStorageBrowserPersistence extends QueryStorageManagerPersistence {
    save() {

    }
}

class SocioCortexPersistence extends QueryStorageManagerPersistence {
    save() {

    }
}

class QueryStorageManagerPersistence {
    save() {
    }

    load() {
    }
}

export class QueryStorageManager {

    addQuery(query) {
        if (query instanceof Query) {
            let queryName = query.name;
            this._queryStorage.set(queryName, query);
            this._persist();
        } else throw new Error('Query must be typed');
    }

    addQueryByName(name, description, query) {
        let queryObject = new Query(name, description, query);
        this._queryStorage.set(name, query);
        this._persist();
    }

    _persist() {
        // Initialize persistence module
        if (!this._persistenceModule) this._persistenceModule = new this._config.persistenceModule();
        this._config.persistenceModule
    }

    constructor({persistenceModule = QueryStorageBrowserPersistence} = {}) {
        this._queryStorage = new Map();
        this._config = {
            persistenceModule: persistenceModule
        }
    }

}