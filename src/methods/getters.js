'use strict';
var arg = require('../util').arg;

var methods = {

    /** getters */
    getMin: function() {
        return Math.min.apply(null, this.data);
    },
    getMax: function() {
        return Math.max.apply(null, this.data);
    },
    getRange: function() {
        return this.getMax() - this.getMin();
    },
    getMaxRange: function() {
        return this.maxHeight - this.minHeight;
    },
    getRandomSpacedPositions: function(minSpacing, maxSpacing, includeFirst, includeLast) {
        minSpacing   = arg(minSpacing, this.data.length * 0.1);
        maxSpacing   = arg(maxSpacing, this.data.length * 0.3);
        includeFirst = arg(includeFirst, false);
        includeLast  = arg(includeLast, false);

        minSpacing = Math.max(1, minSpacing);
        maxSpacing = Math.max(1, maxSpacing);

        var positions = [];

        if (includeFirst) {
            positions.push(0);
        }
        var next = this.rngRange(minSpacing, maxSpacing);

        for (var i = 0; i < this.data.length; i++) {
            if (i == next) {
                positions.push(i);
                next = i + this.rngRange(minSpacing, maxSpacing);
            }
        }
        if (includeLast) {
            positions.push(this.data.length - 1);
        }
        return positions;
    },
};
module.exports = methods;

