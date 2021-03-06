import {Form, FormControl} from '../widgets/forms/Form'
import {Button} from '../widgets/Button'
import {Modal} from '../widgets/Modal'
import {mixin} from '../../../util/mixin'
import {TLoggable} from '../../../util/logging/TLoggable'
import {SocioCortexApi} from '../../../service/api/SocioCortexApi'

class LoginDetails {

}

export class LoginWindow extends React.Component {

    constructor() {
        super();
        this._awaitingPromises = [];
        this.state = {
            invalidLogin: false
        }
    }

    async _getLoginDetails() {
        let promise = new Promise((resolve, reject) => {
            this._awaitingPromises.push({
                resolve: resolve,
                reject: reject
            });
        });
        return promise;
    }

    async _handleLoginClick() {
        let username = this._usernameField.value;
        let password = this._passwordField.value;

        if (!username || !password) {
            return;
        }

        let obj = {
            username: username,
            password: password
        };

        let cortex = new SocioCortexApi(username, password);
        let res = await cortex.testLogin();

        if (res) {
            this._awaitingPromises.forEach(it=>it.resolve(obj));
        } else {
            this.setState({
                invalidLogin: true
            });
        }

    }

    static async getLoginDetails(verifyFunction = null) {
        if (LoginWindow.IS_VISIBLE) throw new Error('Login screen may only be shown once');

        let loginWindow = null;
        Modal.show(null, <LoginWindow ref={c=>loginWindow=c} />, true);
        let details = await loginWindow._getLoginDetails();
        Modal.hide();

        return details;
    }

    render() {
        return(
            <div className="card-box" style={{
            'backgroundImage': 'url(images/login-bg.svg), radial-gradient(circle 600px at 50% 0%, #033964 0%, #00101c 100%)',
            'backgroundRepeat': 'no-repeat',
            'border': '1px solid rgba(255, 255, 255, 0.30)'
            }}>
                <div className="panel-heading" style={{'justify-content': 'center', 'display': 'flex'}}>
                    <img src="images/login-logo.svg" style={{'height':'auto', 'width':'auto', 'max-height': '200px'}}/>
                </div>
                <div className="panel-body" style={{'display': 'flex', 'justifyContent': 'center'}}>
                    <div className="login">
                        <Form>
                            <FormControl style={this.state.invalidLogin ? {borderColor: 'red'} : {}} placeholder="username" ref={c=>this._usernameField = c} />
                            <FormControl style={this.state.invalidLogin ? {borderColor: 'red'} : {}} type="password" placeholder="password" ref={c=>this._passwordField = c} />
                            <FormControl>
                                <Button className="btn btn-block text-uppercase waves-effect waves-light" style={{'backgroundColor': '#224c70'}} onClick={this._handleLoginClick.bind(this)} text="Login"/>
                            </FormControl>
                        </Form>
                    </div>
                </div>
            </div>
        )
    }

}
LoginWindow.IS_VISIBLE = false;