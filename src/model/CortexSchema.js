import {
    graphql,
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLInputObjectType,
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
                args: {
                  name: {type: GraphQLString}
                },
                resolve: async (root, {name}) => {
                    // Get list of all attributes on this entity
                    let attrDefs = (await root.details).attributeDefinitions
                    // Collect relevant entries in output variable
                    let output = []
                    // Pull the exact definition of each attribute, otherwise
                    // we can't determine if it is a Link
                    for (let attr of attrDefs) {
                        let details = await attr.details
                        output.push(details)
                    }
                    // Now choose only attributes that qualify to be:
                    // 1. To be of type Link
                    // 2. Have a specific variable set, such as name
                    // 3. Map to entityClassReferency type
                    return output.filter((entry) => {
                        let res = (entry.attributeType == 'Link')

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
        fields:() => ({
            class: {
                type: entityClass,
                resolve: async (root) => {
                    let types = await cortexWorkspace.getEntityTypes()
                    if (id) types = types.filter((it) => it.id == root.id)
                    return types
                }
            },
            id: {
                type: GraphQLString
            },
            name: {
                type: GraphQLString
            },
            relatedTo: {
                type: new GraphQLList(entity),
                args: {
                    type: { type: GraphQLString }
                },
                resolve: async (root, {type}) => {
                    // Discover attribute
                    let query2 = `
                        query EntityTypeQuery {
                            type(name: "${type}") {
                                referencedBy {
                                    name
                                    entityType {
                                        name
                                    }
                                }
                            }
                        }
                    `
                    let resx = await graphql(schemaFunc(cortexWorkspace), query2);
                    debugger;

                    let entityId = root.id;
                    let query = `
                        query EntityRelationQuery {
                            entity(attributes: [{value: "${entityId}"}] ) {
                                id
                                name
                            }
                        }
                    `;
                    let res = await graphql(schemaFunc(cortexWorkspace), query);
                    return res.data.entity;
                }
            }
        })
    });
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
                      },
                      type: {
                          description: 'Type of the entity',
                          type: GraphQLString
                      },
                      attributes: {
                          type: new GraphQLList(new GraphQLInputObjectType({
                              name: 'EntityAttributeArgument',
                              fields: {
                                  name: { type: GraphQLString, defaultValue: null },
                                  value: { type: GraphQLString }
                              }
                          }))
                      }
                    },
                    resolve: async (root, {id, type, attributes}) => {
                        // No restrictions were requested
                        if (!(id || type || attributes)) { return cortexWorkspace.getEntities() }
                        let entities = await cortexWorkspace.getEntities();
                        return entities.filter((entity) => {
                            if (type && !(entity.entityType.name == type)) {return false;}
                            if (id && !(entity.id == id)) { return false; }
                            if (attributes) {
                                for (let a of attributes) {
                                    let isQualified = entity.attributes.some((attr) => {
                                        let val = (a.name && (attr.name == a.name)) ||
                                            ((attr.value instanceof Array) ? (attr.value.indexOf(a.value) >= 0) : attr.value == a.value);
                                        return val;
                                    });
                                    if (!isQualified)
                                        return false;
                                }
                            }
                            return true;
                        });
                    }
                },

                // Retrieves a specific type from the backend
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
