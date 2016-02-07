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

    _getPredefinedQueries() {
        return [
            new Query(
                'DecisionReqGoal',
                'Which decision came from which requirement in order to achieve which goal?',
                'eyJzdXJmYWNlU3RhdGUiOnsiY2FtZXJhU3RhdGUiOnt9LCJ6b29tIjowfSwiZWxlbWVudHMiOlt7ImlkIjoiZTllYmVmZjAtY2RkNS0xMWU1LTk1MmUtN2RkMTMwZDc0OTk4IiwidHlwZSI6IlF1ZXJ5QnVpbGRlck5vZGVFbGVtZW50IiwieCI6ODEsInkiOjMwNSwiY29sb3IiOiIjZmYwMDAwIiwiZ3JvdXBpbmciOiJuYW1lIiwiZmlsdGVycyI6W10sImRhdGEiOnsiaWQiOiIxMWI5eWQ0MWU5MzJiIiwibmFtZSI6IkRlY2lzaW9uIn19LHsiaWQiOiJlYzc2MWQ0MC1jZGQ1LTExZTUtOTUyZS03ZGQxMzBkNzQ5OTgiLCJ0eXBlIjoiUXVlcnlCdWlsZGVyTm9kZUVsZW1lbnQiLCJ4IjozNzAsInkiOjIwMywiY29sb3IiOiIjMDAwMGZmIiwiZ3JvdXBpbmciOiJuYW1lIiwiZmlsdGVycyI6W10sImRhdGEiOnsiaWQiOiIxb3hocGhvNjVmMXR1IiwibmFtZSI6IlJlcXVpcmVtZW50In19LHsiaWQiOiJlZjhjMGZkMC1jZGQ1LTExZTUtOTUyZS03ZGQxMzBkNzQ5OTgiLCJ0eXBlIjoiUXVlcnlCdWlsZGVyTm9kZUVsZW1lbnQiLCJ4Ijo2NTEsInkiOjEyMCwiY29sb3IiOiIjMDA4MDQwIiwiZ3JvdXBpbmciOiJuYW1lIiwiZmlsdGVycyI6W10sImRhdGEiOnsiaWQiOiJpYWUxOWV3cWNpZ2siLCJuYW1lIjoiUXVhbGl0eSBHb2FsIn19XSwiY29ubmVjdGlvbnMiOlt7ImZyb20iOiJlOWViZWZmMC1jZGQ1LTExZTUtOTUyZS03ZGQxMzBkNzQ5OTgiLCJ0byI6ImVjNzYxZDQwLWNkZDUtMTFlNS05NTJlLTdkZDEzMGQ3NDk5OCJ9LHsiZnJvbSI6ImVjNzYxZDQwLWNkZDUtMTFlNS05NTJlLTdkZDEzMGQ3NDk5OCIsInRvIjoiZWY4YzBmZDAtY2RkNS0xMWU1LTk1MmUtN2RkMTMwZDc0OTk4In1dfQ=='
            )
        ]
    }

    constructor({persistenceModule = QueryStorageBrowserPersistence} = {}) {
        this._config = {
            persistenceModule: persistenceModule
        };
        this._persistenceModule = new this._config.persistenceModule();
        let entries = this._persistenceModule.load();
        this._queryStorage = new Map(entries);
        this._getPredefinedQueries().forEach(q => this.addQuery(q));
    }

}