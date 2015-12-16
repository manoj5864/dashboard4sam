/**
 * Created by andi on 14.12.15.
 */

import {PlotlyWrapper} from './PlotlyWrapper'

let React = window.React;
let Plotly = window.Plotly

export class PlotlyBarChart extends PlotlyWrapper {

    static get propTypes() {
        return {
            xValues : React.PropTypes.array.isRequired,
            yValues : React.PropTypes.array.isRequired
        }
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let {xValues, yValues, width, height, title} = this.props;
        let data = [
            {
                x: xValues,
                y: yValues,
                type: 'bar'
            }
        ];
        let layout = {};
        if (width) layout.width = width;
        if (height) layout.height = height;
        if (title) layout.title = title

        Plotly.newPlot(this._element, data, layout);
    }

}