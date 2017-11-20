const winston = require('winston'),
    expressWinston = require('express-winston');
require('winston-daily-rotate-file');
require('winston-telegram').Telegram;

winston.add(winston.transports.Telegram, {
    token : '471142868:AAEh8kpcUsZXQR2mfwjKNmKxvtUUZ3JOVk4',
    chatId : '-212841224',
    level : 'error',
    unique : true
});
winston.add(winston.transports.Telegram, {
    name: 'info logger',
    token : '471142868:AAEh8kpcUsZXQR2mfwjKNmKxvtUUZ3JOVk4',
    chatId : '-212841224',
    level : 'info',
    unique : true,
    disableNotification: true
});

module.exports.getErrorLogger = expressWinston.errorLogger({
    transports: [
        new winston.transports.DailyRotateFile({
            filename: './error.log',
            datePattern: 'yyyy-MM-dd.',
            prepend: true,
            json: false,
            colorize: false,
        })
    ]
});

module.exports.getRequestLogger = expressWinston.logger({
    transports: [
        new winston.transports.Console({
            json: false,
            colorize: true,
            level: "debug"

        }),
        new winston.transports.DailyRotateFile({
            filename: './debug.log',
            datePattern: 'yyyy-MM-dd.',
            prepend: true,
            json: false,
            colorize: false,
            level: "debug"
        })
    ],
    meta: true,
    level: "debug",
    msg: "HTTP {{req.method}} {{res.statusCode}} {{req.url}} {{res.responseTime}}ms", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: false,
    colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
});

module.exports.log = (level: String, message: String) => {
    winston.log(level, message);
};