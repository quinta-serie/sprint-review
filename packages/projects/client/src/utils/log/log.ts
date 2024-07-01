type TLog = 'info' | 'warn' | 'error' | 'debug' | 'log';

class Logger {
    public log = this.bind('log');
    public info = this.bind('info');
    public warn = this.bind('warn');
    public error = this.bind('error');
    public debug = this.bind('debug');

    private bind(method: TLog) {
        return console[method].bind(console);
    }
}

export default new Logger();