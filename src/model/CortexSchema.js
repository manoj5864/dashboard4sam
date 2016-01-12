import {
    graphql,
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLList,
    GraphQLString,
    GraphQLInterfaceType
} from 'graphql';

let schemaFunc = (cortexWorkspace) => {

    let entityClassReference = new GraphQLObjectType({
        name: 'EntityClassReference',
        fields: () => {
            return {
                name: {
                    type: GraphQLString
                },
                entityType: {
                    description: 'Retrieve the related entity',
                    type: entityClass
                }
            }
        }
    })

    let entityTypeAttribute = new GraphQLObjectType({
        name: 'EntityTypeClassAttribute',
        fields: {
            name: {
                type: GraphQLString
            },
            type: {
                type: GraphQLString,
                resolve: (root) => root.attributeType
            }
        }
    })

    let entityClass = new GraphQLObjectType({
        name: 'EntityClass',
        fields: {
            id: {
                type: GraphQLString
            },
            name: {
                type: GraphQLString
            },
            attributes: {
                type: new GraphQLList(entityTypeAttribute),
                args: {
                  name: {
                      type: GraphQLString
                  }
                },
                resolve: async (root, {name}) => {
                    let attrDefs = (await root.details).attributeDefinitions
                    let output = []
                    for (let attr of attrDefs) {
                        // Continue if there is a name check and it does not match
                        if (name && !(attr.name.match(name))) continue
                        let details = await attr.details
                        output.push(details)
                    }
                    return output.filter((entry) => {
                        return (entry.attributeType != 'Link')
                    })
                }
            },
            referencedBy: {
                type: new GraphQLList(entityClassReference),
                resolve: async (root) => {
                    let attrDefs = (await root.details).attributeDefinitions
                    let output = []
                    for (let attr of attrDefs) {
                        let details = await attr.details
                        output.push(details)
                    }
                    return output.filter((entry) => {
                        return (entry.attributeType == 'Link')
                    }).map((entry) => {
                        return {
                            name: entry.name,
                            entity: entry.options.entityType
                        }
                    })
                }
            }
        }
    })
    let entityClassList = new GraphQLList(entityClass)

    let entity = new GraphQLObjectType({
        name: 'Entity',
        fields: {
            class: {
                type: entityClass,
                resolve: (root) => console.log(root)
            },
            id: {
                type: GraphQLString
            },
            name: {
                type: GraphQLString
            },
            relatedTo: {
                type: () => entityList,
                resolve: (root, {name}) => {

                }
            }
        }
    })
    let entityList = new GraphQLList(entity)



    let _entitySchema = new GraphQLSchema({
        query: new GraphQLObjectType({
            name: 'Query',
            fields: {
                entity: {
                    type: entityList,
                    args: {
                      id: {
                          description: 'ID of the entity to look for',
                          type: GraphQLString,
                          defaultValue: null
                      }
                    },
                    resolve: async (root, {id, type}) => {
                        // No restrictions were requested
                        if (!(id || type)) { return cortexWorkspace.getEntities() }
                        let entities = await cortexWorkspace.getEntities()
                        entities.filter((entity) => {

                            return false;
                        });
                    }
                },

                type: {
                    type: entityClassList,
                    args: {
                        id: {
                            description: 'ID of the entity class',
                            type: GraphQLString,
                            defaultValue: null
                        },
                        name: {
                            description: 'Name of the entity class',
                            type: GraphQLString,
                            defaultValue: null
                        }
                    },
                    resolve: async (root, {id, name}) => {
                        let types = await cortexWorkspace.getEntityTypes()
                        if (id) types = types.filter((it) => it.id == id)
                        if (name) types = types.filter((it) => id.name == name)
                        return types
                    }
                }
            }
        })
    })

    return _entitySchema
}
export {schemaFunc as schema}