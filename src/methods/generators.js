'use strict';

var arg = require('../util').arg;

var methods = {
    generateArc: function(ratio) {
        ratio = arg(ratio, this.maxHeight / this.data.length);

        return this.mapEach(function(val, i) {
            var radius = this.data.length;
            var r2     = radius * radius;
            var i2     = i * i;
            return (radius - Math.sqrt(r2 - i2)) * ratio;
        });
    },
    generateHill: function(settings) {
        settings = settings || {};
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
            startHeight      = arg(s.startHeight, this.minHeight),
            startTaperMargin = arg(s.startTaperMargin, this.maxHeight * 0.25),
            startTaperHeight,
            startMinTaperHeight,

            endHeight      = arg(s.endHeight, this.minHeight),
            endTaperMargin = arg(s.endTaperMargin, this.maxHeight * 0.25),
            endTaperHeight,
            endMinTaperHeight,

            min               = this.minHeight,
            max               = this.maxHeight,
            length            = this.data.length,
            prevHeight        = startHeight,
            edgeDeflectMargin = s.edgeDeflectMargin,
            variance          = s.variance;

        if (debug) {
            this.debugData              = this.debugData || {};
            this.debugData.generateHill = this.debugData.generateHill || [];
            this.debugData.generateHill[0] = {
                absoluteMin: startHeight,
                absoluteMax: startHeight
            }
        }

        this.data[0] = startHeight;

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
                this.rng() < startTaperRatio - 0.5
            ) {
                height = absoluteMax;
            } else if (
                endTaperRatio !== false &&
                height > absoluteMax &&
                this.rng() < endTaperRatio - 0.5
            ) {
                height = absoluteMax;
            }

            // pull away from absoluteMin, percentOfMargin = (heightRatio * (1 /edgeMargin))
            else if (
                minDeflectRatio !== false &&
                this.rng() < minDeflectRatio
            ) {
                height += variance;
            } else if (
                maxDeflectRatio !== false &&
                this.rng() < maxDeflectRatio
            ) {
                height -= variance;
            }
            // random deviation
            else if (this.rng() < s.deviationChance) {
                height = this.rng() * (adjustedMax - adjustedMin) + adjustedMin;
            }

            this.data[i] = height;

            if (debug) {
                this.debugData.generateHill[i] = {
                    adjustedMin: adjustedMin,
                    adjustedMax: adjustedMax,
                    absoluteMin: absoluteMin,
                    absoluteMax: absoluteMax
                };
            }

            prevHeight = this.data[i];
        }
        if (s.endHeight) {
            this.data[this.data.length - 1] = s.endHeight;
        }
        return this;
    },
};
module.exports = methods;