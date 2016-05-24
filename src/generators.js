'use strict';

var arg           = require('./util').arg;
var oneDHeightmapFactory = require('./1d-heightmap');

var generators = {
    /**
     * Create 1dHeightmap object with random data.
     * @method random
     * @param {Object} [settings] - Settings object.
     * @param {Number} [settings.length] - Length of height map.
     * @param {Array}  [settings.data] - Length of height map. If set, settings.length is ignored.
     * @param {Number} [settings.minHeight] - Min Height of height map.
     * @param {Number} [settings.maxHeight] - Max Height of height map.
     * @param {Number} [settings.startHeight] - Height of first value.
     * @param {Number} [settings.endHeight] - Height of last value.
     * @return {Object} Initialized 1dHeightmap object.
     */
    random: function(settings) {

        var hm = oneDHeightmapFactory(settings);

        var defaults = {
            startHeight: undefined,
            endHeight:   undefined,
        };

        var s = Object.assign({}, defaults, settings);

        hm.mapEach(function(val, i) {
            return hm.rngRange(hm.minHeight, hm.maxHeight);
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
    * @param {Number} [settings.minHeight] - Min Height of height map.
    * @param {Number} [settings.maxHeight] - Max Height of height map.
    * @param {Number} [settings.startHeight] - Height of first value.
    * @param {Number} [settings.endHeight] - Height of last value.
    * @param {Number} [settings.minSpacing] - Min distance between key positions initially created.
    * @param {Number} [settings.maxSpacing] - Max distance between key positions initially created.
    * @param {Function} [settings.interpolateFunc] - Function to interpolate key position data.
    * @return {Object} Initialized 1dHeightmap object.
    */
    perlin: function(settings) {

        var hm = oneDHeightmapFactory(settings);

        var defaults = {
            startHeight: null,
            endHeight:   null,

            minSpacing:      undefined,
            maxSpacing:      undefined,
            interpolateFunc: null,
        };

        var s = Object.assign({}, defaults, settings);

        var startHeight     = s.startHeight;
        var endHeight       = s.endHeight;
        var minSpacing      = arg(s.minSpacing, hm.data.length * 0.1);
        var maxSpacing      = arg(s.maxSpacing, hm.data.length * 0.1);
        var interpolateFunc = s.interpolateFunc;

        var minHeight = hm.minHeight;
        var maxHeight = hm.maxHeight;

        var keyIndexes = hm.getRandomSpacedPositions(minSpacing, maxSpacing, true, true);
        var keyIndexesWithValues = keyIndexes.map(function(index) {
            return {
                index: index,
                value: hm.rngRange(minHeight, maxHeight)
            };
        });

        if (startHeight) {
            keyIndexesWithValues[0] = {
                index: 0,
                value: startHeight,
            };
        }
        if (endHeight) {
            keyIndexesWithValues[keyIndexesWithValues.length - 1] = {
                index: hm.data.length - 1,
                value: endHeight
            };
        }
        var results = [];
        keyIndexesWithValues.forEach(function(item, i) {

            results.push(item.value);

            if (i === keyIndexesWithValues.length - 1) {
                return;
            }

            var nextItem        = keyIndexesWithValues[i + 1];
            var curerntKeyIndex = item.index;
            var nextKeyIndex    = nextItem.index;
            var wavelength      = nextKeyIndex - curerntKeyIndex - 1;
            var a               = item.value;
            var b               = nextItem.value;

            for (var j = 0; j < wavelength; j++) {
                var x               = j / wavelength;
                var interpolatedVal = interpolateFunc(a, b, x);
                results.push(interpolatedVal);
            }
        });

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

            debug: false,
        };

        var s = Object.assign({}, defaults, settings);

        var debug            = s.debug,
            startHeight      = arg(s.startHeight, hm.minHeight),
            startTaperMargin = arg(s.startTaperMargin, hm.maxHeight * 0.25),
            startTaperHeight,
            startMinTaperHeight,

            endHeight      = arg(s.endHeight, hm.minHeight),
            endTaperMargin = arg(s.endTaperMargin, hm.maxHeight * 0.25),
            endTaperHeight,
            endMinTaperHeight,

            min               = hm.minHeight,
            max               = hm.maxHeight,
            length            = hm.data.length,
            prevHeight        = startHeight,
            edgeDeflectMargin = s.edgeDeflectMargin,
            variance          = s.variance;

        if (debug) {
            hm.debugData                 = hm.debugData || {};
            hm.debugData.generateHill    = hm.debugData.generateHill || [];
            hm.debugData.generateHill[0] = {
                absoluteMin: startHeight,
                absoluteMax: startHeight
            }
        }

        hm.data[0] = startHeight;

        var startSlope    = ((max - startHeight) / startTaperMargin),
            startMinSlope = (startHeight / startTaperMargin) * -1,
            endSlope      = ((max - endHeight) / endTaperMargin),
            endMinSlope   = (endHeight / endTaperMargin) * -1;

        for (var i = 1; i < length; i++) {
            var distanceFromEdge = false,
                startTaperRatio  = false,
                endTaperRatio    = false,
                minDeflectRatio  = false,
                maxDeflectRatio  = false,
                absoluteMin      = min,
                absoluteMax      = max;

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


            var adjustedMin = Math.max(lowVariance, absoluteMin),
                adjustedMax = Math.min(highVariance, absoluteMax);

            var height = prevHeight;

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
                hm.rng() < startTaperRatio - 0.5
            ) {
                height = absoluteMax;
            } else if (
                endTaperRatio !== false &&
                height > absoluteMax &&
                hm.rng() < endTaperRatio - 0.5
            ) {
                height = absoluteMax;
            }

            // pull away from absoluteMin, percentOfMargin = (heightRatio * (1 /edgeMargin))
            else if (
                minDeflectRatio !== false &&
                hm.rng() < minDeflectRatio
            ) {
                height += variance;
            } else if (
                maxDeflectRatio !== false &&
                hm.rng() < maxDeflectRatio
            ) {
                height -= variance;
            }
            // random deviation
            else if (hm.rng() < s.deviationChance) {
                height = hm.rng() * (adjustedMax - adjustedMin) + adjustedMin;
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

module.exports = generators;