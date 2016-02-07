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
            name: React.PropTypes.string,
            instances: React.PropTypes.arrayOf(React.PropTypes.string)
        }
    }

    static get defaultProps() {
        return {
            id: null,
            name: '',
            instances: []
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            cols: ['Column1', 'Column2'],
            rows: [
                new RowWrapper({Column1: 'Loading', Column2: 'Data...'})
            ],
            id: props.id,
            instances: props.instances
        };
        this._handleRefresh()
    }

    static async getTypeDetails(typeId) {
        let result = {};
        const tempClass = await app.socioCortexManager.executeQuery(`
                query getClassDefinition {
                    type(id: "${typeId}") {
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
        result.id = typeId;
        result.name = classDef.name;
        result.attributes = attributes;
        result.links = links;
        return result;
    }

    async _handleRefresh() {
        const details = await EntityTypeDetails.getTypeDetails(this.state.id);
        const tempEntities = await app.socioCortexManager.executeQuery(`
                query getEntitiesDetailed {
                    entity(idList: ${JSON.stringify(this.state.instances)}) {
                        name
                        attributes(names: ${JSON.stringify(details.attributes)}) {
                            id
                            name
                            value
                        }
                        links(names: ${JSON.stringify(details.links)}) {
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
        const cols = _.union(['name'], details.attributes, details.links);
        let contents = entities.map(entity => {
            let attrs = {name:  entity.name};
            details.attributes.forEach((attr) => {
                const temp = entity.attributes.find(a => {return a.name === attr});
                const value = temp && temp.value[0] || null;
                attrs[attr] = value;
            });
            details.links.forEach((link) => {
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