import 'babel-polyfill'

class RequestHelper {

    static get(url) {

    }

    static post(url) {

    }

}

class SocioCortexWorkspace {

    constructor(cortexClient, workspaceId) {
        if (cortexClient instanceof SocioCortexApi) throw new Error('Cortex client must be specified')
        if (workspaceId instanceof string) throw new Error('Workspace ID is required')
        this._cortexClient = cortexClient
        this._workspaceId = workspaceId
    }

    _buildUrl(appendix) {
        return `/workspaces/${this._workspaceId}/${appendix}`
    }

    async getEntities() {

    }

    async getEntityTypes() {

    }

    async executeMxlQuery(attributes, metaAttributes, mxlBody, showRichTextContent = false) {

    }
}

export class SocioCortexApi {

    constructo() {

    }

    static

    async getWorkspace(id) {

    }
}