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