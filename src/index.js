'use strict';

var api = {
    create: require('./1d-heightmap'),
    generate: require('./generators'),
    draw: require('./renderer'),
};

module.exports = api;