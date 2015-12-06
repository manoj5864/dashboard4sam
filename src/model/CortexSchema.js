import {
    graphql,
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLList,
    GraphQLString
} from 'graphql';

let schemaFunc = (cortexWorkspace) => {

    let entityClassReference = new GraphQLObjectType({
        name: 'EntityClassReference',
        fields:  {
            name: {
                type: GraphQLString
            }
        }
    })

    let entityAttribute = new GraphQLObjectType({
        name: 'EntityClassAttribute',
        fields: {
            name: {
                type: GraphQLString
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
            referencedBy: {
                type: new GraphQLList(entityClassReference)
            },
            referencesTo: {
                type: new GraphQLList(entityClassReference)
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
                    resolve: () => cortexWorkspace.getEntities()
                },

                type: {
                    type: entityClassList,
                    args: {
                        id: {
                            description: 'ID of the entity class',
                            type: GraphQLString
                        }
                    },
                    resolve: (root, {id}) => cortexWorkspace.getEntityTypes()
                }
            }
        })
    })

    return _entitySchema
}
export {schemaFunc as schema}