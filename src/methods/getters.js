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
    getRange: function(){
        return this.getMax() - this.getMin();
    },
    getMaxRange: function(){
        return this.maxHeight - this.minHeight;
    },
    getRandomSpacedPositions: function(minSpacing, maxSpacing) {
        minSpacing = arg(minSpacing, this.data.length * 0.1);
        maxSpacing = arg(maxSpacing, this.data.length * 0.3);

        var positions = [];
        var next      = this.rngRange(minSpacing, maxSpacing);

        for (var i = 0; i < this.data.length; i++) {
            if (i == next) {
                positions.push(i);
                next = i + this.rngRange(minSpacing, maxSpacing);
            }
        }
        return positions;
    },
};
module.exports = methods;

