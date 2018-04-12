'use strict';
var util = require('../util');

var arg                = util.arg;
var makeArray          = util.makeArray;
var sliceRelativeRange = util.sliceRelativeRange;
var arrayChunk         = util.arrayChunk;

var rng                    = require('../rng');
var random                 = rng.float;
var randomRangeInt         = rng.rangeInt;
var randomSpacedIndexes    = rng.spacedIndexes;
var randomMinMaxRangeValue = rng.minMaxRangeValue;

var methods = {
    /* adjustments */
    adjustRandomSpacedPositions: function(minSpacing, maxSpacing, includeFirstAndLast, func) {
        var indexes = randomSpacedIndexes(this.data.length, minSpacing, maxSpacing, includeFirstAndLast);
        indexes.forEach(function(i) {
            this.data[i] = func(this.data[i], i, this.data);
        }, this);
        return this;
    },
    adjustEvery: function(interval, func) {
        return this.mapEach(function(val, i, arr) {
            if (i % interval === 0) {
                return func(val, i, arr);
            } else {
                return val;
            }
        });
    },
    adjustBetween: function(startIndex, endIndex, func) {
        var data = this.data;
        for (var i = startIndex; i <= endIndex; i++) {
            data[i] = func(data[i], i, data);
        }
        return this;
    },

    adjustWithPrevNext: function(func) {
        var data = this.data;

        for (var i = 1; i < data.length - 1; i++) {
            var prev    = data[i - 1];
            var current = data[i];
            var next    = data[i + 1];
            data[i] = func(prev, current, next, i, data);
        }
        return this;
    },

    clamp: function(minValue, maxValue) {
        return this.mapEach(function(val) {
            val = Math.min(val, maxValue);
            return Math.max(val, minValue);
        })
    },
    clampMax: function(maxValue) {
        return this.mapEach(function(val) {
            return Math.min(val, maxValue);
        })
    },
    clampMin: function(minValue) {
        return this.mapEach(function(val) {
            return Math.max(val, minValue);
        })
    },

    trimHeight: function() {
        var min = this.min();
        return this.subtract(min);
    },
    add: function(val) {
        return this.mapEach(function(v) {
            return v + val;
        });
    },
    subtract: function(val) {
        return this.mapEach(function(v) {
            return v - val;
        });
    },
    multiply: function(val) {
        return this.mapEach(function(v) {
            return v * val;
        });
    },
    divide: function(val) {
        return this.mapEach(function(v) {
            return v / val;
        });
    },
    scale: function(scale) {
        return this.multiply(scale);
    },
    invert: function() {
        return this.mapEach(function(val) {
            return this.max() - val;
        });
    },
    reverse: function() {
        this.data.reverse();
        return this;
    },
    scaleHeightTo: function(maxHeight) {
        var ratio = maxHeight / this.max();
        return this.multiply(ratio);
    },
    scaleHeightToMinMax: function(minHeight, maxHeight) {
        this.trimHeight();
        this.scaleHeightTo(maxHeight);
        this.add(minHeight);
        
        return this;
    },
    scaleLengthTo: function(newLenght, interpolateFunc) {
        var data      = this.data;
        var percent   = (newLenght - 1) / (data.length - 1);
        var keyPoints = [];

        var prevIndex;
        data.forEach(function(val, index) {

            var newIndex = Math.ceil(index * percent)

            if (newIndex == prevIndex) {
                return;
            }
            keyPoints.push({
                index: newIndex,
                value: val
            });

            prevIndex = newIndex;
        });
        var results = [];
        keyPoints.forEach(function(item, index) {

            results.push(item.value);

            if (index === keyPoints.length - 1) {
                return;
            }

            var nextItem     = keyPoints[index + 1];
            var currentIndex = item.index;
            var nextIndex    = nextItem.index;
            var chunk        = nextIndex - currentIndex - 1;
            var a            = item.value;
            var b            = nextItem.value;

            for (var i = 0; i < chunk; i++) {
                var x      = i / chunk;
                var newVal = interpolateFunc(a, b, x);
                results.push(newVal);
            }
        });

        this.data = results;

        return this;
    },

    smooth: function(weight) {
        weight = arg(weight, 1);
        var total = 2 + weight;

        return this.adjustWithPrevNext(function(prev, current, next) {
            current *= weight;
            return (prev + current + next) / total;
        });
    },

    smoothSlopes: function(weight) {
        weight = arg(weight, 1);

        var total = 2 + weight;

        return this.adjustWithPrevNext(function(prev, current, next) {

            if (
                // slope up
                (prev < current && current < next) ||
                // slope down
                (prev > current && current > next)
            ) {
                return (prev + current + next) / total;
            }

            return current;
        });
    },

    smoothCorners: function() {

        return this.adjustWithPrevNext(function(prev, current, next) {
            var prevR    = Math.round(prev);
            var currentR = Math.round(current);
            var nextR    = Math.round(next);

            if (
                (prevR != nextR) &&
                (currentR == prevR || currentR == nextR)
            ) {
                return (prev + next) / 2;
            }

            return current;
        });
    },

    /** RNG transforms */
    weightedRatioAdjustment: function(height, variance, ratioWeight, func) {
        height      = arg(height, this.max() * 0.1);
        ratioWeight = arg(ratioWeight, 1);
        variance    = arg(variance, 0.33);

        return this.mapEach(function(height, i, data) {
            var ratio          = (height / this.max()) * ratioWeight;
            var randomVariance = random() * variance;
            var percent        = (randomVariance + ratio) / (1 + ratioWeight);
            var adjustment     = percent * height;
            return func(height, adjustment);
        });
    },
    shrink: function(shrinkHeight, variance, shrinkHeightRatioWeight) {
        return this.weightedRatioAdjustment(
            shrinkHeight,
            variance,
            shrinkHeightRatioWeight,
            function(val, adjustment) {
                return val - adjustment;
            }
        );
    },
    grow: function(growHeight, variance, growHeightRatioWeight) {
        return this.weightedRatioAdjustment(
            growHeight,
            variance,
            growHeightRatioWeight,
            function(val, adjustment) {
                return val + adjustment;
            }
        );
    },
    drip: function(minLength, maxLength, chance) {
        minLength = arg(minLength, this.max() * 0.25);
        maxLength = arg(maxLength, this.max() * 0.75);
        chance    = arg(chance, 0.45);

        return this.mapEach(function(val) {
            if (random() < chance) {
                var newVal = val + randomRangeInt(minLength, maxLength);
                return newVal;
            }
            return val;
        });
    },
    dripByHeight: function(frequency, percentVariance, frequencyHeightRatioWeight, percentVarianceHeightRatioWeight) {
        percentVariance                  = arg(percentVariance, 1);
        frequency                        = arg(frequency, 0.45);
        frequencyHeightRatioWeight       = arg(frequencyHeightRatioWeight, 1);
        percentVarianceHeightRatioWeight = arg(percentVarianceHeightRatioWeight, 1);

        return this.mapEach(function(val) {
            var heightRatio = val / this.max();
            var finalChance = (frequency + heightRatio * frequencyHeightRatioWeight) / 1 + frequencyHeightRatioWeight;

            if (random() < finalChance) {
                var varianceTotal = 1 + percentVarianceHeightRatioWeight,
                    finalVariance = (percentVariance + heightRatio * percentVarianceHeightRatioWeight) / varianceTotal;

                var newVal = val + random() * (this.max() * finalVariance);
                return newVal;
            }
            return val;
        });
    },

    /**
     * Smooth with random adjustment
     * @method smoothDistort
     * @param {Number} range - number of indexes before and after each index to take into account.
     * @param {Number} weight - weight of each index value when averaging with min / max
     * @return {[type]}
     */
    distort: function(range, weight) {
        range  = arg(range, 1);
        weight = arg(weight, 1);

        this.mapEach(function(val, i, data) {
            var values = arrayChunk(data, i - range, i + range);
            return randomMinMaxRangeValue(values, val, weight);
        });
        return this;
    },
    distortChunk: function(startIndex, endIndex, weight) {
        var values = arrayChunk(this.data, startIndex, endIndex);

        return this.adjustBetween(startIndex, endIndex, function(val, i, data) {
            return randomMinMaxRangeValue(values, val, weight);
        });
    },
};
module.exports = methods;