
let logTypes = {
    DEBUG: 'DEBUG',
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR'

};

class LoggingConfiguration {
    static get isDebuggingEnabled() { return true; }
}

class DefaultLogger {

    _logMessage(type, message) {
        let time = new Date().toUTCString()
        console.log(`${time} - [${type}] - [${this._clazz}] - ${message}`);
    }

    debug(msg) {
        if (LoggingConfiguration.isDebuggingEnabled) {
            this._logMessage(logTypes['DEBUG'], msg)
        }
    }

    info(msg) {
        this._logMessage(logTypes['INFO'], msg)
    }

    error(msg) {
        this._logMessage(logTypes['ERROR'], msg)
    }

    constructor(clazz) {
        this._clazz = clazz
    }
}

export class StaticLog {
    static log(type, clazz, msg) {
        let time = new Date().toUTCString()
        console.log(`${time} - [${type}] - [${clazz}] - ${msg}`);
    }
}

export let TLoggable = {
    debug(msg) {StaticLog.log('DEBUG', this.__proto__.constructor.name, msg)},
    info(msg)  {StaticLog.log('INFO', this.__proto__.constructor.name, msg)},
    warn(msg)  {StaticLog.log('WARN', this.__proto__.constructor.name, msg)}
}

export class StaticLogger {
    static debug(msg, name='Static Logger') {StaticLog.log('DEBUG', name, msg)}
    static info(msg, name='Static Logger')  {StaticLog.log('INFO', name, msg)}
    static warn(msg, name='Static Logger')  {StaticLog.log('WARN', name, msg)}
}