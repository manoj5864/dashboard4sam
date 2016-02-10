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
                'GoalReqDecision',
                'Which decision came from which requirement in order to achieve which goal?',
                'eyJzdXJmYWNlU3RhdGUiOnsiY2FtZXJhU3RhdGUiOnt9LCJ6b29tIjowfSwiZWxlbWVudHMiOlt7ImlkIjoiYmI5NTU2NjAtZDAyMi0xMWU1LTkwOGMtMTcxMDQ1OTI0MmM5IiwidHlwZSI6IlF1ZXJ5QnVpbGRlck5vZGVFbGVtZW50IiwieCI6NDMyLjAwMDAzMDUxNzU3ODEsInkiOjE1MCwiY29sb3IiOiIjMDAwMGZmIiwiZ3JvdXBpbmciOiIiLCJmaWx0ZXJzIjpbXSwiZGF0YSI6eyJpZCI6IjFveGhwaG82NWYxdHUiLCJuYW1lIjoiUmVxdWlyZW1lbnQifX0seyJpZCI6ImJjMjdmOTcwLWQwMjItMTFlNS05MDhjLTE3MTA0NTkyNDJjOSIsInR5cGUiOiJRdWVyeUJ1aWxkZXJOb2RlRWxlbWVudCIsIngiOjY3OS4wMDAwMzA1MTc1NzgxLCJ5IjoxMDIsImNvbG9yIjoiI2ZmMDAwMCIsImdyb3VwaW5nIjoiIiwiZmlsdGVycyI6W10sImRhdGEiOnsiaWQiOiIxMWI5eWQ0MWU5MzJiIiwibmFtZSI6IkRlY2lzaW9uIn19LHsiaWQiOiJiZDFkNTVmMC1kMDIyLTExZTUtOTA4Yy0xNzEwNDU5MjQyYzkiLCJ0eXBlIjoiUXVlcnlCdWlsZGVyTm9kZUVsZW1lbnQiLCJ4IjoxODcsInkiOjIwNCwiY29sb3IiOiIjMDA4MDQwIiwiZ3JvdXBpbmciOiJuYW1lIiwiZmlsdGVycyI6W10sImRhdGEiOnsiaWQiOiJpYWUxOWV3cWNpZ2siLCJuYW1lIjoiUXVhbGl0eSBHb2FsIn19XSwiY29ubmVjdGlvbnMiOlt7ImZyb20iOiJiYjk1NTY2MC1kMDIyLTExZTUtOTA4Yy0xNzEwNDU5MjQyYzkiLCJ0byI6ImJjMjdmOTcwLWQwMjItMTFlNS05MDhjLTE3MTA0NTkyNDJjOSJ9LHsiZnJvbSI6ImJkMWQ1NWYwLWQwMjItMTFlNS05MDhjLTE3MTA0NTkyNDJjOSIsInRvIjoiYmI5NTU2NjAtZDAyMi0xMWU1LTkwOGMtMTcxMDQ1OTI0MmM5In1dfQ=='
            ),
            new Query(
                'AttrGoalReqDecArch',
                'Which architectural element came from which decision to implement which requirement to achieve which goal that is associated with which quality attribute?',
                'eyJzdXJmYWNlU3RhdGUiOnsiY2FtZXJhU3RhdGUiOnt9LCJ6b29tIjowfSwiZWxlbWVudHMiOlt7ImlkIjoiMTliZmVmNzAtZDAyMy0xMWU1LTlhODYtMjFkN2FjNDdiYTRkIiwidHlwZSI6IlF1ZXJ5QnVpbGRlck5vZGVFbGVtZW50IiwieCI6OTU1LjAwMDAzMDUxNzU3ODEsInkiOjE4MywiY29sb3IiOiIjZmY4MGMwIiwiZ3JvdXBpbmciOiJuYW1lIiwiZmlsdGVycyI6W10sImRhdGEiOnsiaWQiOiIxYWwyOGU5eG41MzB0IiwibmFtZSI6IkFyY2hpdGVjdHVyYWwgRWxlbWVudCJ9fSx7ImlkIjoiMWE2YmJmZDAtZDAyMy0xMWU1LTlhODYtMjFkN2FjNDdiYTRkIiwidHlwZSI6IlF1ZXJ5QnVpbGRlck5vZGVFbGVtZW50IiwieCI6NzMzLjAwMDAzMDUxNzU3ODEsInkiOjIxMywiY29sb3IiOiIjZmYwMDAwIiwiZ3JvdXBpbmciOiJuYW1lIiwiZmlsdGVycyI6W10sImRhdGEiOnsiaWQiOiIxMWI5eWQ0MWU5MzJiIiwibmFtZSI6IkRlY2lzaW9uIn19LHsiaWQiOiIxYmEwNmY0MC1kMDIzLTExZTUtOWE4Ni0yMWQ3YWM0N2JhNGQiLCJ0eXBlIjoiUXVlcnlCdWlsZGVyTm9kZUVsZW1lbnQiLCJ4Ijo1MTMuMDAwMDMwNTE3NTc4MSwieSI6MjUwLCJjb2xvciI6IiMwMDAwZmYiLCJncm91cGluZyI6Im5hbWUiLCJmaWx0ZXJzIjpbXSwiZGF0YSI6eyJpZCI6IjFveGhwaG82NWYxdHUiLCJuYW1lIjoiUmVxdWlyZW1lbnQifX0seyJpZCI6IjFjMDg3ZmUwLWQwMjMtMTFlNS05YTg2LTIxZDdhYzQ3YmE0ZCIsInR5cGUiOiJRdWVyeUJ1aWxkZXJOb2RlRWxlbWVudCIsIngiOjc4LCJ5IjozMzAsImNvbG9yIjoiIzQwMDA0MCIsImdyb3VwaW5nIjoibmFtZSIsImZpbHRlcnMiOltdLCJkYXRhIjp7ImlkIjoiMXNhem82NTlwMjlwcCIsIm5hbWUiOiJRdWFsaXR5IGF0dHJpYnV0ZSJ9fSx7ImlkIjoiMWM2MmZiZjAtZDAyMy0xMWU1LTlhODYtMjFkN2FjNDdiYTRkIiwidHlwZSI6IlF1ZXJ5QnVpbGRlck5vZGVFbGVtZW50IiwieCI6Mjk1LCJ5IjoyODYsImNvbG9yIjoiIzAwODA0MCIsImdyb3VwaW5nIjoibmFtZSIsImZpbHRlcnMiOltdLCJkYXRhIjp7ImlkIjoiaWFlMTlld3FjaWdrIiwibmFtZSI6IlF1YWxpdHkgR29hbCJ9fV0sImNvbm5lY3Rpb25zIjpbeyJmcm9tIjoiMWE2YmJmZDAtZDAyMy0xMWU1LTlhODYtMjFkN2FjNDdiYTRkIiwidG8iOiIxOWJmZWY3MC1kMDIzLTExZTUtOWE4Ni0yMWQ3YWM0N2JhNGQifSx7ImZyb20iOiIxYmEwNmY0MC1kMDIzLTExZTUtOWE4Ni0yMWQ3YWM0N2JhNGQiLCJ0byI6IjFhNmJiZmQwLWQwMjMtMTFlNS05YTg2LTIxZDdhYzQ3YmE0ZCJ9LHsiZnJvbSI6IjFjMDg3ZmUwLWQwMjMtMTFlNS05YTg2LTIxZDdhYzQ3YmE0ZCIsInRvIjoiMWM2MmZiZjAtZDAyMy0xMWU1LTlhODYtMjFkN2FjNDdiYTRkIn0seyJmcm9tIjoiMWM2MmZiZjAtZDAyMy0xMWU1LTlhODYtMjFkN2FjNDdiYTRkIiwidG8iOiIxYmEwNmY0MC1kMDIzLTExZTUtOWE4Ni0yMWQ3YWM0N2JhNGQifV19'
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