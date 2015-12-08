import {SocioCortexApi} from '../api/SocioCortexApi'

export class ApiTests {

    static _buildClient() {
        return new SocioCortexApi(
            'christopher@janietz.eu',
            'XXX',
            'http://vmmatthes21.informatik.tu-muenchen.de/api/v1'
        )
    }

    static _getWorkspaceId() {
        return '16eh5j1cwrrny'
    }

    static async testGetEntityTypes() {
        let workspace = ApiTests._buildClient().getWorkspace(ApiTests._getWorkspaceId())
        try {
            let entityTypes = await workspace.getEntityTypes()
            let entityTypeNames = entityTypes.map(x => x.name)
            console.log(entityTypeNames)
        } catch(ex) {
        }
    }

    static async testGetEntities() {
        let workspace = ApiTests._buildClient().getWorkspace(ApiTests._getWorkspaceId())
        try {
            let entities = await workspace.getEntities()
            console.log(entities)
        } catch (ex) {
        }
    }

}
