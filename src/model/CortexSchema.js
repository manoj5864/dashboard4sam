import {
    graphql,
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLInputObjectType,
    GraphQLList,
    GraphQLString,
    GraphQLInterfaceType,
    GraphQLBoolean,
    GraphQLNonNull
} from 'graphql';
import {SocioCortexEntity} from '../service/api/SocioCortexApi'

class CortexSchema {

    constructor(cortexWorkspace) {

    }

}

let schemaFunc = (cortexWorkspace) => {

    let entityReference = new GraphQLObjectType({
        name: 'EntityReference',
        fields: () => ({
            id: { type: GraphQLString },
            name: { type: GraphQLString },
            entity: {
                type: entity,
                resolve: async (root) => {
                    let url = root.href;
                    return (await cortexWorkspace.getUrl(url, SocioCortexEntity));
                }
            }
        })
    });
    let entityReferenceList = new GraphQLList(entityReference);

    let genericEntityTypeAttribute = new GraphQLInterfaceType({
        name: 'GenericEntityTypeAttribute',
        fields: {
            id: {
                type: GraphQLString
            },
            name: {
                type: GraphQLString
            },
            type: {
                type: GraphQLString,
                resolve: (root) => root.attributeType
            }
        },
        resolveType: object => {
            return object.attributeType !== 'Link' ? entityTypeAttribute : entityLinkTypeAttribute
        }
    });

    let entityTypeAttribute = new GraphQLObjectType({
        name: 'EntityTypeAttribute',
        fields: {
            id: {
                type: GraphQLString
            },
            name: {
                type: GraphQLString
            },
            type: {
                type: GraphQLString,
                resolve: (root) => root.attributeType
            }
        },
        interfaces: [genericEntityTypeAttribute]
    });

    let entityLinkTypeAttribute = new GraphQLObjectType({
        name: 'EntityLinkTypeAttribute',
        fields: () => ({
            id: {
                type: GraphQLString
            },
            name: {
                type: GraphQLString
            },
            type: {
                type: GraphQLString,
                resolve: (root) => root.attributeType
            },
            entity: {
                type: entityClass,
                resolve: (root) => root.options.entityType
            }
        }),
        interfaces: [genericEntityTypeAttribute]
    });

    let entityClass = new GraphQLObjectType({
        name: 'EntityClass',
        fields: () => ({
            id: {
                type: GraphQLString
            },
            name: {
                type: GraphQLString
            },
            attributes: {
                type: new GraphQLList(entityLinkTypeAttribute),
                args: {
                    name: {
                      type: GraphQLString
                    },
                    includeLinks: {
                      type: GraphQLBoolean,
                      defaultValue: false
                    },
                    onlyLinks: {
                        type: GraphQLBoolean,
                        defaultValue: false
                    }
                },
                resolve: async (root, {name, includeLinks, onlyLinks}) => {
                    let attrDefs = (await root.details).attributeDefinitions;
                    let output = [];
                    for (let attr of attrDefs) {
                        // Continue if there is a name check and it does not match
                        if (name && !(attr.name.match(name))) continue;
                        let details = await attr.details;
                        output.push(details)
                    }
                    if (onlyLinks) output = output.filter(entry => entry.attributeType == 'Link');
                    if (!includeLinks) output =  output.filter((entry) => {
                        return (entry.attributeType != 'Link')
                    });
                    return output;
                }
            }
    })});
    let entityClassList = new GraphQLList(entityClass);

    let attribute = new GraphQLObjectType({
       name: 'Attribute',
        fields: () => ({
            id: {
                type: GraphQLString
            },
            name: {
                type: GraphQLString
            },
            value: {
                type: new GraphQLList(GraphQLString)
            }
        })
    });
    let attributeList = new GraphQLList(attribute);

    let attributeLink = new GraphQLObjectType({
        name: 'AttributeLink',
        fields: () => ({
            id: {
                type: GraphQLString
            },
            name: {
                type: GraphQLString
            },
            value: {
                type: entityReferenceList
            }
        })
    });
    let attributeLinkList = new GraphQLList(attributeLink);

    let entity = new GraphQLObjectType({
        name: 'Entity',
        fields:() => ({
            class: {
                type: entityClass,
                resolve: async (root) => {
                    let types = await cortexWorkspace.getEntityTypes();
                    return types.find(it => it.id === root.entityType.id)
                }
            },
            id: {
                type: GraphQLString
            },
            name: {
                type: GraphQLString
            },
            attributes: {
                type: attributeList,
                args: {
                    names: { type: new GraphQLList(GraphQLString) }
                },
                resolve: (root, {names}) => {
                    return root.attributes.filter(attr => names.indexOf(attr.name) !== -1)
                }
            },
            links: {
                type: attributeLinkList,
                args: {
                    names: { type: new GraphQLList(GraphQLString) },
                    ids:   { type: new GraphQLList(GraphQLString) }
                },
                resolve: (root, {names, ids}) => {
                    return root.attributes.filter(attr => names.indexOf(attr.name) !== -1)
                }
            }
        })
    });
    let entityList = new GraphQLList(entity);

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
                        idList: {
                            description: 'List of entity ID to look for',
                            type: new GraphQLList(GraphQLString),
                            defaultValue: null
                        },
                        typeId: {
                            description: 'Type of the entity',
                            type: GraphQLString
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
                    resolve: async (root, {id, idList, typeId, type, attributes}) => {
                        // No restrictions were requested
                        if (!(id || typeId || type || attributes || idList)) { return cortexWorkspace.getEntities() }
                        let entities = await cortexWorkspace.getEntities();
                        return entities.filter((entity) => {
                            if (typeId && !(entity.entityType.id == typeId)) {return false;}
                            if (type && !(entity.entityType.name == type)) {return false;}
                            if (id && !(entity.id == id)) { return false; }
                            if (idList && (!(idList.indexOf(entity.id) >= 0))) { return false; }
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
                        },
                        idList: {
                            description: 'List of IDs',
                            type: new GraphQLList(GraphQLString),
                            defaultValue: null
                        }
                    },
                    resolve: async (root, {id, name, idList}) => {
                        let types = await cortexWorkspace.getEntityTypes();
                        if (idList) types = types.filter(it => idList.indexOf(it.id) >= 0);
                        if (id) types = types.filter((it) => it.id == id);
                        if (name) types = types.filter((it) => it.name == name);
                        return types
                    }
                }
            }
        })
    });

    return _entitySchema
};
export {
    schemaFunc as schema
}
