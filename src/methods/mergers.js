'use strict';

var arg = require('../util').arg;

var methods = {

    merge: function(heightmap, func, maxLength, defaultValue) {
        maxLength    = arg(maxLength, Math.max(this.data.length, heightmap.data.length));
        defaultValue = arg(defaultValue, 0);

        var target = this,
            source = heightmap,
            i;
        for (i = 0; i < maxLength; i++) {
            var targetVal = target.data[i];
            var srcVal    = source.data[i];

            if (targetVal === undefined || targetVal === null) {
                targetVal = defaultValue;
            }

            if (srcVal === undefined || srcVal === null) {
                srcVal = defaultValue;
            }

            target.data[i] = func(targetVal, srcVal, i, target.data, source.data);
        }
        return this;
    },

    /**
     * merge 2 height maps taking the lowest value per coord
     * @method mergeMin
     * @param {1dHeightMap} heightmap
     * @return {1dHeightMap}
     */
    mergeMin: function(heightmap, maxLength, defaultValue) {
        return this.merge(heightmap, function(a, b) {
            return Math.min(a, b);
        }, maxLength, defaultValue);
    },

    /**
     * merge 2 height maps taking the highest value per coord
     * @method mergeMax
     * @param {1dHeightMap} heightmap
     * @return {1dHeightMap}
     */
    mergeMax: function(heightmap, maxLength, defaultValue) {
        return this.merge(heightmap, function(a, b) {
            return Math.max(a, b);
        }, maxLength, defaultValue);
    },
    mergeAdd: function(heightmap, maxLength, defaultValue) {
        return this.merge(heightmap, function(a, b) {
            return a + b;
        }, maxLength, defaultValue);
    },
    mergeSubtract: function(heightmap, maxLength, defaultValue) {
        return this.merge(heightmap, function(a, b) {
            return a - b;
        }, maxLength, defaultValue);
    },
    mergeMultiply: function(heightmap, maxLength, defaultValue) {
        return this.merge(heightmap, function(a, b) {
            return a * b;
        }, maxLength, defaultValue);
    },
    mergeDivide: function(heightmap, maxLength, defaultValue) {
        return this.merge(heightmap, function(a, b) {
            return a / b;
        }, maxLength, defaultValue);
    },
    mergeAverage: function(heightmap, maxLength, defaultValue) {
        return this.merge(heightmap, function(a, b) {
            return (a + b) / 2;
        }, maxLength, defaultValue);
    },
    mergeToScale: function(heightmap, maxLength, defaultValue) {
        var max = this.max();
        return this.merge(heightmap, function(a, b) {
            var heightRatio = a / max;
            return heightRatio * b;
        }, maxLength, defaultValue);
    },
};
module.exports = methods;