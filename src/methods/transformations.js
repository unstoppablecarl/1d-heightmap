'use strict';
var arg = require('../util').arg;

var rng                 = require('../rng');
var random              = rng.float;
var randomRange         = rng.range;
var randomSpacedIndexes = rng.spacedIndexes;

var methods = {
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
    scaleToHeight: function(maxHeight) {
        var ratio = maxHeight / this.max();
        return this.multiply(ratio);
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

        var data = this.data,
            i,
            prev = data[0];
        for (i = 1; i < data.length - 1; i++) {
            var current = data[i],
                next    = data[i + 1],
                total   = 2 + weight;
            current = current * weight;
            data[i] = (prev + current + next) / total;
            prev    = current;
        }
        return this;
    },
    /** RNG transforms */
    weightedRatioAdjustment: function(height, variance, ratioWeight, func) {
        height      = arg(height, this.max() * 0.1);
        ratioWeight = arg(ratioWeight, 1);
        variance = arg(variance, 0.33);

        return this.mapEach(function(height, i, data) {
            var ratio      = (height / this.max()) * ratioWeight;
            var randomVariance = random() * variance;
            var percent    = (randomVariance + ratio) / (1 + ratioWeight);
            var adjustment = (percent * height);
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
                var newVal = val + random() * (maxLength - minLength) + minLength;
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
            var heightRatio    = val / this.max();
            var frequencyTotal = 1 + frequencyHeightRatioWeight;
            var finalChance    = (frequency + heightRatio * frequencyHeightRatioWeight) / frequencyTotal;

            if (random() < finalChance) {
                var varianceTotal = 1 + percentVarianceHeightRatioWeight,
                    finalVariance = (percentVariance + heightRatio * percentVarianceHeightRatioWeight) / varianceTotal;

                var newVal = val + random() * (this.max() * finalVariance);
                return newVal;
            }
            return val;
        });
    },
    distort: function(variance) {
        variance = arg(variance, 0.2 * this.max());

        return this.mapEach(function(val) {
            return val + (random() * variance) - variance * 0.5;
        });
    },
    adjustRandomSpacedPositions: function(minSpacing, maxSpacing, func) {
        var indexes = randomSpacedIndexes(this.data.length, minSpacing, maxSpacing);
        indexes.forEach(function(i) {
            this.data[i] = func(this.data[i], i, this.data);
        }, this);
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
    turbulence: function(){
        // if (
        //         minDeflectRatio !== false &&
        //         random() < minDeflectRatio
        //     ) {
        //         height += variance;
        //     } else if (
        //         maxDeflectRatio !== false &&
        //         random() < maxDeflectRatio
        //     ) {
        //         height -= variance;
        //     }
        //       var lowVariance  = prevHeight - variance,
        //         highVariance = prevHeight + variance;
    }

};
module.exports = methods;