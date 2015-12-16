import {mixin} from '../../util/mixin'
import {TLoggable} from '../../util/logging/TLoggable'
import {PlotlyBarChart} from '../graphs/plotly/PlotlyBarChart.jsx'

export class CompletenessStatsView extends mixin(React.Component, TLoggable) {

    constructor() {
        super()
    }

    get name() {
        return "Completeness Stats View"
    }

    render() {
        return (
            <div>
                <table>
                    <tbody>
                    <tr>
                        <td>
                            <PlotlyBarChart
                                xValues={['Decision','Requirement','Person']}
                                yValues={[23,79,5]}
                                width="380"
                                height="300"
                                title="Avg X per Architecture">
                            </PlotlyBarChart>
                        </td>
                        <td>
                            <PlotlyBarChart
                                xValues={['Architecture','Requirement','Person']}
                                yValues={[23,4,2]}
                                width="380"
                                height="300"
                                title="Avg X per Decision">
                            </PlotlyBarChart>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <PlotlyBarChart
                                xValues={['Architecture','Decision','Person']}
                                yValues={[79,4,1]}
                                width="380"
                                height="300"
                                title="Avg X per Requirement">
                            </PlotlyBarChart>
                        </td>
                        <td>
                            <PlotlyBarChart
                                xValues={['Architecture','Decision','Requirement']}
                                yValues={[5,2,15]}
                                width="380"
                                height="300"
                                title="Avg X per Person">
                            </PlotlyBarChart>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        )


    }

}