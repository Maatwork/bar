"use strict";
var bar = require('../models/bar').Bar;
var event = require('../models/event').Event;
module.exports.estabilishFKs = function () {
    bar.hasMany(event);
};
