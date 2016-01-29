import {mixin} from '../../util/mixin'
import {TLoggable} from '../../util/logging/TLoggable'
import {PlotlyStackBarChart} from '../graphs/plotly/PlotlyStackBarChart'
import {EntityTypeDetails} from '../../ui/query_builder/dialog/EntityTypeDetails'
import {app} from '../../Application'
import {default as _} from 'lodash'

export class CompletenessStatsView extends mixin(React.Component, TLoggable) {

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

    constructor() {
        super();
        this.state = {};
    }

    get name() {
        return "Completeness Stats View"
    }

    async componentDidMount() {
        const details = await EntityTypeDetails.getTypeDetails(this.props.id);
        const tempEntities = await app.socioCortexManager.executeQuery(`
                query getEntitiesDetailed {
                    entity(typeId: "${details.id}") {
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
        const cols = details.attributes.concat(details.links);
        let contents = entities.map(entity => {
            let attrs = {};
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
        const attrTrue = details.attributes.map(name => {
            return contents.filter( entity => !!entity[name]).length
        });
        const linkTrue = details.links.map(name => {
            return contents.filter( entity => !!entity[name]).length
        });
        const valuesTrue = attrTrue.concat(linkTrue);
        const valuesFalse = valuesTrue.map(count => contents.length - count);

        ReactDOM.unmountComponentAtNode($('#attr-completeness')[0]);
        ReactDOM.render(
            <PlotlyStackBarChart // Architecture Completeness Stats
                values1={valuesTrue}
                values2={valuesFalse}
                labels={cols}
                name1='attr present'
                name2='attr not present'
                width="800"
                height="500"
                title={`${details.name} Attribute Completeness`}
            >
            </PlotlyStackBarChart>,
            $('#attr-completeness')[0]
        );
    }

    render() {
        return (
            <div>
                <table>
                    <tbody>
                    <tr>
                        <td id="attr-completeness"></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        )


    }

}