(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.oneDHeightmap = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.linear = linear;
exports.easeInSine = easeInSine;
exports.easeOutSine = easeOutSine;
exports.easeInOutSine = easeInOutSine;
exports.easeInQuad = easeInQuad;
exports.easeOutQuad = easeOutQuad;
exports.easeInOutQuad = easeInOutQuad;
exports.easeInCubic = easeInCubic;
exports.easeOutCubic = easeOutCubic;
exports.easeInOutCubic = easeInOutCubic;
exports.easeInQuart = easeInQuart;
exports.easeOutQuart = easeOutQuart;
exports.easeInOutQuart = easeInOutQuart;
exports.easeInQuint = easeInQuint;
exports.easeOutQuint = easeOutQuint;
exports.easeInOutQuint = easeInOutQuint;
exports.easeInExpo = easeInExpo;
exports.easeOutExpo = easeOutExpo;
exports.easeInOutExpo = easeInOutExpo;
exports.easeInCirc = easeInCirc;
exports.easeOutCirc = easeOutCirc;
exports.easeInOutCirc = easeInOutCirc;
exports.easeInBack = easeInBack;
exports.easeOutBack = easeOutBack;
exports.easeInOutBack = easeInOutBack;
exports.easeInElastic = easeInElastic;
exports.easeOutElastic = easeOutElastic;
exports.easeInOutElastic = easeInOutElastic;
exports.easeOutBounce = easeOutBounce;
exports.easeInBounce = easeInBounce;
exports.easeInOutBounce = easeInOutBounce;
// Based on https://gist.github.com/gre/1650294

// No easing, no acceleration
function linear(t) {
    return t;
}

// Slight acceleration from zero to full speed
function easeInSine(t) {
    return -1 * Math.cos(t * (Math.PI / 2)) + 1;
}

// Slight deceleration at the end
function easeOutSine(t) {
    return Math.sin(t * (Math.PI / 2));
}

// Slight acceleration at beginning and slight deceleration at end
function easeInOutSine(t) {
    return -0.5 * (Math.cos(Math.PI * t) - 1);
}

// Accelerating from zero velocity
function easeInQuad(t) {
    return t * t;
}

// Decelerating to zero velocity
function easeOutQuad(t) {
    return t * (2 - t);
}

// Acceleration until halfway, then deceleration
function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// Accelerating from zero velocity
function easeInCubic(t) {
    return t * t * t;
}

// Decelerating to zero velocity
function easeOutCubic(t) {
    var t1 = t - 1;
    return t1 * t1 * t1 + 1;
}

// Acceleration until halfway, then deceleration
function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

// Accelerating from zero velocity
function easeInQuart(t) {
    return t * t * t * t;
}

// Decelerating to zero velocity
function easeOutQuart(t) {
    var t1 = t - 1;
    return 1 - t1 * t1 * t1 * t1;
}

// Acceleration until halfway, then deceleration
function easeInOutQuart(t) {
    var t1 = t - 1;
    return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * t1 * t1 * t1 * t1;
}

// Accelerating from zero velocity
function easeInQuint(t) {
    return t * t * t * t * t;
}

// Decelerating to zero velocity
function easeOutQuint(t) {
    var t1 = t - 1;
    return 1 + t1 * t1 * t1 * t1 * t1;
}

// Acceleration until halfway, then deceleration
function easeInOutQuint(t) {
    var t1 = t - 1;
    return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * t1 * t1 * t1 * t1 * t1;
}

// Accelerate exponentially until finish
function easeInExpo(t) {

    if (t === 0) {
        return 0;
    }

    return Math.pow(2, 10 * (t - 1));
}

// Initial exponential acceleration slowing to stop
function easeOutExpo(t) {

    if (t === 1) {
        return 1;
    }

    return -Math.pow(2, -10 * t) + 1;
}

// Exponential acceleration and deceleration
function easeInOutExpo(t) {

    if (t === 0 || t === 1) {
        return t;
    }

    var scaledTime = t * 2;
    var scaledTime1 = scaledTime - 1;

    if (scaledTime < 1) {
        return 0.5 * Math.pow(2, 10 * scaledTime1);
    }

    return 0.5 * (-Math.pow(2, -10 * scaledTime1) + 2);
}

// Increasing velocity until stop
function easeInCirc(t) {

    var scaledTime = t / 1;
    return -1 * (Math.sqrt(1 - scaledTime * t) - 1);
}

// Start fast, decreasing velocity until stop
function easeOutCirc(t) {

    var t1 = t - 1;
    return Math.sqrt(1 - t1 * t1);
}

// Fast increase in velocity, fast decrease in velocity
function easeInOutCirc(t) {

    var scaledTime = t * 2;
    var scaledTime1 = scaledTime - 2;

    if (scaledTime < 1) {
        return -0.5 * (Math.sqrt(1 - scaledTime * scaledTime) - 1);
    }

    return 0.5 * (Math.sqrt(1 - scaledTime1 * scaledTime1) + 1);
}

// Slow movement backwards then fast snap to finish
function easeInBack(t) {
    var magnitude = arguments.length <= 1 || arguments[1] === undefined ? 1.70158 : arguments[1];


    var scaledTime = t / 1;
    return scaledTime * scaledTime * ((magnitude + 1) * scaledTime - magnitude);
}

// Fast snap to backwards point then slow resolve to finish
function easeOutBack(t) {
    var magnitude = arguments.length <= 1 || arguments[1] === undefined ? 1.70158 : arguments[1];


    var scaledTime = t / 1 - 1;

    return scaledTime * scaledTime * ((magnitude + 1) * scaledTime + magnitude) + 1;
}

// Slow movement backwards, fast snap to past finish, slow resolve to finish
function easeInOutBack(t) {
    var magnitude = arguments.length <= 1 || arguments[1] === undefined ? 1.70158 : arguments[1];


    var scaledTime = t * 2;
    var scaledTime2 = scaledTime - 2;

    var s = magnitude * 1.525;

    if (scaledTime < 1) {

        return 0.5 * scaledTime * scaledTime * ((s + 1) * scaledTime - s);
    }

    return 0.5 * (scaledTime2 * scaledTime2 * ((s + 1) * scaledTime2 + s) + 2);
}
// Bounces slowly then quickly to finish
function easeInElastic(t) {
    var magnitude = arguments.length <= 1 || arguments[1] === undefined ? 0.7 : arguments[1];


    if (t === 0 || t === 1) {
        return t;
    }

    var scaledTime = t / 1;
    var scaledTime1 = scaledTime - 1;

    var p = 1 - magnitude;
    var s = p / (2 * Math.PI) * Math.asin(1);

    return -(Math.pow(2, 10 * scaledTime1) * Math.sin((scaledTime1 - s) * (2 * Math.PI) / p));
}

// Fast acceleration, bounces to zero
function easeOutElastic(t) {
    var magnitude = arguments.length <= 1 || arguments[1] === undefined ? 0.7 : arguments[1];


    var p = 1 - magnitude;
    var scaledTime = t * 2;

    if (t === 0 || t === 1) {
        return t;
    }

    var s = p / (2 * Math.PI) * Math.asin(1);
    return Math.pow(2, -10 * scaledTime) * Math.sin((scaledTime - s) * (2 * Math.PI) / p) + 1;
}

// Slow start and end, two bounces sandwich a fast motion
function easeInOutElastic(t) {
    var magnitude = arguments.length <= 1 || arguments[1] === undefined ? 0.65 : arguments[1];


    var p = 1 - magnitude;

    if (t === 0 || t === 1) {
        return t;
    }

    var scaledTime = t * 2;
    var scaledTime1 = scaledTime - 1;

    var s = p / (2 * Math.PI) * Math.asin(1);

    if (scaledTime < 1) {
        return -0.5 * (Math.pow(2, 10 * scaledTime1) * Math.sin((scaledTime1 - s) * (2 * Math.PI) / p));
    }

    return Math.pow(2, -10 * scaledTime1) * Math.sin((scaledTime1 - s) * (2 * Math.PI) / p) * 0.5 + 1;
}

// Bounce to completion
function easeOutBounce(t) {

    var scaledTime = t / 1;

    if (scaledTime < 1 / 2.75) {

        return 7.5625 * scaledTime * scaledTime;
    } else if (scaledTime < 2 / 2.75) {

        var scaledTime2 = scaledTime - 1.5 / 2.75;
        return 7.5625 * scaledTime2 * scaledTime2 + 0.75;
    } else if (scaledTime < 2.5 / 2.75) {

        var _scaledTime = scaledTime - 2.25 / 2.75;
        return 7.5625 * _scaledTime * _scaledTime + 0.9375;
    } else {

        var _scaledTime2 = scaledTime - 2.625 / 2.75;
        return 7.5625 * _scaledTime2 * _scaledTime2 + 0.984375;
    }
}

// Bounce increasing in velocity until completion
function easeInBounce(t) {
    return 1 - easeOutBounce(1 - t);
}

// Bounce in and bounce out
function easeInOutBounce(t) {

    if (t < 0.5) {

        return easeInBounce(t * 2) * 0.5;
    }

    return easeOutBounce(t * 2 - 1) * 0.5 + 0.5;
}

},{}],2:[function(require,module,exports){
'use strict';

var factory = function OneDHeightmap(settings) {
    return Object.create(factory.methods).init(settings);
};

factory.methods = Object.assign(
    {
        factory: factory
    },
    require('./methods/mergers'),
    require('./methods/init'),
    require('./methods/iterators'),
    require('./methods/transformations')
);

module.exports = factory;
},{"./methods/init":8,"./methods/iterators":9,"./methods/mergers":10,"./methods/transformations":11}],3:[function(require,module,exports){
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
},{"./1d-heightmap":2,"./interpolators":5,"./key-indexes":6,"./rng":13,"./util":14}],4:[function(require,module,exports){
'use strict';

var api = {
    create:      require('./1d-heightmap'),
    generate:    require('./generators'),
    draw:        require('./renderer'),
    rng:         require('./rng'),
    interpolate: require('./interpolators')
};

module.exports = api;
},{"./1d-heightmap":2,"./generators":3,"./interpolators":5,"./renderer":12,"./rng":13}],5:[function(require,module,exports){
'use strict';

var easing = require('easing-utils');

var block = function(k) {
    return Math.round(k);
};

var smoothStep = function(x) {
    return x * x * (3 - 2 * x);
};

var makeReversable = function(func1, func2) {
    return function(a, b, x) {
        if (a < b) {
            return a + ((b - a) * func1(x));
        } else {
            return a + ((b - a) * func2(x));
        }
    };
};

var make = function(func) {
    return function(a, b, x) {
        return a + ((b - a) * func(x));
    };
};

var e = easing;

module.exports = {

    linear: make(e.linear),

    block:      make(block),
    smoothStep: make(smoothStep),

    sine:     make(e.easeInOutSine),
    sineDown: makeReversable(e.easeInSine, e.easeOutSine),
    sineUp:   makeReversable(e.easeOutSine, e.easeInSine),

    quad:     make(e.easeInOutQuad),
    quadUp:   makeReversable(e.easeOutQuad, e.easeInQuad),
    quadDown: makeReversable(e.easeInQuad, e.easeOutQuad),

    cubic:     make(e.easeInOutCubic),
    cubicUp:   makeReversable(e.easeOutCubic, e.easeInCubic),
    cubicDown: makeReversable(e.easeInCubic, e.easeOutCubic),

    quart:     make(e.easeInOutQuart),
    quartUp:   makeReversable(e.easeOutQuart, e.easeInQuart),
    quartDown: makeReversable(e.easeInQuart, e.easeOutQuart),

    quint:     make(e.easeInOutQuint),
    quintUp:   makeReversable(e.easeOutQuint, e.easeInQuint),
    quintDown: makeReversable(e.easeInQuint, e.easeOutQuint),

    expo:     make(e.easeInOutExpo),
    expoUp:   makeReversable(e.easeOutExpo, e.easeInExpo),
    expoDown: makeReversable(e.easeInExpo, e.easeOutExpo),

    circ:     make(e.easeInOutCirc),
    circUp:   makeReversable(e.easeOutCirc, e.easeInCirc),
    circDown: makeReversable(e.easeInCirc, e.easeOutCirc),

};
},{"easing-utils":1}],6:[function(require,module,exports){
'use strict';

var arg                  = require('../util').arg;
var oneDHeightmapFactory = require('../1d-heightmap');
var rng                  = require('../rng');
var random               = rng.float;
var randomRange          = rng.range;
var randomRangeInt       = rng.rangeInt;
var randomSpacedIndexes  = rng.spacedIndexes;

var interpolators       = require('../interpolators');
var math                = require('../math');
var getDistance         = math.getDistance;
var getNormalizedVector = math.getNormalizedVector;

module.exports = {
    keyIndexes:                createKeyIndexes,
    fromKeyIndexes:            fromKeyIndexes,
    interpolateKeyIndexes:     interpolateKeyIndexes,
    addKeyIndexes:             addKeyIndexes,
    addDisplacementKeyIndexes: addDisplacementKeyIndexes,
}

function createKeyIndexes(settings) {
    var defaults = {
        length:      null,
        startHeight: undefined,
        endHeight:   undefined,

        minSpacing:   undefined,
        maxSpacing:   undefined,
        interpolator: null,
        min:          0,
        max:          100,
        minSlope:     undefined,
        maxSlope:     undefined,
    };

    var s = Object.assign({}, defaults, settings);

    var length      = s.length;
    var startHeight = s.startHeight;
    var endHeight   = s.endHeight;
    var minSpacing  = arg(s.minSpacing, length * 0.1);
    var maxSpacing  = arg(s.maxSpacing, length * 0.1);
    var minHeight   = s.min;
    var maxHeight   = s.max;
    var minSlope    = s.minSlope;
    var maxSlope    = s.maxSlope;

    var keyIndexes = randomSpacedIndexes(length, minSpacing, maxSpacing);

    var prev;

    var out = keyIndexes.map(function(index, i, data) {
        var value;

        if (i === 0 && startHeight !== undefined) {
            value = startHeight;
        } else {
            value = getValue(prev, index, minHeight, maxHeight, minSlope, maxSlope);
        }

        var result = {
            index: index,
            value: value,
        };

        prev = result;

        return result;
    });

    if (endHeight !== undefined) {
        out[out.length - 1].value = endHeight;
    }

    return out;
}

function getValue(prev, index, minHeight, maxHeight, minSlope, maxSlope) {
    var min = minHeight;
    var max = maxHeight;

    if (prev !== undefined) {

        var prevVal  = prev.value;
        var distance = index - prev.index;

        if (minSlope !== undefined) {
            min = Math.max(min, prevVal + (distance * minSlope));
        }

        if (maxSlope !== undefined) {
            max = Math.min(max, prevVal + (distance * maxSlope));
        }
    }

    return randomRangeInt(min, max);
}

function interpolateKeyIndexes(keyIndexes, interpolator) {
    var results = [];
    interpolator = arg(interpolator, interpolators.linear);

    keyIndexes.forEach(function(item, i) {

        results.push(item.value);

        var next = keyIndexes[i + 1];

        if (!next) {
            return;
        }
        var curerntKeyIndex = item.index;
        var nextKeyIndex    = next.index;
        var wavelength      = Math.abs(nextKeyIndex - curerntKeyIndex - 1);
        var a               = item.value;
        var b               = next.value;

        for (var j = 0; j < wavelength; j++) {
            var x               = j / wavelength;
            var interpolatedVal = interpolator(a, b, x);
            results.push(interpolatedVal);
        }
    });

    return results;
}

function fromKeyIndexes(keyIndexes, interpolator) {
    return oneDHeightmapFactory({
        data: this.interpolateKeyIndexes(keyIndexes, interpolator)
    });
}


function addKeyIndexes(settings) {
    var defaults = {
        keyIndexes: null,

        // position on line determined by percent of distance between points
        posRatioMin: 0.33,
        posRatioMax: 0.66,

        // distance from pos on line determined by percent of distance between points
        distRatioMin: 0.1,
        distRatioMax: 0.2,

        // absolute min / max distance
        distMin: undefined,
        distMax: undefined,

        direction:     undefined,
        upDirection:   undefined,
        downDirection: undefined,

        upPosRatioMin:   undefined,
        upPosRatioMax:   undefined,
        downPosRatioMin: undefined,
        downPosRatioMax: undefined,

        upDistRatioMin:   undefined,
        upDistRatioMax:   undefined,
        downDistRatioMin: undefined,
        downDistRatioMax: undefined,
    };

    var s = Object.assign({}, defaults, settings);

    var keyIndexes = s.keyIndexes;

    var result = [];

    keyIndexes.forEach(function(item, i, data) {
        var next = data[i + 1];

        if (!next) {
            result.push(item);
            return;
        }

        var splitSettings = Object.assign({
            left:  item,
            right: next,
        }, settings);

        var add = splitKeyIndexes(splitSettings);

        result.push(item);
        result.push(add);

    });

    return result;

}

function splitKeyIndexes(settings) {
    var defaults = {
        left:  null,
        right: null,

        // position on line determined by percent of distance between points
        posRatioMin: 0.33,
        posRatioMax: 0.66,

        // distance from pos on line determined by percent of distance between points
        distRatioMin: 0.1,
        distRatioMax: 0.2,

        // absolute min / max distance
        distMin: undefined,
        distMax: undefined,

        direction:     undefined,
        upDirection:   undefined,
        downDirection: undefined,

        upPosRatioMin:   undefined,
        upPosRatioMax:   undefined,
        downPosRatioMin: undefined,
        downPosRatioMax: undefined,

        upDistRatioMin:   undefined,
        upDistRatioMax:   undefined,
        downDistRatioMin: undefined,
        downDistRatioMax: undefined,
    };

    var s = Object.assign({}, defaults, settings);

    var left  = s.left;
    var right = s.right;

    var slopeUp = left.value < right.value;

    var posRatioMin  = s.posRatioMin;
    var posRatioMax  = s.posRatioMax;
    var distRatioMin = s.distRatioMin;
    var distRatioMax = s.distRatioMax;
    var direction    = s.direction;
    var distMin      = s.distMin;
    var distMax      = s.distMax;

    if (slopeUp) {

        posRatioMin  = arg(s.upPosRatioMin, posRatioMin);
        posRatioMax  = arg(s.upPosRatioMax, posRatioMax);
        distRatioMin = arg(s.upDistRatioMin, distRatioMin);
        distRatioMax = arg(s.upDistRatioMax, distRatioMax);
        direction    = arg(s.upDirection, direction);

    } else {

        posRatioMin  = arg(s.downPosRatioMin, posRatioMin);
        posRatioMax  = arg(s.downPosRatioMax, posRatioMax);
        distRatioMin = arg(s.downDistRatioMin, distRatioMin);
        distRatioMax = arg(s.downDistRatioMax, distRatioMax);
        direction    = arg(s.downDirection, direction);
    }

    direction = arg(direction, random() < 0.5 ? 'up' : 'down');

    var posRatio  = randomRange(posRatioMin, posRatioMax);
    var distRatio = randomRange(distRatioMin, distRatioMax);

    var a = {
        x: left.index,
        y: left.value,
    };

    var b = {
        x: right.index,
        y: right.value,
    };

    var p = generateMidPoint(a, b, posRatio, distRatio, direction, distMin, distMax);

    return {
        value: p.y,
        index: p.x
    };
}

function generateMidPoint(a, b, cPosRatio, distRatio, direction, distMin, distMax) {
    var vDist = getDistance(a, b);
    var v     = getNormalizedVector(a, b, vDist);

    var dx = b.x - a.x;
    var dy = b.y - a.y;

    // c is a point on line ab at given ratio
    var c = {
        x: (dx * cPosRatio),
        y: (dy * cPosRatio)
    };
    // distance proportional to ab length
    var dist = vDist * distRatio;

    if (distMin !== undefined) {
        dist = Math.max(distMin);
    }
    if (distMax !== undefined) {
        dist = Math.min(distMax);
    }

    var vDir = vectorRotate90(v, direction);

    var d = {
        x: vDir.x * dist,
        y: vDir.y * dist,
    };

    // width of line ab
    var ab = dx;
    // postion of d offset from c
    var dC = c.x + d.x;
    // scale to fit horizontal bounds of ab
    var scale = false;

    // d left of a
    if (dC < 0) {
        scale = -(c.x / d.x);
    }
    // d right of b
    else if (dC > ab) {
        scale = (dx - c.x) / (d.x);
    }

    if (scale !== false) {
        d.x *= scale;
        d.y *= scale;
    }

    // add offsets to d
    d.x += c.x + a.x;
    d.y += c.y + a.y;

    d.x = Math.round(d.x);

    if (d.x === a.x) {
        d.x += 1;
    }

    if (d.x === b.x) {
        d.x -= 1;
    }

    // set c offset for debug
    // c.x += a.x;
    // c.y += a.y;

    return d;
}

function vectorRotate90(v, direction){
    if (direction === 'left' || direction === 'up') {
        return {
            x: -v.y,
            y: v.x,
        }
    }
    else if (direction === 'right' || direction === 'down') {
        return {
            x: v.y,
            y: -v.x,
        }
    }
}

function addDisplacementKeyIndexes(settings) {
    var defaults = {
        keyIndexes:           null,
        startingDisplacement: 50,
        roughness:            0.77,
        maxIterations:        1,
        calcDisplacement:     defaultCalcDisplacement,
    };

    var s = Object.assign({}, defaults, settings);

    var keyIndexes           = s.keyIndexes;
    var roughness            = s.roughness;
    var maxIterations        = s.maxIterations;
    var calcDisplacement     = s.calcDisplacement;
    var startingDisplacement = s.startingDisplacement;

    keyIndexes = keyIndexes.map(function(item) {
        return Object.assign({}, item);
    });

    var results = [];

    keyIndexes.forEach(function(item, i, data) {
        var next = data[i + 1];
        if (!next) {
            results.push(item);
            return;
        }

        var arr = split(item, next, startingDisplacement);
        results = results.concat(item, arr);
    });

    return results;

    function defaultCalcDisplacement(current, left, right, iteration) {
        if (iteration == 1) {
            return current;
        }
        return current * roughness;
    }

    function split(left, right, displacement, iteration) {
        iteration = iteration || 0;
        iteration++;

        if (left.index + 1 == right.index) {
            return false;
        }

        displacement = calcDisplacement(displacement, left, right, iteration);

        var mid = splitNodes(left, right, displacement);

        if (iteration >= maxIterations) {
            return mid;
        }

        var result = [];

        var canSplitLeft  = left.index + 1 !== mid.index;
        var canSplitRight = right.index - 1 !== mid.index;

        if (canSplitLeft) {

            var leftSplit = split(left, mid, displacement, iteration);

            if (leftSplit) {
                result = result.concat(leftSplit);
            }
        }

        result.push(mid);

        if (canSplitRight) {

            var rightSplit = split(mid, right, displacement, iteration);
            if (rightSplit) {
                result = result.concat(rightSplit);
            }
        }
        return result;
    }
}

function splitNodes(left, right, displacement) {
    var midIndex   = Math.floor((left.index + right.index) * 0.5);
    var midValue   = (left.value + right.value) * 0.5;
    var adjustment = (randomRange(-1, 1) * displacement);

    return {
        index: midIndex,
        value: midValue + adjustment,
    };
}
},{"../1d-heightmap":2,"../interpolators":5,"../math":7,"../rng":13,"../util":14}],7:[function(require,module,exports){
'use strict';


module.exports = {
    getDistance: getDistance,
    getNormalizedVector: getNormalizedVector,
    isAbove: isAbove,
};

function getDistance(a, b) {

    var dx = b.x - a.x
    var dy = b.y - a.y

    return Math.sqrt(dx * dx + dy * dy);
}

function getNormalizedVector(a, b, distance) {
    distance = distance || getDistance(a, b);

    var dx = b.x - a.x
    var dy = b.y - a.y

    return {
        x: dx / distance,
        y: dy / distance,
    };
}

function isAbove(x1, y1, x2, y2, x, y) {

    var dx = x2 - x1;
    var dy = y2 - y1;

    // cross product
    var d = (x - x1) * dy - (y - y1) * dx;

    return d < 0;
}

},{}],8:[function(require,module,exports){
'use strict';

var makeArray = require('../util').makeArray;

var methods = {
    /**
     * Initialzie 1dHeightmap object.
     * @method init
     * @param {Object} [settings] - Settings object.
     * @param {Number} [settings.length] - Length of height map.
     * @param {Array}  [settings.data] - Length of height map. If set, settings.length is ignored.
     * @return {Object} Initialized 1dHeightmap object.
     */
    init: function(settings) {
        var s = settings || {};

        this.data = s.data || makeArray(s.length);

        return this;
    },
    copy: function() {
        var settings = {
            data: [].concat(this.data)
        };
        return this.factory(settings);
    },
    min: function() {
        return Math.min.apply(null, this.data);
    },
    max: function() {
        return Math.max.apply(null, this.data);
    },
    range: function() {
        return this.max() - this.min();
    }
};

module.exports = methods;

},{"../util":14}],9:[function(require,module,exports){
'use strict';

var arg = require('../util').arg;

var methods = {
    each: function(func, context) {
        context = arg(context, this);

        this.data.forEach(func, context);
        return this;
    },
    map: function(func, context) {
        return this.factory({
            data: this.data.map(func, context)
        });
    },
    mapEach: function(func, context) {
        context = arg(context, this);

        this.data = this.data.map(func, context);
        return this;
    },

};
module.exports = methods;

},{"../util":14}],10:[function(require,module,exports){
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
    mergeAverageWeight: function(heightmap, weight, maxLength, defaultValue) {
        weight = arg(weight, 1);
        return this.merge(heightmap, function(a, b) {
            return (a*weight + b) / (1 + weight);
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
},{"../util":14}],11:[function(require,module,exports){
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
        var delta = maxHeight - minHeight;
        this.scaleHeightTo(delta);
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
    smoothStartHeight: function(endIndex, height) {
        var startIndex = this.data.length - endIndex;

        return this
            .reverse()
            .smoothEndHeight(startIndex, height)
            .reverse();
    },
    smoothStartHeightFromPercent: function(smoothEndPercent, height) {
        var endIndex = Math.floor(this.data.length * smoothEndPercent);

        return this.smoothStartHeight(endIndex, height);
    },
    smoothEndHeight: function(startIndex, height) {

        var length = this.data.length;

        this.mapEach(function(val, index) {

            if (index < startIndex) {
                return val;
            }

            var percent = (index - startIndex) / (length - startIndex);
            var delta   = height - val;
            var mod     = delta * percent;

            return val + mod;
        });

        return this;
    },
    smoothEndHeightFromPercent: function(smoothStartPercent, height) {
        var length = this.data.length;
        var startIndex = Math.floor(length * smoothStartPercent);
        return this.smoothEndHeight(startIndex, height);
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
},{"../rng":13,"../util":14}],12:[function(require,module,exports){
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
            y = ry - height;
            w = columnWidth;
            h = height;
        } else if (direction === 'left') {
            x = rx - height;
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
            Math.round(x * scale),
            Math.round(y * scale),
            Math.round(w * scale),
            Math.round(h * scale)
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
        dy = y - val;
    } else if (direction === 'left') {
        dx = x + heightmap.max() - val;

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
},{}],13:[function(require,module,exports){
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
},{"./util":14}],14:[function(require,module,exports){
'use strict';

var arg = function(val, defaultVal) {
    return val !== undefined ? val : defaultVal;
};

module.exports = {
    arg: arg,

    makeArray: function(length, value) {
        value = arg(value, 0);
        var a = [];

        for (var i = 0; i < length; i++) {
            a[i] = value;
        }
        return a;
    },

    /**
     * Slice array values within given range relative to i
     * @method sliceRelativeRange
     * @param {Array} array
     * @param {Number} i - index
     * @param {Number} range - number of array values to include before and after i
     * @return {Array}
     */
    sliceRelativeRange: function(array, i, range) {
        var minI = Math.max(i - range, 0);
        var maxI = i + range + 1;
        return array.slice(minI, maxI);
    },
    arrayChunk: function(array, startIndex, endIndex) {
        var minI = Math.max(startIndex, 0);
        var maxI = endIndex + 1;
        return array.slice(minI, maxI);
    },
    arrayFilterIndexes: function(arr, func) {
        var out = [];
        arr.forEach(function(val, i) {
            if (func(val, i, arr)) {
                out.push(i);
            }
        });
        return out;
    },
    arraySum: function(arr, defaultVal) {
        defaultVal = arg(defaultVal, 0);
        return arr.reduce(function(prev, current){
            return prev + current
        }, defaultVal);
    }

};
},{}]},{},[4])(4)
});
//# sourceMappingURL=1d-heightmap.js.map
