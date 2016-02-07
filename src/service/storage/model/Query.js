export class Query {

    get name() {
        return this._name;
    }

    get description() {
        return this._description;
    }

    get query() {
        return this._query;
    }

    toJSON() {
        return {
            name: this._name,
            description: this._description,
            query: this._query
        }
    }

    constructor(name, description, query) {
        this._name = name;
        this._description = description;
        this._query = query;
    }
}