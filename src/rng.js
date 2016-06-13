'use strict';

var util               = require('./util');
var arg                = util.arg;
var arrayFilterIndexes = util.arrayFilterIndexes;
var arraySum           = util.arraySum;

var rng = Math.random;

var randomFloat = function() {
    return rng();
};

var randomRange = function(min, max) {
    return Math.floor(rng() * (max - min + 1)) + min;
};

var minMaxRangeValue = function(array, value, weight) {
    weight = arg(weight, 1);

    var minVal = Math.min.apply(null, array);
    var maxVal = Math.max.apply(null, array);

    var min = (minVal + value * weight) / (1 + weight);
    var max = (maxVal + value * weight) / (1 + weight);
    return randomRange(min, max);
};

var randomArrayValue = function(arr) {
    return arr[randomRange(0, arr.length - 1)];
};

var randomFilteredArrayIndex = function(arr, func) {
    var validIndexes = arrayFilterIndexes(arr, func);
    if (!validIndexes.length) {
        return false;
    }

    return randomArrayValue(validIndexes);
}

var randomSpacedIndexes = function(length, minSpacing, maxSpacing) {
    var min = Math.round(minSpacing);
    var max = Math.round(maxSpacing);

    var chunkSizes = getChunkSizes(length, min, max);
    var sum        = arraySum(chunkSizes);

    if (sum < length || hasInvalidChunkSizes(chunkSizes, min, max)) {
        chunkSizes = distribute(chunkSizes, min, max, length);
    }

    var d       = 0;
    var indexes = chunkSizes.map(function(val) {
        d += val;
        return d - 1;
    });

    indexes = [0].concat(indexes);

    return indexes;

    function hasInvalidChunkSizes(arr, min, max) {
        for (var i = 0; i < arr.length; i++) {
            var val = arr[i];
            if (val < min || val > max) {
                return true;
            }
        }
        return false;
    }

    function getChunkSizes(length, min, max) {

        var remaining = length;
        var chunks    = [];

        while (remaining > 0) {
            var chunkSize = randomRange(min, max);
            chunkSize = Math.min(remaining, chunkSize);

            remaining -= chunkSize;
            chunks.push(chunkSize);
        }

        return chunks;
    }

    function distributeFromValid(arr, min, max, length) {
        // start with remaining
        var newIndex = length - arraySum(arr);

        while (arraySum(arr) + newIndex < length) {

            var validIndex = randomFilteredArrayIndex(arr, function(val) {
                return val > min
            });

            if (validIndex === false) {
                break;
            }

            arr[validIndex]--;
            newIndex++;
        }
        // add new index
        arr.push(newIndex);
        return arr;
    }

    function distributeToValid(arr, min, max, length) {

        while (arraySum(arr) < length) {
            var validIndex = randomFilteredArrayIndex(arr, function(val) {
                return val < max;
            });

            if (validIndex === false) {
                break;
            }
            arr[validIndex]++;
        }

        return arr;
    }

    function distribute(arr, min, max, length) {
        var availableToRemove = 0;
        var availableToAdd    = 0;

        // remove invalid
        arr = arr.filter(function(val) {
            return val >= min;
        });

        arr.forEach(function(val, i, data) {
            availableToRemove += val - min;
            availableToAdd += max - val;
        });
        var sum = arraySum(arr);

        var needToAdd              = length - sum;
        var canDistributeFromValid = availableToRemove >= needToAdd;
        var canDistributeToValid   = availableToAdd >= needToAdd;

        var options = [];

        if (canDistributeFromValid) {
            options.push(distributeFromValid);
        }
        if (canDistributeToValid) {
            options.push(distributeToValid);
        }

        if (!options.length) {
            return arr;
        }

        var func = randomArrayValue(options);
        return func(arr, min, max, length);

    }

};


var methods = {
    set: function(newRng) {
        rng = newRng;
    },
    float:              randomFloat,
    range:              randomRange,
    spacedIndexes:      randomSpacedIndexes,
    minMaxRangeValue:   minMaxRangeValue,
    arrayValue:         randomArrayValue,
    filteredArrayIndex: randomFilteredArrayIndex
};

module.exports = methods;