const bar = require('../models/bar').Bar;
const event = require('../models/event').Event;

module.exports.estabilishFKs = () => {
    bar.hasMany(event)
};