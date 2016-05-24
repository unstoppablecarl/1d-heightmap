(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.oneDHeightmap = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var factory = function OneDHeightmap(settings) {
    return Object.create(factory.methods).init(settings);
};

factory.defaults = {
    data:      null,
    length:    100,
    minHeight: 1,
    maxHeight: 20,
};

factory.methods = Object.assign(
    {
        factory: factory
    },
    require('./methods/compositions'),
    require('./methods/getters'),
    require('./methods/init'),
    require('./methods/iterators'),
    require('./methods/rng'),
    require('./methods/transformations')
);

module.exports = factory;
},{"./methods/compositions":4,"./methods/getters":5,"./methods/init":6,"./methods/iterators":7,"./methods/rng":8,"./methods/transformations":9}],2:[function(require,module,exports){
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
},{"./1d-heightmap":1,"./util":11}],3:[function(require,module,exports){
'use strict';

var api = {
    create: require('./1d-heightmap'),
    generate: require('./generators'),
    draw: require('./renderer'),
};

module.exports = api;
},{"./1d-heightmap":1,"./generators":2,"./renderer":10}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
'use strict';
var arg = require('../util').arg;

var methods = {

    /** getters */
    getMin: function() {
        return Math.min.apply(null, this.data);
    },
    getMax: function() {
        return Math.max.apply(null, this.data);
    },
    getRange: function() {
        return this.getMax() - this.getMin();
    },
    getMaxRange: function() {
        return this.maxHeight - this.minHeight;
    },
    getRandomSpacedPositions: function(minSpacing, maxSpacing, includeFirst, includeLast) {
        minSpacing   = arg(minSpacing, this.data.length * 0.1);
        maxSpacing   = arg(maxSpacing, this.data.length * 0.3);
        includeFirst = arg(includeFirst, false);
        includeLast  = arg(includeLast, false);

        minSpacing = Math.max(1, minSpacing);
        maxSpacing = Math.max(1, maxSpacing);

        var positions = [];

        if (includeFirst) {
            positions.push(0);
        }
        var next = this.rngRange(minSpacing, maxSpacing);

        for (var i = 0; i < this.data.length; i++) {
            if (i == next) {
                positions.push(i);
                next = i + this.rngRange(minSpacing, maxSpacing);
            }
        }
        if (includeLast) {
            positions.push(this.data.length - 1);
        }
        return positions;
    },
};
module.exports = methods;


},{"../util":11}],6:[function(require,module,exports){
'use strict';

var methods = {
    /**
     * Initialzie 1dHeightmap object.
     * @method init
     * @param {Object} [settings] - Settings object.
     * @param {Number} [settings.length] - Length of height map.
     * @param {Array}  [settings.data] - Length of height map. If set, settings.length is ignored.
     * @param {Number} [settings.minHeight] - Min Height of height map.
     * @param {Number} [settings.maxHeight] - Max Height of height map.
     * @return {Object} Initialized 1dHeightmap object.
     */
    init: function(settings) {

        var s = Object.assign({}, this.factory.defaults, settings);

        this.data = s.data;

        if (!this.data) {
            this.data = [];
            for (var i = 0; i < s.length; i++) {
                this.data[i] = 0;
            }
        }

        this.minHeight = s.minHeight;
        this.maxHeight = s.maxHeight;

        return this;
    },
    copy: function(settings) {
        var srcSettings = {
            data:      [].concat(this.data),
            minHeight: this.minHeight,
            maxHeight: this.maxHeight,
        };

        settings = Object.assign(srcSettings, settings);

        return this.factory(settings);
    },
};
module.exports = methods;

},{}],7:[function(require,module,exports){
'use strict';

var arg = require('../util').arg;

var methods = {
    each: function(func, context) {
        context = arg(context, this);

        this.data.forEach(func, context);
        return this;
    },
    map: function(func, context) {
        return this.copy({
            data: this.data.map(func, context)
        });
    },
    mapEach: function(func, context) {
        context = arg(context, this);

        this.data = this.data.map(func, context);
        return this;
    },
    merge: function(heightmap, func, maxLength) {
        maxLength = arg(maxLength, Math.max(this.data.length, heightmap.data.length));

        var target = this,
            source = heightmap,
            i;
        for (i = 0; i < maxLength; i++) {
            var targetVal = target.data[i];
            var srcVal    = source.data[i];

            target.data[i] = func(targetVal, srcVal, i, target.data, source.data);
        }
        return this;
    },

};
module.exports = methods;

},{"../util":11}],8:[function(require,module,exports){
'use strict';

var methods = {
    rng:      Math.random,
    rngRange: function(min, max) {
        return Math.floor(this.rng() * (max - min + 1)) + min;
    }
};
module.exports = methods;

},{}],9:[function(require,module,exports){
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
            var chunk        = nextIndex - currentIndex;
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
    adjustEvery: function(interval, func) {
        return this.mapEach(function(val, i, arr) {
            if (i % interval === 0) {
                return func(val, i, arr);
            } else {
                return val;
            }
        });
    }

};
module.exports = methods;
},{"../util":11}],10:[function(require,module,exports){
'use strict';


function draw(settings) {
    var defaults = {
        heightmap:   null,
        ctx:         null,
        x:           0,
        y:           0,
        direction:   'up',
        scale:       1,
        columnWidth: 1,
        color:       'rgb(50,100,150)',
        debug:       false,
    };

    var s = Object.assign(defaults, settings)

    var heightmap   = s.heightmap;
    var ctx         = s.ctx;
    var rx          = s.x;
    var ry          = s.y;
    var direction   = s.direction;
    var scale       = s.scale;
    var columnWidth = s.columnWidth;
    var color       = s.color;
    var debug       = s.debug;

    var data = heightmap.data,
        len  = data.length,
        height,
        i,
        x,
        y,
        w,
        h;

    for (i = 0; i < len; i++) {

        height        = Math.round(data[i]);
        ctx.fillStyle = color;
        if (direction === 'up') {
            x = rx + i * columnWidth;
            y = ry + heightmap.maxHeight - height;
            w = columnWidth;
            h = height;
        } else if (direction === 'left') {
            x = rx + heightmap.maxHeight - height;
            y = ry + i * columnWidth;
            w = height;
            h = columnWidth;
        } else if (direction === 'right') {
            x = rx;
            y = ry + i * columnWidth;
            w = height;
            h = columnWidth;
        } else if (direction === 'down') {
            x = rx + i * columnWidth;
            y = ry;
            w = columnWidth;
            h = height;
        }
        ctx.fillRect(
            x * scale,
            y * scale,
            w * scale,
            h * scale
        );

        if (
            debug &&
            heightmap.debugData &&
            heightmap.debugData.generateHill
        ) {
            var debugData = heightmap.debugData.generateHill;

            var absoluteMin = debugData[i].absoluteMin;
            var absoluteMax = debugData[i].absoluteMax;
            var adjustedMin = debugData[i].adjustedMin;
            var adjustedMax = debugData[i].adjustedMax;

            var debugAbsoluteMinColor = 'red';
            var debugAbsoluteMaxColor = 'red';
            var debugAdjustedMinColor = 'orange';
            var debugAdjustedMaxColor = 'orange';

            var dx = x;
            var dy = y;

            if (direction === 'up') {
                dy = ry;

            } else if (direction === 'left') {
                dx = rx;
            } else if (direction === 'right') {
                dx = rx;

            } else if (direction === 'down') {
                dy = ry;
            }

            debugDraw(heightmap, ctx, dx, dy, direction, scale, absoluteMin, debugAbsoluteMinColor);
            debugDraw(heightmap, ctx, dx, dy, direction, scale, absoluteMax, debugAbsoluteMaxColor);
            debugDraw(heightmap, ctx, dx, dy, direction, scale, adjustedMin, debugAdjustedMinColor);
            debugDraw(heightmap, ctx, dx, dy, direction, scale, adjustedMax, debugAdjustedMaxColor);
        }
    }
    return this;
}

function debugDraw(heightmap, ctx, x, y, direction, scale, val, color) {

    var dx = x,
        dy = y;

    if (direction === 'up') {
        dy = y + heightmap.maxHeight - val;

    } else if (direction === 'left') {
        dx = x + heightmap.maxHeight - val;

    } else if (direction === 'right') {
        dx = x + val;

    } else if (direction === 'down') {
        dy = y + val;
    }

    ctx.globalAlpha = 1;
    ctx.fillStyle   = color;
    ctx.fillRect(
        dx * scale,
        dy * scale,
        1 * scale,
        1 * scale
    );
}

module.exports = draw;
},{}],11:[function(require,module,exports){
'use strict';

var arg = function(val, defaultVal) {
    return val !== undefined ? val : defaultVal;
};

module.exports = {
    arg: arg,
};
},{}]},{},[3])(3)
});
//# sourceMappingURL=1d-heightmap.js.map
