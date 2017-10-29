let defaultConfig = {
    showMillis: false,
    showTimestamp: true,
    printObjFunc: cc.log,
    prefix: ""
};

class Logger {

    constructor(config) {
        if (config == null) config = {};
        this.config = Object.assign(defaultConfig, config);
        this.logLevel = "debug";
    }

    setLevel(level, silent) {
        var levelName, levelValue, log, name, val, _ref;
        if (silent == null) silent = false;
        levelName = null;
        levelValue = null;
        _ref = Logger.levels;
        for (name in _ref) {
            val = _ref[name];
            if (level === name || level === val) {
                levelName = name;
                levelValue = val;
                break;
            }
        }
        // log = new this({
        //   prefix: 'basic-logger'
        // });
        if ((levelName != null) && (levelValue != null)) {
            if (!silent) console.log("Setting log level to '" + levelName + "'");
            return this.logLevel = levelValue;
        } else {
            return console.log("Can't set log level to '" + level + "'. This level does not exist.");
        }
    };

    padZeros(num, digits) {
        var zerosToAdd;
        num = String(num);
        zerosToAdd = digits - num.length;
        while (zerosToAdd > 0) {
            num = '0' + num;
            zerosToAdd = zerosToAdd - 1;
        }
        return num;
    };

    _log(params) {
        var args, date, level, levelName, msg, output, timestamp;
        msg = params[0];
        levelName = params[1];
        args = 3 <= params.length ? params.slice(2) : [];
        // msg = arguments[0], levelName = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
        level = Logger.levels[levelName];
        var curLogLevel = Logger.levels[this.logLevel];
        if (level <= curLogLevel) {
            date = new Date;
            timestamp = date.getFullYear() + "-" + this.padZeros(date.getMonth() + 1, 2) + "-" + this.padZeros(date.getDate(), 2) + " " + this.padZeros(date.getHours(), 2) + ":" + this.padZeros(date.getMinutes(), 2) + ":" + this.padZeros(date.getSeconds(), 2);
            if (this.config.showMillis) {
                timestamp += "." + this.padZeros(date.getMilliseconds(), 3);
            }
            if (typeof msg === "object") msg = this.config.printObjFunc(msg);
            output = '';
            if (this.config.showTimestamp) output += '[' + timestamp + ']';
            if (this.config.prefix !== "") output += ' ' + this.config.prefix;
            output += ' (' + levelName + ') ';
            output += msg;
            args.unshift(output);
            return cc.log(...args);
        } else {
            return -1;
        }
    };

    error(...params) {
        var args, msg;
        msg = params[0];
        args = 2 <= params.length ? params.slice(1) : [];
        args.unshift(msg, 'error');
        return this._log(args);
    };

    info(...params) {
        var args, msg;
        msg = params[0];
        args = 2 <= params.length ? params.slice(1) : [];
        args.unshift(msg, 'info');
        return this._log(args);
    };

    warn(...params) {
        var args, msg;
        msg = params[0];
        args = 2 <= params.length ? params.slice(1) : [];
        args.unshift(msg, 'warning');
        return this._log(args);
    };

    warning(...params) {
        var args, msg;
        msg = params[0];
        args = 2 <= params.length ? params.slice(1) : [];
        args.unshift(msg, 'warning');
        return this._log(args);
    };

    debug(...params) {
        var args, msg;
        msg = params[0];
        args = 2 <= params.length ? params.slice(1) : [];
        args.unshift(msg, 'debug');
        return this._log(args);
    };

    trace(...params) {
        var args, msg;
        msg = params[0];
        args = 2 <= params.length ? params.slice(1) : [];
        args.unshift(msg, 'trace');
        return this._log(args);
    };
}

Logger.levels = {
    error: 1,
    warning: 2,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5
};

export default new Logger;