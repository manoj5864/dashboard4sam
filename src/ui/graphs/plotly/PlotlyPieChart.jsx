/**
 * Created by andi on 14.12.15.
 */

import {PlotlyWrapper} from './PlotlyWrapper'

let React = window.React;
let Plotly = window.Plotly

export class PlotlyPieChart extends PlotlyWrapper {

    static get propTypes() {
        return {
            values : React.PropTypes.array.isRequired,
            labels : React.PropTypes.array.isRequired
        }
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let {values, labels, width, height} = this.props
        let data = [
            {
                values: values,
                labels: labels,
                type: 'pie'
            }
        ];
        let layout = {}
        if (width) layout.width = width
        if (height) layout.height = height

        Plotly.newPlot(this._element, data, layout);
    }

}