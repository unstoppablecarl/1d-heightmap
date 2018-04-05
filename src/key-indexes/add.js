'use strict';

var arg                  = require('../util').arg;
var rng                  = require('../rng');
var random               = rng.float;
var randomRange          = rng.range;

var math                = require('../math');
var getDistance         = math.getDistance;
var getNormalizedVector = math.getNormalizedVector;

module.exports = {
    addKeyIndexes:             addKeyIndexes,
    addDisplacementKeyIndexes: addDisplacementKeyIndexes,
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

        directionUpChance: undefined,
        upDirectionUpChance: undefined,
        downDirectionUpChance: undefined,

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

        directionUpChance: 0.5,
        upDirectionUpChance: undefined,
        downDirectionUpChance: undefined,

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

    if(direction === undefined){
        var chance = s.directionUpChance;
        if(slopeUp){
            chance = arg(s.upDirectionUpChance, chance);
        } else {
            chance = arg(s.downDirectionUpChance, chance);
        }

        direction = random() < chance ? 'up' : 'down';
    }

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