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