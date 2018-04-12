'use strict';

var util               = require('./util');
var arg                = util.arg;
var arrayFilterIndexes = util.arrayFilterIndexes;
var arraySum           = util.arraySum;

var rng = Math.random;

function randomBool() {
    return rng() > 0.5;
}

function arrayMin(arr) {
    return Math.min.apply(null, arr);
}

function arrayMax(arr) {
    return Math.max.apply(null, arr);
}

function randomFloat() {
    return rng();
}

function randomRangeInt(min, max) {
    return Math.floor(rng() * (max - min + 1)) + min;
}

function randomRangeFloat(min, max) {
    return rng() * (max - min) + min;
}

function minMaxRangeValue(array, value, weight) {
    weight = arg(weight, 1);
    value *= weight;

    var minVal = arrayMin(array);
    var maxVal = arrayMax(array);

    var min = (minVal + value) / (1 + weight);
    var max = (maxVal + value) / (1 + weight);

    return randomRangeInt(min, max);
}

function randomArrayIndex(arr) {
    return randomRangeInt(0, arr.length - 1);
}

function randomArrayValue(arr) {
    return arr[randomArrayIndex(arr)];
}

function randomArrayIndexValue(arr, func) {

    var index = randomArrayIndex(arr);
    return {
        index: index,
        value: arr[index]
    };
}

function randomFilteredArrayIndex(arr, func) {
    var validIndexes = arrayFilterIndexes(arr, func);
    if (!validIndexes.length) {
        return false;
    }
    return randomArrayValue(validIndexes);
}

function randomFilteredArrayValue(arr, func) {
    var filtered = arr.filter(func);
    if (!filtered.length) {
        return false;
    }
    return randomArrayValue(filtered);
}

function randomFilteredArrayIndexValue(arr, func) {

    var filtered = [];

    arr.forEach(function(val, i, data) {
        if (func(val, i, data)) {
            filtered.push({
                index: i,
                value: val,
            });
        }
    });

    return randomArrayValue(filtered);
}

function randomSpacedIndexes(length, minSpacing, maxSpacing) {
    var min = Math.round(minSpacing);
    var max = Math.round(maxSpacing);

    var chunkSizes = getChunkSizes(length, min, max);
    var sum        = arraySum(chunkSizes);

    if (sum < length || hasInvalidChunkSizes(chunkSizes, min, max)) {
        chunkSizes = distribute(chunkSizes, min, max, length);
    }

    var indexes = chunkSizesToIndexes(chunkSizes);

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
            var chunkSize = randomRangeInt(min, max);
            chunkSize = Math.min(remaining, chunkSize);

            remaining -= chunkSize;
            chunks.push(chunkSize);
        }

        return chunks;
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

    function chunkSizesToIndexes(chunkSizes) {
        var d       = 0;
        var indexes = chunkSizes.map(function(val) {
            d += val;
            return d - 1;
        });

        indexes = [0].concat(indexes);
        return indexes;
    }
}

var methods = {
    set: function(newRng) {
        rng = newRng;
    },
    bool:       randomBool,
    float:      randomFloat,
    range:      randomRangeFloat,
    rangeFloat: randomRangeFloat,
    rangeInt:   randomRangeInt,

    spacedIndexes:    randomSpacedIndexes,
    minMaxRangeValue: minMaxRangeValue,

    arrayIndex:      randomArrayIndex,
    arrayValue:      randomArrayValue,
    arrayIndexValue: randomArrayIndexValue,

    filteredArrayIndex:      randomFilteredArrayIndex,
    filteredArrayValue:      randomFilteredArrayValue,
    filteredArrayIndexValue: randomFilteredArrayIndexValue,

};

module.exports = methods;