
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

    let requirementType = new GraphQLObjectType({
        name: 'Requirement Type',
        fields: {
            name: {
                type: GraphQLString
            }
        }
    })

    let projectType = new GraphQLObjectType({
        name: 'Project Type',
        fields: {
            name: {
                type: GraphQLString
            },
            requirements: {
                type: new GraphQLList(requirementType)
            }
        }
    })



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
