import {mixin} from '../../util/mixin'
import {TLoggable} from '../../util/logging/TLoggable'

let React = window.React

export class ContentPage extends mixin(React.Component, TLoggable) {
    constructor() {
        super()
    }

    get name() {
        throw new Error('Name must be specified by content page')
    }

    get subtitle() {
        return ""
    }

    triggerLoading() {

    }
}

class DummyPage extends ContentPage {

    constructor() {
        super()
    }

    get name() {
        return "Dummy Page"
    }

    render() {
        return (
            <div>Empty Page</div>
        )
    }

}

export class Content extends mixin(React.Component, TLoggable){

    constructor() {
        super()
        this.state = {
            page: new DummyPage()
        }
    }

    set currentPage(page) {
        if (!(page instanceof ContentPage)) throw new Error('No content page given')
        this.setState({
            page: page
        })
    }

    render() {
        return(
            <div className="content-page">
                <div className="content">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="page-header-2">
                                    <h4 className="page-title">
                                        {this.state.page.name}
                                    </h4>
                                    <p>{this.state.page.subtitle}</p>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="card-box">
                                    {this.state.page.render()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}