'use strict';

var api = {
    create:      require('./1d-heightmap'),
    generate:    require('./generators'),
    draw:        require('./renderer'),
    rng:         require('./rng'),
    interpolate: require('./interpolators')
};

module.exports = api;