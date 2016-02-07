import {Query} from './model/Query'
import {default as store} from 'store'

class QueryStorageManagerPersistence {
    constructor() {
    }

    save(queries) {
        throw new Error("Abstract method!")
    }

    load() {
        throw new Error("Abstract method!")
    }
}

class QueryStorageBrowserPersistence extends QueryStorageManagerPersistence {
    constructor() {
        super();
    }

    save(queries) {
        store.set('queries', queries);
    }

    load() {
        return store.get('queries') || [];
    }
}

class SocioCortexPersistence extends QueryStorageManagerPersistence {
    constructor() {
        super();
    }

    save() {

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
        this.addQuery(queryObject);
    }

    removeQueryByName(name) {
        this._queryStorage.delete(name);
        this._persist();
    }

    getQueryByName(name) {
        return this._queryStorage.get(name);
    }

    getQueries() {
        return [...this._queryStorage.entries()];
    }

    _persist() {
        this._persistenceModule.save([...this._queryStorage.entries()]);
    }

    constructor({persistenceModule = QueryStorageBrowserPersistence} = {}) {
        this._config = {
            persistenceModule: persistenceModule
        };
        this._persistenceModule = new this._config.persistenceModule();
        let entries = this._persistenceModule.load();
        this._queryStorage = new Map(entries);
    }

}