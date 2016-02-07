import {mixin} from '../../../util/mixin'
import {TLoggable} from '../../../util/logging/TLoggable'
import {SankeySurfaceManager} from './SankeySurfaceManager'
import {SankeyNode} from './SankeyNode'
import './../util/d3-sankey'
import _ from 'lodash'

export {SankeyNode}

export class SankeyGraphPage extends mixin(React.Component, TLoggable) {

  constructor() {
    super()
  }

  static get defaultProps() {
    return {
      nodes: [],
      showLegend: false
    }
  }

  get surfaceManager() {
    return this._sankeySurfaceManager;
  }

  componentDidMount() {
    this._sankeySurfaceManager = new SankeySurfaceManager(
        this._svgElement, {
          nodeList: this.props.nodes
        }
    )
  }

  render() {
    return (
        <svg width="100%" height="100%" xmlns="http://www.w3.org/svg/2000" ref={(c) => this._svgElement = c}>
        </svg>
    )
  }

}