import {
    graphql,
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLList,
    GraphQLString
} from 'graphql';

let schemaFunc = (cortexWorkspace) => {
    let entityClass = new GraphQLObjectType({
        name: 'EntityClass',
        fields: {
            name: {
                type: GraphQLString
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
                type: GraphQLString,
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
                    resolve: () => cortexWorkspace.getEntityTypes()
                }
            }
        })
    })

    return _entitySchema
}
export {schemaFunc as schema}