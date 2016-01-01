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
    // Put conditions and set colors based on the type of entities. e.g. Architecture = red
    let node1 = new SankeyNode('Requirements', 'Test', 'http://www.test1.com/pdf', 'red')
    let node2 = new SankeyNode('Requirements', 'Test2', 'http://www.test2.com/pdf', 'red')
    let node3 = new SankeyNode('Decisions', 'Test3', 'http://www.test3.com/pdf', 'blue')
    let node4 = new SankeyNode('Architectures', 'Test4', 'http://www.test4.com/pdf', 'green')
    node1.addConnectedNode(node3)
    node2.addConnectedNode(node3)
    node3.addConnectedNode(node4)

    new SankeySurfaceManager(this._svgElement, {nodeList: [node1,node2,node3, node4]})
  }

  render() {
    return (
        <svg width="1000" height="800" xmlns="http://www.w3.org/svg/2000" ref={(c) => this._svgElement = c}>
        </svg>
    )
  }

}