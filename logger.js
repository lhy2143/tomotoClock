const path = require("path");
const loggerPath = 'C:\\Users\\liuhy32826\\AppData\\Roaming\\electron-quick-start\\logs';

const DailyRotateFile = require("winston-daily-rotate-file");
const winston = require("winston");
const { createLogger, format } = winston;
const { label, printf, timestamp, errors, combine, simple, splat, json } = format;

const _defaultFormat = printf(({ level, message, timestamp, stack = "" }) => {
    if (typeof message === 'object') {
        message = JSON.stringify(message)
    }
    return `${timestamp} [${level}] ${message} ${stack}`;
});

function customFormat(customformat) {
    return printf((info) => {
        const result = customformat(info);
        if (typeof result === 'object') {
            return JSON.stringify(message)
        } else return result
    });
}

function dailyTransportFactory({ maxSize }) {
    return new DailyRotateFile({
        filename: path.join(loggerPath, 'ucf3-%DATE%'),
        datePattern: "YYYY-MM-DD",
        // zippedArchive: true,
        maxSize,
        maxFiles: "14d",
        extension: '.log',
    });
}

function consoleTransportFactory({ level, format }) {
    return new winston.transports.Console({
        level,
        format
    });
}


function winstonConfigGenerator({ level = 'info', maxSize = "1m", printFormat } = {}) {
    const _printFormat = typeof printFormat === 'function' ? customFormat(printFormat) : _defaultFormat;
    const transports = [
        dailyTransportFactory({ maxSize }),
        process.env.NODE_ENV !== "production" ? consoleTransportFactory({ level, format: _printFormat }) : null,
    ].filter((t) => !!t)


    return {
        level,
        format: combine(
            timestamp({
                format: "YYYY-MM-DD HH:mm:ss",
            }),
            errors({ stack: true }),
            _printFormat
        ),
        // defaultMeta: { service: 'your-service-name' },
        transports,
        exceptionHandlers: [
            new winston.transports.File({ filename: path.join(loggerPath, 'ucf3-exceptions.log'), })
        ],
        // rejectionHandlers: [
        //   new winston.transports.File({ filename: path.join(loggerPath, 'ucf3-rejections.log'), })
        // ]
    };
}

const logger = createLogger(winstonConfigGenerator());


logger.loggerPath = loggerPath;


module.exports = {
    async log(msg, type = "info", ...args) {
        logger.log(type, msg, ...args);
    },
    async info(msg) {
        logger.info(msg);
    },
    async debug(msg) {
        logger.debug(msg);
    },
    async warn(msg) {
        logger.warn(msg);
    },
    async error(msg) {
        logger.error(msg);
    },
    loggerPath,
    //_config={level='warn',maxSize="1m",consoleFormat}
    async config(_config) {
        logger.configure(winstonConfigGenerator(_config));
    },
    async forceUpload() {
        console.log("not support")
    }
};
