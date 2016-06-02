'use strict';

var arg = require('./util').arg;

var rng = Math.random;

var float = function() {
    return rng();
};

var range = function(min, max) {
    return Math.floor(rng() * (max - min + 1)) + min;
};

var spacedIndexes = function(length, minSpacing, maxSpacing, includeFirstAndLast) {
    minSpacing          = arg(minSpacing, length * 0.1);
    maxSpacing          = arg(maxSpacing, length * 0.3);
    includeFirstAndLast = arg(includeFirstAndLast, true);

    minSpacing = Math.max(1, minSpacing);
    maxSpacing = Math.max(1, maxSpacing);

    var indexes = [];

    var next = range(minSpacing, maxSpacing);

    for (var i = 0; i < length; i++) {
        if (i == next) {
            indexes.push(i);
            next = i + range(minSpacing, maxSpacing);
        }
    }

    if (includeFirstAndLast) {
        indexes = [0].concat(indexes, [length - 1]);
    }

    return indexes;
};

var minMaxRangeValue = function(array, value, weight) {
    weight = arg(weight, 1);

    var minVal = Math.min.apply(null, array);
    var maxVal = Math.max.apply(null, array);

    var min = (minVal + value * weight) / (1 + weight);
    var max = (maxVal + value * weight) / (1 + weight);
    return range(min, max);
};

var methods = {
    set: function(newRng) {
        rng = newRng;
    },
    float:            float,
    range:            range,
    spacedIndexes:    spacedIndexes,
    minMaxRangeValue: minMaxRangeValue,
};

module.exports = methods;
