import {mixin} from '../../../util/mixin'
import {TLoggable} from '../../../util/logging/TLoggable'

let React = window.React;

export class Tabs extends mixin(React.Component, TLoggable) {

    static get propTypes() {
        return {
            active: React.PropTypes.number,
            tabs: React.PropTypes.arrayOf(React.PropTypes.instanceOf(TabWrapper)).isRequired,
            indexUpdate: React.PropTypes.func
        }
    }

    static get defaultProps() {
        return {
            active: 0,
            tabs: [],
            indexUpdate: (index) => {}
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            active: props.active
        }
    }

    render() {
        const clickHandler = (index) => {
            this.props.indexUpdate(index)
            this.setState({
                active: index
            })
        }
        return (
            <ul className="nav nav-pills">
                {this.props.tabs.map((tab, index) => {
                    return (
                        <Tab
                            active={index === this.state.active}
                            badge={tab.badge}
                            click={clickHandler.bind(this, index)}>
                            {tab.title}
                        </Tab>
                    )
                })}
            </ul>
        )
    }

}


export class TabWrapper {

    constructor(title, badge, page) {
        this._title = title;
        this._badge = badge;
        this._page = page;
    }

    get title() {return this._title}
    get badge() {return this._badge}
    get page() {return this._page}

}


class Tab extends mixin(React.Component, TLoggable) {

    static get propTypes() {
        return {
            active: React.PropTypes.bool,
            badge: React.PropTypes.number,
            children: React.PropTypes.string
        }
    }

    static get defaultProps() {
        return {
            active: false,
            badge: null,
            children: 'TabTitle'
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            active: props.active,
            badge: props.badge
        }
    }

    _buildClasses() {
        return this.state.active === true ? "active" : ""
    }

    _buildContent() {
        const badge = this.state.badge;
        const title = this.props.children;
        if (badge !== null) {
            return [title, <span className="badge">{badge}</span>]
        }
        else {
            return title
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            active: nextProps.active,
            badge: nextProps.badge
        })
    }

    render() {
        return (
            <li role="presentation" className={this._buildClasses()} onClick={this.props.click.bind(this)}>
                <a href="#">{this._buildContent()}</a>
            </li>
        )
    }

}

class TabbedContentPage extends React.Component {

    static get propTypes() {
        return {
            visible: React.PropTypes.bool,
            children: React.PropTypes.node
        }
    }

    static get defaultProps() {
        return {
            visible: true,
            children: null
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            visible: props.visible
        }
    }

    _buildStyle() {
        if (!this.state.visible) return {display: 'none'};
        return {};
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            visible: nextProps.visible
        })
    }

    render() {
        return (
            <div className="padding-20" style={this._buildStyle()}>
                {this.props.children}
            </div>
        )
    }

}

export class TabbedContent extends React.Component {

    static get propTypes() {
        return {
            active: React.PropTypes.bool,
            children: React.PropTypes.arrayOf(React.PropTypes.instanceOf(TabWrapper))
        }
    }

    static get defaultProps() {
        return {
            active: 0,
            children: []
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            active: props.active,
            content: props.children
        }
    }

    render() {
        const indexUpdate = (index) => {
            this.setState({active: index})
        };
        return (
            <div>
                <Tabs active={this.state.active} tabs={this.state.content}
                      indexUpdate={indexUpdate.bind(this)}></Tabs>
                {this.state.content.map((page, index) => {
                    return (
                        <TabbedContentPage visible={index===this.state.active}>
                            {page.page}
                        </TabbedContentPage>
                    )
                })}
            </div>
        )
    }

}