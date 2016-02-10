import {mixin} from '../../util/mixin'
import {TLoggable} from '../../util/logging/TLoggable'
import {app} from  '../../Application'

export class Topbar extends  mixin(React.Component, TLoggable) {

    constructor() {
        super()
        this.state = {
            showUser: false,
            user: {
                name: '',
                pictureUrl: ''
            }
        }
    }

    async componentDidMount() {
        let userDetails = await app.socioCortexManager.getUserDetails();
        this.setState({
            user: {
                name: userDetails.name,
                pictureUrl: userDetails.pictureUrl
            }
        });
    }

    _handleUserProfileClick() {
        app.socioCortexManager.logout();
        location.reload();
    }

    render() {
        return (
            <div className="topbar">
                <div className="topbar-main">
                    <div className="logo">
                        <img src="images/logo.svg"/>
                    </div>
                    <div onClick={this._handleUserProfileClick.bind(this)} className="profile" style={{'display': this.state.showUser}}>
                        <span>{this.state.user.name}</span>
                        <img src={this.state.user.pictureUrl} className="img-circle" />
                    </div>
                </div>

            </div>

        )
    }
}