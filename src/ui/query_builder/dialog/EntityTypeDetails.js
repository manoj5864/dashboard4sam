import {mixin} from '../../../util/mixin'
import {TLoggable} from '../../../util/logging/TLoggable'
import {Table, RowWrapper} from '../../../ui/main/widgets/Table'
import {app} from '../../../Application'
import {default as _} from 'lodash'

let React = window.React;

export class EntityTypeDetails extends mixin(React.Component, TLoggable) {

    static get propTypes() {
        return {
            id: React.PropTypes.string.isRequired,
            name: React.PropTypes.string
        }
    }

    static get defaultProps() {
        return {
            id: null,
            name: ''
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            cols: ['col1', 'col2', 'col3'],
            rows: [
                new RowWrapper({col1: 'test', col2: 'test2', col3: 'test3'}),
                new RowWrapper({col1: 'test', col2: 'test2', col3: 'dgfh'}),
                new RowWrapper({col1: 'test', col2: 'test2', col3: 'sdg'})
            ],
            id: props.id
        };
        this._handleRefresh()
    }

    async _handleRefresh() {
        const entityType = this.state.id;
        const tempClass = await app.socioCortexManager.executeQuery(`
                query getClassDefinition {
                    type(id: "${entityType}") {
                        name
                        attributes(includeLinks: true) {
                            id
                            name
                            type
                        }
                    }
                }
            `);
        const classDef = tempClass.data.type[0];
        let attributes = [];
        let links = [];
        classDef.attributes.forEach(attr => {
            if (attr.type === 'Link') {
                links.push(attr.name)
            } else {
                attributes.push(attr.name)
            }
        });
        const tempEntities = await app.socioCortexManager.executeQuery(`
                query getEntitiesDetailed {
                    entity(typeId: "${entityType}") {
                        name
                        attributes(names: ${JSON.stringify(attributes)}) {
                            id
                            name
                            value
                        }
                        links(names: ${JSON.stringify(links)}) {
                            id
                            name
                            value {
                                id
                                name
                            }
                        }
                    }
                }
            `);
        const entities = tempEntities.data.entity;
        const cols = _.union(attributes, links);
        let contents = entities.map(entity => {
            let attrs = {};
            attributes.forEach((attr) => {
                const temp = entity.attributes.find(a => {return a.name === attr});
                const value = temp && temp.value[0] || null;
                attrs[attr] = value;
            });
            links.forEach((link) => {
                const temp = entity.links.find(l => {return l.name === link});
                const value = temp && temp.value.map(v => v.name).join(', ') || null;
                attrs[link] = value;
            });
            return attrs;
        });
        this.setState({
            cols: cols,
            rows: contents.map(row => {return new RowWrapper(row)})
        })
    }

    render() {
        return <Table cols={this.state.cols} rows={this.state.rows} />;
    }

} 