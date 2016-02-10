import 'babel-polyfill'
import {default as request} from 'request'
import {GraphQLObjectType} from 'graphql'
import {StaticLogger} from '../../util/logging/TLoggable'

class RequestHelper {

    static _buildRequest(req) {
        return new Promise((resolve, reject) => {
            request(req, (err, resp, body) => {
                if (err || (resp.statusCode > 400)) reject(err); else resolve(body);
            })
        })
    }

    static get(url, auth) {
        StaticLogger.debug(`Requesting url: ${url}`, 'Web Requests')
        // Build the request object
        let req = {
            method: 'GET',
            url: url,
            json: true
        };
        if (auth) {
            if (!auth.username || !auth.password) throw new Error('Invalid authroization object specified');
            req.auth = auth
        }

        return RequestHelper._buildRequest(req);
    }

    static post(url, data) {
        req = {
            method: 'GET',
            url: url,
            json: true,
            body: data
        }
    }

}

class SocioCortexWorkspace {

    constructor(cortexClient, workspaceId) {
        if (!(cortexClient instanceof SocioCortexApi)) throw new Error('Cortex client must be specified')
        this._cortexClient = cortexClient
        this._workspaceId = workspaceId
    }

    _buildUrl(appendix) {
        return `/workspaces/${this._workspaceId}/${appendix}`
    }

    _processError(error) {
        console.log(error)
    }

    async getEntities(includeAttributes = true,
                      includeMetaAttributes = true,
                      includeContent = false,
                      includeTasks = false) {
        let attributes =
            (typeof(includeAttributes) === 'boolean' && includeAttributes)
            ? '*' : (typeof(includeAttributes) === 'string') ? includeAttributes : null
        let metaAttributes = (typeof(includeMetaAttributes) === 'boolean' && includeMetaAttributes)
            ? '*' : (typeof(includeMetaAttributes) === 'string') ? includeMetaAttributes : null

        let queryString = 'entities'
        let extraArguments = []
        if (attributes) {
            extraArguments.push('attributes=' + encodeURIComponent(attributes))
        }
        if (metaAttributes) {
            extraArguments.push('meta=' + encodeURIComponent(metaAttributes))
        }
        if (includeTasks) {
            extraArguments.push('tasks=true')
        }
        if (includeContent) {
            extraArguments.push('content=true')
        }
        if (extraArguments.length > 0) {
            queryString += '?' + extraArguments.join('&')
        }
        try{
            let entities = await this._cortexClient._makeRequest(this._buildUrl(queryString))
            return entities.map(x => new SocioCortexEntity(this._cortexClient, x))
        } catch (ex) { this._processError(ex) }
    }

    async getEntityTypes() {
        try {
            let entities = await this._cortexClient._makeRequest(this._buildUrl('entityTypes'))
            return entities.map(x => new SocioCortexEntitytype(this._cortexClient, x))
        } catch (ex) {
            this._processError(ex)
        }
    }

    async getUrl(url, type) {
        let object = await this._cortexClient._makeRequest(this._buildUrl(queryString));
        return new type(this._cortexClient, object);
    }

    async executeMxlQuery(attributes, metaAttributes, mxlBody, showRichTextContent = false) {

    }
}

export class SocioCortexEntity {
    constructor(client, json) {
        this._cortexClient = client
        this._json = json
    }

    get id() {
        return this._json.id
    }

    get name() {
        return this._json.name
    }

    get entityType() {
        return new SocioCortexEntitytype(this._cortexClient, this._json.entityType)
    }

    get attributes() {
        return this._json.attributes.map(x => new SocioCortexEntityAttribute(this,x, this._cortexClient))
    }

    _buildUrl(appendix) {
        return `/test`
    }

    toString() {
        return this.name;
    }
}

class SocioCortexEntityAttribute {

    constructor(parentEntity, json, client) {
        this._parent = parentEntity;
        this._json = json;
        this._cortexClient = client;
    }

    get id() {
        return this._json.id
    }

