import {mixin} from '../../util/mixin'
import {TLoggable} from '../../util/logging/TLoggable'
import {PlotlyStackBarChart} from '../graphs/plotly/PlotlyStackBarChart'

export class CompletenessStatsView extends mixin(React.Component, TLoggable) {

  constructor() {
    super()
  }

  get name() {
    return "Completeness Stats View"
  }

  componentDidMount() {

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
          <h1>Dependencies Completeness Statistics</h1>
          <table>
            <tbody>
            <tr>
              <td><PlotlyStackBarChart
                  values1={[15,5,0]}
                  values2={[5,15,20]}
                  labels={['Elements','Decisions','Projects']}
                  name1='With'
                  name2='Without'
                  width="480"
                  height="400"
                  title="Architecture"
              >
              </PlotlyStackBarChart></td>
              <td><PlotlyStackBarChart
                  values1={[5,10,12]}
                  values2={[15,10,8]}
                  labels={['TestCases', 'Projects', 'Person']}
                  name1='With'
                  name2='Without'
                  width="480"
                  height="400"
                  title="Requirements"
              >
              </PlotlyStackBarChart></td>
              </tr>
            </tbody>
            <tbody>
            <tr>
              <td><PlotlyStackBarChart
                  values1={[15]}
                  values2={[5]}
                  labels={['Requirements']}
                  name1='With'
                  name2='Without'
                  width="300"
                  height="400"
                  title="Decisions "
              >
              </PlotlyStackBarChart></td>
              <td><PlotlyStackBarChart
                  values1={[15,0]}
                  values2={[5,20]}
                  labels={['Persons', 'Tasks']}
                  name1='With'
                  name2='Without'
                  width="480"
                  height="400"
                  title="Assignments"
              >
              </PlotlyStackBarChart></td>
            </tr>
            </tbody>

          </table>




        </div>
    )


  }

}