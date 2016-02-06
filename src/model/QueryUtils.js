import {app} from  '../Application'
import {default as _} from 'lodash'

function flatten(arr) {
    return arr.reduce(function (flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
}

function stringify(obj) {
    let json = JSON.stringify(obj);
    return json.replace(/\"([^(\")"]+)\":/g,"$1:");
}

export class QueryUtils {

    static async entities({
        type = null,
        typeId = null
    }, {attributeFilter = {} } = {}) {
        let queryExpression = [];
        if (type) {
            queryExpression.push(`type: "${type}"`)
        }
        if (typeId) {
            queryExpression.push(`typeId: "${typeId}"`)
        }

        // Apply attribute filters
        let attributeFilterKeys = Object.getOwnPropertyNames(attributeFilter);
        if (attributeFilterKeys.length > 0) {
            let attributeQueryObject = [];
            for (let filterKey of attributeFilterKeys) {
                let filterExpression = attributeFilter[filterKey];
                if (filterKey == 'name') {
                    queryExpression.push(`nameRegex: "${filterExpression}"`)
                    continue;
                }

                // Test exression
                new RegExp(filterExpression);

                attributeQueryObject.push({
                    name: filterKey,
                    regex: filterExpression
                })
            }
            queryExpression.push(`attributes: ${stringify(attributeQueryObject)}`);
        }

        let object = await app.socioCortexManager.executeQuery(`
            query EntitiesForType {
                entity(${queryExpression.join(',')}) {
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

    static async entitiesGroupedBy(typeId, attributeName) {
        let queryExpression = null;
        switch (attributeName) {
            case 'id':
                queryExpression = `
                    query EntityTypeQuery {
                        entity(typeId: "${typeId}") {
                            id
                        }
                    }
                `;
                break;
            case 'name':
                queryExpression = `
                    query EntityTypeQuery {
                        entity(typeId: "${typeId}") {
                            id
                            name
                        }
                    }
                `;
                break;
            default:
                queryExpression = `
                    query EntityTypeQuery {
                        entity(typeId: "${typeId}") {
                            id
                            attributes(names: ${JSON.stringify([attributeName])}) {
                                value
                            }
                        }
                    }
                `;
                break;
        }

        let objects = await app.socioCortexManager.executeQuery(queryExpression);

        let groupToItemMap = new Map();
        let idToGroups = objects.data.entity.map(it =>
        {
            let groups = null;
            switch (attributeName) {
                case 'id':
                    groups = [it.id];
                    break;
                case 'name':
                    groups = [it.name];
                    break;
                default:
                    groups = flatten(it.attributes.map(it=>it.value));
                    break;
            }
            return {
                id: it.id,
                groups: groups
            }
        });

        for (let item of idToGroups) {
            let itemId = item.id;
            for (let group of item.groups) {
                let groupSet = groupToItemMap.get(group) || new Set();
                groupSet.add(itemId);
                groupToItemMap.set(group, groupSet);
            }
        }
        return groupToItemMap;
    }

    static async getElementsInRelationship(
        /*Source Type*/{typeIdSource = null} = {},
        /*Source Elements*/sourceElements = [],
        /*Target Type*/{typeIdTarget = null} = {},
        /*Target Elements*/targetElements = []
    ) {
        // Retrieve relationship
        if (sourceElements.length == 0) throw new Error('No elements were provided');
        if ( !typeIdSource || !typeIdTarget ) throw new Error('Type IDs must be present');
        let relationships = await QueryUtils.doTwoEntityTypesRelate(typeIdSource, typeIdTarget);

        if (!relationships) throw new Error('No relationships could be determined');

        // Normal relationships
        let sourceRelations = relationships.find(it=>it.id==typeIdSource).relations.map(it=>it.name);
        let sourceElementIds = sourceElements.map(it=>it.id);
        let outputMap = new Map();
        if (sourceRelations.length > 0) {
            let query = `
            query SourceRelationQuery {
                entity(idList: ${JSON.stringify(sourceElementIds)}) {
                    id
                    links(names: ${JSON.stringify(sourceRelations)}) {
                        value {
                            id
                        }
                    }
                }
            }
        `
            let queryResult = await app.socioCortexManager.executeQuery(query);
            // Collect entries
            queryResult.data.entity.forEach(entity => {
                outputMap.set(entity.id, new Set(entity.links.map(link=>link.value.map(value=>value.id)).reduce([].concat)))
            })
        }

        // Reverse relationships
        let targetRelations = relationships.find(it=>it.id==typeIdTarget).relations.map(it=>it.name);
        if (targetRelations.length > 0) {
            let query = `
            query TargetRelationQuery {
                entity(typeId: "${typeIdTarget}") {
                    id
                    links(names: ${JSON.stringify(targetRelations)}) {
                        value {
                            id
                        }
                    }
                }
            }
            `
            let queryResult = await app.socioCortexManager.executeQuery(query);
            queryResult.data.entity.forEach(entity => {
                let currentEntity = entity.id;
                entity.links.forEach(link=> {
                    link.value.forEach(value=> {
                        if (sourceElementIds.indexOf(value.id) < 0) return; // Element not present in source elements
                        let appendList = outputMap.get(value.id) || new Set();
                        appendList.add(currentEntity);
                        outputMap.set(value.id, appendList);
                    })
                })
            })
        }
        return outputMap;
    }

}