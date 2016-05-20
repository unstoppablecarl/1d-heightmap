'use strict';

var methods = {
    rng:      Math.random,
    rngRange: function(min, max) {
        return Math.floor(this.rng() * (max - min + 1)) + min;
    }
};
module.exports = methods;
