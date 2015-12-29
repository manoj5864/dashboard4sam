import {mixin} from '../../../util/mixin'
import {TLoggable} from '../../../util/logging/TLoggable'
import {SankeySurfaceManager} from './SankeySurfaceManager'
import {SankeyNode} from './SankeyNode'
import './../util/d3-sankey'
import _ from 'lodash';
let d3 = window.d3

export class SankeyGraphPage extends mixin(React.Component, TLoggable) {

  constructor() {
    super()
  }

  get name() {
    return "Sankey View"
  }

  componentDidMount() {
    let node1 = new SankeyNode('Test')
    let node2 = new SankeyNode('Test2')
    node1.addConnectedNode(node2)

    new SankeySurfaceManager(this._svgElement, {nodeList: [node1,node2]})
  }

  render() {
    return (
        <svg width="1000" height="800" xmlns="http://www.w3.org/svg/2000" ref={(c) => this._svgElement = c}>
        </svg>
    )
  }

}