import {mixin} from '../../util/mixin'
import {TLoggable} from '../../util/logging/TLoggable'
import {PlotlyStackBarChart} from '../graphs/plotly/PlotlyStackBarChart'

export class CompletenessAttributeStats extends mixin(React.Component, TLoggable) {

  constructor() {
    super()
  }

  get name() {
    return "Completeness Attribute Stats View"
  }

  componentDidMount() {

    // TODO : Get the real data from SocioCortex for rendering
    /*
     let entities = await app.socioCortexManager.executeQuery(`
     query EntityTypes {
     type {
     name
     }
     }
     `)
     */


  }

  render() {
    return (
        <div>
          <h1> Attributes Completeness Statistics </h1>
          <table>
            <tbody>
            <tr>
              <td><PlotlyStackBarChart
                  values1={[15,20, 20, 15, 17, 14 ]}
                  values2={[5,0, 0, 5, 3, 6]}
                  labels={['Description', 'EndDate', 'StartDate', 'ParentTask', 'Priority', 'Status']}
                  name1='With'
                  name2='Without'
                  width="480"
                  height="400"
                  title="Element Attributes"
              >
              </PlotlyStackBarChart></td>
              <td><PlotlyStackBarChart
                  values1={[15,20, 20, 15, 17, 14 ]}
                  values2={[5,0, 0, 5, 3, 6]}
                  labels={['Description', 'EndDate', 'StartDate', 'ParentTask', 'Priority', 'Status']}
                  name1='With'
                  name2='Without'
                  width="480"
                  height="400"
                  title="Tasks"
              >
              </PlotlyStackBarChart></td>
              <td>
                <PlotlyStackBarChart
                    values1={[15]}
                    values2={[5]}
                    labels={['Description']}
                    name1='With'
                    name2='Without'
                    width="280"
                    height="400"
                    title="Decisions"
                >
                </PlotlyStackBarChart>
              </td>
              </tr>
            </tbody>
            <tbody>
            <tr>
              <td><PlotlyStackBarChart
                  values1={[15,0,5,20]}
                  values2={[5,20,15,0]}
                  labels={['Budget', 'TeamSize', 'StartDate', 'EndDate']}
                  name1='With'
                  name2='Without'
                  width="480"
                  height="400"
                  title="Projects"
              >
              </PlotlyStackBarChart></td>
              <td><PlotlyStackBarChart
                  values1={[12,0,10]}
                  values2={[8,20,10]}
                  labels={['Description', 'Rationale', 'Type']}
                  name1='With'
                  name2='Without'
                  width="480"
                  height="400"
                  title="Requirements"
              >
              </PlotlyStackBarChart></td>
              <td>
                <PlotlyStackBarChart
                    values1={[25]}
                    values2={[5]}
                    labels={['Description']}
                    name1='With'
                    name2='Without'
                    width="280"
                    height="400"
                    title="Architecture"
                >
                </PlotlyStackBarChart>
              </td>
            </tr>
            </tbody>

          </table>




        </div>
    )


  }

}