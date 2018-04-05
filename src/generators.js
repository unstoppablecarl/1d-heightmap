'use strict';

var arg                  = require('./util').arg;
var oneDHeightmapFactory = require('./1d-heightmap');
var rng                  = require('./rng');
var random               = rng.float;
var randomRange          = rng.range;
var randomRangeInt       = rng.rangeInt;
var randomSpacedIndexes  = rng.spacedIndexes;

var interpolate = require('./interpolators');

var generators = {

    /**
     * Create 1dHeightmap object with random data.
     * @method random
     * @param {Object} [settings] - Settings object.
     * @param {Number} [settings.length] - Length of height map.
     * @param {Array}  [settings.data] - Length of height map. If set, settings.length is ignored.
     * @param {Number} [settings.min] - Min Height of height map.
     * @param {Number} [settings.max] - Max Height of height map.
     * @param {Number} [settings.startHeight] - Height of first value.
     * @param {Number} [settings.endHeight] - Height of last value.
     * @return {Object} Initialized 1dHeightmap object.
     */
    random: function(settings) {

        var hm = oneDHeightmapFactory(settings);

        var defaults = {
            startHeight: undefined,
            endHeight:   undefined,
            min:         0,
            max:         100,
        };

        var s = Object.assign({}, defaults, settings);

        hm.mapEach(function(val, i) {
            return randomRangeInt(s.min, s.max);
        });

        if (s.startHeight) {
            hm.data[0] = s.startHeight;
        }
        if (s.endHeight) {
            hm.data[hm.data.length - 1] = s.endHeight;
        }
        return hm;
    },

    /**
    * Create 1dHeightmap object with random data.
    * @method random
    * @param {Object} [settings] - Settings object.
    * @param {Number} [settings.length] - Length of height map.
    * @param {Array}  [settings.data] - Length of height map. If set, settings.length is ignored.
    * @param {Number} [settings.min] - Min Height of height map.
    * @param {Number} [settings.max] - Max Height of height map.
    * @param {Number} [settings.startHeight] - Height of first value.
    * @param {Number} [settings.endHeight] - Height of last value.
    * @param {Number} [settings.minSpacing] - Min distance between key positions initially created.
    * @param {Number} [settings.maxSpacing] - Max distance between key positions initially created.
    * @param {Function} [settings.interpolator] - Function to interpolate key position data.
    * @return {Object} Initialized 1dHeightmap object.
    */
    perlin: function(settings) {

        var hm       = oneDHeightmapFactory(settings);
        var defaults = {
            interpolator: interpolate.sin,
        };

        var s = Object.assign({}, defaults, settings);

        var interpolator = s.interpolator;

        var keyIndexes = this.keyIndexes(settings);
        var results    = this.interpolateKeyIndexes(keyIndexes, interpolator);

        hm.data = results;

        return hm;
    },


    rough: function(settings) {
        var hm = oneDHeightmapFactory(settings);

        var defaults = {
            // height that the height map will start at
            startHeight: 1,
            // height that the map will end at
            endHeight: 1,

            variance:          3,
            edgeDeflectMargin: 0.25,
            deviationChance:   0.6,
            // distance at which the height starts tapering to the endHeight
            endTaperMargin: undefined,

            // distance at which the height starts tapering to the startHeight
            startTaperMargin: undefined,
            min:              0,
            max:              100,
            debug:            false,
        };

        var s   = Object.assign({}, defaults, settings);
        var min = s.min;
        var max = s.max;

        var debug            = s.debug;
        var startHeight      = arg(s.startHeight, min);
        var startTaperMargin = arg(s.startTaperMargin, max * 0.25);
        var startTaperHeight;
        var startMinTaperHeight;

        var endHeight      = arg(s.endHeight, min);
        var endTaperMargin = arg(s.endTaperMargin, max * 0.25);
        var endTaperHeight;
        var endMinTaperHeight;

        var length            = hm.data.length;
        var prevHeight        = startHeight;
        var edgeDeflectMargin = s.edgeDeflectMargin;
        var variance          = s.variance;

        if (debug) {
            hm.debugData                 = hm.debugData || {};
            hm.debugData.generateHill    = hm.debugData.generateHill || [];
            hm.debugData.generateHill[0] = {
                absoluteMin: startHeight,
                absoluteMax: startHeight
            }
        }

        hm.data[0] = startHeight;

        var startSlope    = ((max - startHeight) / startTaperMargin);
        var startMinSlope = (startHeight / startTaperMargin) * -1;
        var endSlope      = ((max - endHeight) / endTaperMargin);
        var endMinSlope   = (endHeight / endTaperMargin) * -1;

        for (var i = 1; i < length; i++) {
            var distanceFromEdge = false;
            var startTaperRatio  = false;
            var endTaperRatio    = false;
            var minDeflectRatio  = false;
            var maxDeflectRatio  = false;
            var absoluteMin      = min;
            var absoluteMax      = max;

            if (i < startTaperMargin) {
                distanceFromEdge = i;
                startTaperRatio  = (i / startTaperMargin);
                startTaperHeight = (startSlope * distanceFromEdge) + startHeight;
                absoluteMax      = startTaperHeight;

                startMinTaperHeight = (startMinSlope * distanceFromEdge) + startHeight;
                absoluteMin         = startMinTaperHeight;
            } else if (i > length - endTaperMargin) {
                distanceFromEdge = length - i;
                endTaperRatio    = ((length - i) / endTaperMargin);
                endTaperHeight   = (endSlope * distanceFromEdge) + endHeight;
                absoluteMax      = endTaperHeight;

                endMinTaperHeight = (endMinSlope * distanceFromEdge) + endHeight;
                absoluteMin       = endMinTaperHeight;
            }

            var lowVariance  = prevHeight - variance,
                highVariance = prevHeight + variance;

            if (lowVariance < absoluteMin) {
                highVariance += absoluteMin - lowVariance;
            }

            var adjustedMin = Math.max(lowVariance, absoluteMin);
            var adjustedMax = Math.min(highVariance, absoluteMax);
            var height      = prevHeight;
            var heightRatio = (height - absoluteMin) / (absoluteMax - absoluteMin);

            // pull away from edges
            if (heightRatio < edgeDeflectMargin) {
                minDeflectRatio = 1 - (heightRatio * (1 / edgeDeflectMargin));
            } else if (heightRatio > 1 - edgeDeflectMargin) {
                maxDeflectRatio = ((heightRatio - edgeDeflectMargin) * (1 / edgeDeflectMargin));
            }

            // pull toward start/end height
            if (
                startTaperRatio !== false &&
                height > absoluteMax &&
                random() < startTaperRatio - 0.5
            ) {
                height = absoluteMax;
            } else if (
                endTaperRatio !== false &&
                height > absoluteMax &&
                random() < endTaperRatio - 0.5
            ) {
                height = absoluteMax;
            }

            // pull away from absoluteMin, percentOfMargin = (heightRatio * (1 /edgeMargin))
            else if (
                minDeflectRatio !== false &&
                random() < minDeflectRatio
            ) {
                height += variance;
            } else if (
                maxDeflectRatio !== false &&
                random() < maxDeflectRatio
            ) {
                height -= variance;
            }
            // random deviation
            else if (random() < s.deviationChance) {
                height = randomRangeInt(adjustedMin, adjustedMax);
            }

            hm.data[i] = height;

            if (debug) {
                hm.debugData.generateHill[i] = {
                    adjustedMin: adjustedMin,
                    adjustedMax: adjustedMax,
                    absoluteMin: absoluteMin,
                    absoluteMax: absoluteMax
                };
            }

            prevHeight = hm.data[i];
        }
        if (s.endHeight) {
            hm.data[hm.data.length - 1] = s.endHeight;
        }

        return hm;
    },
};

Object.assign(generators, require('./key-indexes'));
module.exports = generators;