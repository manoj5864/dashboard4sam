import {mixin} from '../../../util/mixin'
import {TLoggable} from '../../../util/logging/TLoggable'

let React = window.React;

export class Table extends mixin(React.Component, TLoggable) {

    static get propTypes() {
        return {
            cols: React.PropTypes.arrayOf(React.PropTypes.string),
            rows: React.PropTypes.arrayOf(React.PropTypes.instanceOf(RowWrapper))
        }
    }

    static get defaultProps() {
        return {}
    }

    constructor(props) {
        super(props);
        this.state = {}
    }

    _buildHead() {
        return (
            <thead>
                <tr>
                    {this.props.cols.map((col) => {return <th>{col}</th>})}
                </tr>
            </thead>
        )
    }

    _buildBody() {
        return(
            <tbody>
            {this.props.rows.map(row => {
                return this._buildRow(row)
            })}
            </tbody>
        )
    }

    _buildRow(row) {
        return (
            <tr style={{borderTop: '1px solid #ddd'}}>
                {this.props.cols.map(col => {return this._buildCell(row, col)})}
            </tr>
        )
    }

    _buildCell(row, col) {
        return <td>{row.getValueOfCol(col)}</td>
    }

    render() {
        return (
            <table className="table table-striped" style={{width: '100%'}}>
                {this._buildHead()}
                {this._buildBody()}
            </table>
        )
    }

}

export class RowWrapper {

    constructor(object) {
        this._obj = object
    }

    getValueOfCol(colName) {
        return this._obj[colName]
    }

}