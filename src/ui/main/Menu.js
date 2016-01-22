import {mixin} from '../../util/mixin'
import {TLoggable} from '../../util/logging/TLoggable'

let React = window.React
let Parents = mixin(React.Component, TLoggable)

class MenuEntry extends mixin(React.Component, TLoggable) {
    constructor() {
        super()
        this.state = {
            displaySubmenu: false
        }
    }

    _buildStyle() {
        if (this.state.displaySubmenu) {
            return {'display': 'block'}
        }
        return {}
    }

    render() {
        return (
            <li className="has_sub">
                <a href="#" onClick={this.props.onClick}>{this.props.title}</a>
                <ul className="list-unstyled" style={this._buildStyle()}>

                </ul>
            </li>
        )
    }
}

export class Menu extends mixin(React.Component, TLoggable) {
    constructor() {
        super()
        this.state = {
            menuItems: []
        }
    }

    addItem(name, callback) {
        let menuItems = this.state.menuItems
        menuItems.push({
            name: name,
            callback: callback
        })
        this.setState({
            menuItems: menuItems
        })
    }



    _buildMenuItems() {
        return this.state.menuItems.map((item) => {
            return <MenuEntry title={item.name} onClick={item.callback}/>
        })
    }

    render() {
        return (
            <div className="left side-menu">
                <div id="sidebar-menu">
                    <ul>
                        <li className="text-muted menu-title">Elements</li>
                        {this._buildMenuItems()}
                    </ul>
                </div>
            </div>
        )
    }
}