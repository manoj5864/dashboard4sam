import {
    graphql,
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLList,
    GraphQLString
} from 'graphql';
import {schema} from './CortexSchema'

let schemaFunc = (cortexSchema) => {
    let execQuery = (query) => {
        return graphql(schema(workspace), query)
    }

    let _entitySchema = new GraphQLSchema({
        query: new GraphQLObjectType({
            name: 'Query',
            fields: {
                project: {
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