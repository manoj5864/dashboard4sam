import {schema} from '../CortexSchema'
import {workspace} from  '../../tests/defaults/Clients'
import {graphql} from 'graphql'
import 'babel-polyfill'
import {expect} from 'chai'

describe('QueryLanguage', function() {
    this.timeout(50000);
    it('should retrieve entities by name', async () => {
        let query = `
            query EntityQuery {
                entity {
                    name
                }
            }
        `

        let result = await graphql(schema(workspace), query)
        expect(result.data.entity[0]).to.have.all.keys('name')

    })

    it('should retrieve entity types', async () => {
        let query = `
            query EntityTypeQuery {
                type {
                    name
                }
            }
        `

        let result = await graphql(schema(workspace), query)
        expect(result.data.type[0]).to.have.all.keys('name')

    })

    it('should retrieve entities with their class name', async () => {
        let query = `
            query EntitiesWithClassesQuery {
                entity {
                    class {
                        name
                    }
                    name
                }
            }
        `
    })

    it('should retrieve entity types including their references classes', async () => {
        let query = `
            query EntitiesWithClassesQuery {
                type {
                    referencedBy {
                        name
                        entityType {
                            name
                        }
                    }
                    name
                }
            }
        `
        let result = await graphql(schema(workspace), query)
        expect(result.data.type[0]).to.be('')
    })
})