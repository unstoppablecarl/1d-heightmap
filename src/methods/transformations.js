'use strict';
var arg = require('../util').arg;

var methods = {
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
            return this.maxHeight - val;
        });
    },
    reverse: function() {
        this.data.reverse();
        return this;
    },
    scaleToNewMaxHeight: function(maxHeight) {
        var ratio = maxHeight / this.getMax();
        return this.multiply(ratio);
    },
    scaleLengthTo: function(newLenght, interpolateFunc) {
        var data      = this.data;
        var percent   = (newLenght - 1) / (data.length - 1);
        var keyPoints = [];

        data.forEach(function(val, index) {
            keyPoints.push({
                index: Math.ceil(index * percent),
                value: val
            });
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
            var chunk        = nextIndex - currentIndex;

            var a = item.value;
            var b = nextItem.value;

            for (var i = 0; i < chunk; i++) {
                var x = i / chunk;
                results.push(interpolateFunc(a, b, x));
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
    weightedRatioAdjustment: function(height, ratioWeight, func) {
        height      = arg(height, this.maxHeight * 0.1);
        ratioWeight = arg(ratioWeight, 1);

        return this.mapEach(function(height, i, data) {
            var ratio      = (height / this.maxHeight) * ratioWeight;
            var percent    = (this.rng() + ratio) / (1 + ratioWeight);
            var adjustment = (percent * height);
            return func(height, adjustment);
        });
    },
    shrink: function(shrinkHeight, shrinkHeightRatioWeight) {
        return this.weightedRatioAdjustment(
            shrinkHeight,
            shrinkHeightRatioWeight,
            function(val, adjustment) {
                return val - adjustment;
            }
        );
    },
    grow: function(growHeight, growHeightRatioWeight) {
        return this.weightedRatioAdjustment(
            growHeight,
            growHeightRatioWeight,
            function(val, adjustment) {
                return val + adjustment;
            }
        );
    },
    drip: function(minLength, maxLength, chance) {
        minLength = arg(minLength, this.maxHeight * 0.25);
        maxLength = arg(maxLength, this.maxHeight * 0.75);
        chance    = arg(chance, 0.45);

        return this.mapEach(function(val) {
            if (this.rng() < chance) {
                var newVal = val + this.rng() * (maxLength - minLength) + minLength;
                return Math.min(this.maxHeight, newVal);
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
            var heightRatio    = val / this.maxHeight;
            var frequencyTotal = 1 + frequencyHeightRatioWeight;
            var finalChance    = (frequency + heightRatio * frequencyHeightRatioWeight) / frequencyTotal;

            if (this.rng() < finalChance) {
                var varianceTotal = 1 + percentVarianceHeightRatioWeight,
                    finalVariance = (percentVariance + heightRatio * percentVarianceHeightRatioWeight) / varianceTotal;

                var newVal = val + this.rng() * (this.maxHeight * finalVariance);
                return Math.min(this.maxHeight, newVal);
            }
            return val;
        });
    },
    distort: function(variance) {
        variance = arg(variance, 0.2 * this.maxHeight);

        return this.mapEach(function(val) {
            return val + (this.rng() * variance) - variance * 0.5;
        });
    },

    adjustRandomSpacedPositions: function(minSpacing, maxSpacing, func) {
        var indexes = this.getRandomSpacedPositions(minSpacing, maxSpacing);
        indexes.forEach(function(i) {
            this.data[i] = func(this.data[i], i, this.data);
        }, this);
    },

};
module.exports = methods;