import 'babel-polyfill'
import {default as request} from 'browser-request'
import {GraphQLObjectType} from 'graphql'

class RequestHelper {

    static _buildRequest(req) {
        return new Promise((resolve, reject) => {
            request(req, (err, resp, body) => {
                if (err) reject(err); else resolve(body);
            })
        })
    }

    static get(url, auth) {
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

    async executeMxlQuery(attributes, metaAttributes, mxlBody, showRichTextContent = false) {

    }
}

class SocioCortexEntity {
    constructor(client, json) {
        this._cortexClient = client
        this._json = json
    }

    get name() {
        return this._json.name
    }

    get entityType() {
        return new SocioCortexEntitytype(this._cortexClient, this._json.entityType)
    }

    get attributes() {
        return this._json.attributes.map(x => new SocioCortexEntityAttribute(this,x))
    }

    _buildUrl(appendix) {
        return `/test`
    }
}

class SocioCortexEntityAttribute {

    constructor(parentEntity, json) {
        this._parent = parentEntity
        this._json = json
    }

    get id() {
        return this._json.id
    }

    get name() {
        return this._json.name
    }

    get value() {
        let values = this._json.values
        if (values.length == 0) return null
        if (values.length != 1) return values
        return values[0]
    }

    get attributeDefinition() {
        return new SocioCortexAttributeDefinition(this._json.attributeDefinition)
    }
}

class SocioCortexAttributeDefinition {
    constructor(json) {
        this._json = json
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
        return new SocioCortexAttributeDefinition(await RequestHelper.get(this.href))
    }
}

class SocioCortexAttributeDefinitionDetails {

    constructor(json) {
        this._json = json
    }

    get id() {return this._json.id}
    get readOnly() {return this._json.readOnly}
    get multiplicity() {return this._json.multiplicity}
    get attributeType() {return this._json.attributeType}
    get options() {return this._json.options}

}

class SocioCortexEntityTypeDetails {

    constructor(json) {
        this._json = json
    }

    get processes() {
        return this._json.processes
    }

    get attributeDefinitions() {
        return this._json.attributeDefinitions
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
        this._cortexClient = cortexClient
        this._json = json
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
            json = await this._cortexClient._makeRequest(this.href)
            return new SocioCortexEntityTypeDetails(json)
        } catch (ex) {
        }
    }
}


export class SocioCortexApi {

    constructor(username, password, relative_url = "") {
        this._username = username
        this._password = password
        this._relative_url = relative_url
    }

    async _makeRequest(url) {
        url = this._relative_url + url
        return RequestHelper.get(
            url,
            {
                username: this._username,
                password: this._password
            }
        )
    }

    getWorkspace(id) {
        if (!id.match(/[\w]+/)) { throw new Error('Invalid workspace id provided') }
        return new SocioCortexWorkspace(this, id)
    }
}