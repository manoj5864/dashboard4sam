import {Form, FormControl} from './form/Form'
import {Button} from './widgets/Button'
import {mixin} from '../../util/mixin'
import {TLoggable} from '../../util/logging/TLoggable'

export class LoginPage extends mixin(React.Component, TLoggable) {


    render() {
        return (
            <div className="wrapper-page">
                <div className="card-box">
                    <div className="panel-heading">
                        <h3 className="text-center">Dashboard4SAM</h3>
                    </div>
                    <div className="panel-body">
                        <Form className="m-t-20">
                            <FormControl placeholder="username" />
                            <FormControl placeholder="password" />
                            <FormControl>
                                <Button className="btn btn-pink btn-block text-uppercase waves-effect waves-light" text="Login"/>
                            </FormControl>
                        </Form>
                    </div>
                </div>
            </div>
        )
    }

}