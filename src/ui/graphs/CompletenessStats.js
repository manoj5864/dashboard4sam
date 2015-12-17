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
          <table>
            <tbody>
            <tr>
              <td><PlotlyStackBarChart // Architecture Completeness Stats
                  values1={[15,40,30]}
                  values2={[5,20,30]}
                  labels={['Elements','Decisions','Projects']}
                  name1='With'
                  name2='Without'
                  width="480"
                  height="400"
                  title="Architecture Completeness Stats"
              >
              </PlotlyStackBarChart></td>
              <td><PlotlyStackBarChart // Requirements Completeness Stats
                  values1={[45,40,30]}
                  values2={[25,20,30]}
                  labels={['TestCases', 'Projects', 'Person']}
                  name1='With'
                  name2='Without'
                  width="480"
                  height="400"
                  title="Requirements Completeness Stats"
              >
              </PlotlyStackBarChart></td>
              </tr>
            </tbody>
            <tbody>
            <tr>
              <td><PlotlyStackBarChart // Decision Completeness Stats
                  values1={[15]}
                  values2={[5]}
                  labels={['Requirements']}
                  name1='With'
                  name2='Without'
                  width="300"
                  height="350"
                  title="Decisions Completeness Stats"
              >
              </PlotlyStackBarChart></td>
              <td><PlotlyStackBarChart // Assignments Completeness Stats
                  values1={[15,20]}
                  values2={[5,20]}
                  labels={['Persons', 'Tasks']}
                  name1='With'
                  name2='Without'
                  width="480"
                  height="400"
                  title="Assignments Completeness Stats"
              >
              </PlotlyStackBarChart></td>
            </tr>
            </tbody>

          </table>




        </div>
    )


  }

}