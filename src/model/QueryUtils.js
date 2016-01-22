import {app} from  '../Application'

export class QueryUtils {

    static async amountOfEntities({
        type = null,
        attributeFilter = null
    }) {
        let objects = await app.socioCortexManager.executeQuery(`
            query EntitiesForType {
                entity(type: "${type}") {
                    id
                }
            }
        `);
        return objects.data.entity.length;
    }

}