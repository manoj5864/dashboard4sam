import {PlotlyBarChart} from '../../graphs/plotly/PlotlyBarChart'
import {PlotlyPieChart} from '../../graphs/plotly/PlotlyPieChart'

let React = window.React

export class InfoWindow extends React.Component {
    constructor() {
        super()
    }

    render() {
        return(
            <PlotlyPieChart
                values={[5,10,30]}
                labels={['a','b','c']}
            >

            </PlotlyPieChart>
        )
    }
}