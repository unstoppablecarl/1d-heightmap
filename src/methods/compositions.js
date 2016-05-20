'use strict';
var methods = {

    /**
     * merge 2 height maps taking the lowest value per coord
     * @method mergeMin
     * @param {1dHeightMap} heightmap
     * @return {1dHeightMap}
     */
    mergeMin: function(heightmap) {
        return this.merge(heightmap, function(a, b) {
            return Math.min(a, b);
        });
    },

    /**
     * merge 2 height maps taking the highest value per coord
     * @method mergeMax
     * @param {1dHeightMap} heightmap
     * @return {1dHeightMap}
     */
    mergeMax: function(heightmap) {
        return this.merge(heightmap, function(a, b) {
            return Math.max(a, b);
        });
    },
    mergeAdd: function(heightmap) {
        return this.merge(heightmap, function(a, b) {
            return a + b;
        });
    },
    mergeSubtract: function(heightmap) {
        return this.merge(heightmap, function(a, b) {
            return a - b;
        });
    },
    mergeMultiply: function(heightmap) {
        return this.merge(heightmap, function(a, b) {
            return a * b;
        });
    },
    mergeDivide: function(heightmap) {
        return this.merge(heightmap, function(a, b) {
            return a / b;
        });
    },

    mergeToScale: function(heightmap) {
        return this.merge(heightmap, function(a, b) {
            var heightRatio = a / this.maxHeight;
            return heightRatio * b;
        });
    },
};
module.exports = methods;