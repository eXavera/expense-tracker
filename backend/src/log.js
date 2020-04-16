const tracer = require('tracer');
const config = require('../config').logging;

const format = [
    '{{timestamp}} | {{title}}: {{message}}',
    {
        error: '{{timestamp}} | {{title}}: {{message}} (in {{file}}:{{line}})\nCall Stack:\n{{stack}}'
    }
];

function buildFileLogger() {
    return tracer.dailyfile({
        root: config.directory,
        allLogsFileName: 'expense-tracker',
        maxLogFiles: config.maxFiles || 10,
        format
    });
}

function buildConsoleLogger() {
    return tracer.colorConsole({ format });
}

let loggers = [buildConsoleLogger()];
if (config.directory) {
    loggers.push(buildFileLogger());
}

const weight = {
    trace: 0,
    info: 1,
    error: 2
};
const minWeight = weight[config.minLevel || 'trace'];

function log(level, message) {
    if (weight[level] >= minWeight) {
        loggers.forEach(logger => logger[level](message));
    }
}

module.exports = {
    trace: msg => log('trace', msg),
    info: msg => log('info', msg),
    error: msg => log('error', msg)
};