    get name() {
        return this._json.name
    }

    get value() {
        return this._json.values;
    }

    get attributeDefinition() {
        return new SocioCortexAttributeDefinition(this._json.attributeDefinition, this._cortexClient)
    }
}

class SocioCortexAttributeDefinition {
    constructor(json, client) {
        this._json = json;
        this._cortexClient = client;
    }

    get id() {
        return this._json.id
    }

    get name() {
        return this._json.name
    }

    get href() {
        return this._json.href
    }

    get details() {
        return this.get()
    }

    async get() {
        return new SocioCortexAttributeDefinitionDetails(await this._cortexClient._makeRequest(this.href))
    }
}

class SocioCortexAttributeDefinitionDetails {

    constructor(json) {
        this._json = json
    }

    get name() { return this._json.name }
    get id() {return this._json.id}
    get readOnly() {return this._json.readOnly}
    get multiplicity() {return this._json.multiplicity}
    get attributeType() {return this._json.attributeType}
    get options() {
        let object = {}
        Object.assign(object, this._json.options)
        if (object.entityType) object.entityType = new SocioCortexEntity(null, object.entityType)
        return object
    }
    get entityType() { return new SocioCortexEntity(null, this._json.entityType) }

}

class SocioCortexEntityTypeDetails {

    constructor(json, cortexClient) {
        this._json = json;
        this._cortexClient = cortexClient;
    }

    get processes() {
        return this._json.processes
    }

    get attributeDefinitions() {
        return this._json.attributeDefinitions.map((entry) => new SocioCortexAttributeDefinition(entry, this._cortexClient))
    }

    get versions() {
        return this._json.versions
    }

    get name() {
        return this._json.name
    }

    get namePlural() {
        return this._json.namePlural
    }

}

class SocioCortexEntitytype {
    constructor(cortexClient, json) {
        this._cortexClient = cortexClient;
        this._json = json;
    }

    get id() {
        return this._json.id
    }

    get name() {
        return this._json.name
    }

    get href() {
        return this._json.href
    }

    get details() {
        return this.get()
    }

    async get() {
        try {
            let json = await this._cortexClient._makeRequest(this.href);
            return new SocioCortexEntityTypeDetails(json, this._cortexClient);
        } catch (ex) {
        }
    }
}

class SocioCortexUser {

    get name() { return this._json.name; }
    get id() { return this._json.id; }
    get pictureUrl() { return this._client._buildUrl(`/users/${this.id}/picture`) }

    constructor(json, client) {
        this._json = json;
        this._client = client;
    }

}


export class SocioCortexApi {

    constructor(username, password, relative_url = "http://vmmatthes21.informatik.tu-muenchen.de/api/v1") {
        this._username = username;
        this._password = password;
        this._relative_url = relative_url;
        this._requestCache = new Map();
        this._activeRequests = {};
    }

    _buildUrl(urlPart) {
        return this._relative_url + urlPart;
    }

    async _makeRequest(url) {
        if (!url.match(/^http[s]?:\/\/.*/)) {
            url = this._relative_url + url
        }

        if (this._activeRequests[url]) {
            return (await this._activeRequests[url]);
        }

        if (this._requestCache.has(url)) {
            return this._requestCache.get(url);
        } else {
            this._activeRequests[url] = RequestHelper.get(
                url,
                {
                    username: this._username,
                    password: this._password
                }
            );
            let result = await this._activeRequests[url];
            this._activeRequests[url] = null;
            this._requestCache.set(url, result);
            return result;
        }

    }

    getWorkspace(id) {
        if (!id.match(/[\w]+/)) { throw new Error('Invalid workspace id provided') }
        return new SocioCortexWorkspace(this, id)
    }

    async testLogin() {
        try {
            await this.getUser();
            return true;
        }
        catch (err) {
            return false;
        }
    }

    async getUser(id = null) {
        const url = '/users/me';
        let userData = await this._makeRequest(url);
        return new SocioCortexUser(userData, this);
    }
}