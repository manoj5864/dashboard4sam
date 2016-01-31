import {app} from  '../Application'
import {default as _} from 'lodash'

export class QueryUtils {

    static async entities({
        type = null
    }) {
        let object = await app.socioCortexManager.executeQuery(`
            query EntitiesForType {
                entity(type: "${type}") {
                    id
                }
            }
        `);
        return object.data;
    }

    static async amountOfEntities(...args) {
        return (await QueryUtils.entities.apply(null, args)).entity.length;
    }

    static async doTwoEntityTypesRelate(id1, id2) {
        let idCollection = [id1, id2];
        let objects = await app.socioCortexManager.executeQuery(`
            query EntityTypeQuery {
                type(idList: ${JSON.stringify(idCollection)}) {
                    id
                    attributes(onlyLinks: true, includeLinks: true) {
                        id
                        name
                        entity {
                            id,
                            name
                        }
                    }
                }
            }
        `);
        let res = objects.data.type.map(typeSource => {
            let foundRelations = typeSource.attributes.filter(relation=>idCollection.indexOf(relation.entity.id) >= 0);
            let nonSelfRelations = foundRelations.filter(relation=>relation.entity.id != typeSource.id);
            return {
                id: typeSource.id,
                relations: nonSelfRelations
            };
        });

        if (!res.some(it=>it.relations.length > 0)) return false;
        else return res;

    }

    static async getElementsInRelationship(
        /*Source Type*/{typeIdSource = null} = {},
        /*Source Elements*/sourceElements = [],
        /*Target Type*/{typeIdTarget = null} = {}
    ) {
        // Retrieve relationship
        if (sourceElements.length == 0) throw new Error('No elements were provided')
        if ( !typeIdSource || typeIdTarget ) throw new Error('Type IDs must be present')
        let relationships = await QueryUtils.doTwoEntityTypesRelate(typeIdSource, typeIdTarget)

        if (!relationships) throw new Error('No relationships could be determined');

        // Normal relationships
        debugger;

        // Reverse relationships

    }

}