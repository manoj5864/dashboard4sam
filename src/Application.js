import {mixin} from './util/mixin'
import {TLoggable} from './util/logging/TLoggable'

let Parents = mixin(null, TLoggable)
export class Application extends Parents{
    static start() {

    }
}