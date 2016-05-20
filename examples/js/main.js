'use strict';
/* global $, oneDHeightMap */

var SCALE = 4;
var DEBUG = false;

// width / height of canvas depending on direction of draw
var canvasSize = 400;
// length of example heightmap
var hmLength    = Math.floor(canvasSize / SCALE);
var hmMaxHeight = Math.floor(hmLength * 0.5);

var displayDefaults = {
    original:      null,
    originalColor: 'rgba(150,50,50,0.5)',
    heightmap:     null,
    direction:     'up',
    label:         null,
    debug:         DEBUG,
    color:         'rgba(50,100,150,0.5)',
    scale:         SCALE,
};

var $container = $('.container');

var createCanvas = function(heightmap, direction, label) {
    var width;
    var height;

    if (direction == 'up' || direction == 'down') {
        width  = hm.data.length;
        height = hm.maxHeight;
    } else {
        width  = hm.maxHeight;
        height = hm.data.length;
    }

    $container.append('<div class="example"><canvas width="' + width + '" height="' + height + '"/><p>' + label + '</p></div>');
    var canvas = $container.find('.example').last().find('canvas')[0];

    canvas.width  = width * SCALE;
    canvas.height = height * SCALE;

    return canvas;
};

var display = function(settings) {

    var s      = Object.assign({}, displayDefaults, settings);
    var canvas = createCanvas(s.heightmap, s.direction, s.label);
    var ctx    = canvas.getContext('2d');

    if (s.original) {
        oneDHeightMap.draw({
            heightmap: s.original,
            ctx:       ctx,
            x:         0,
            y:         0,
            direction: s.direction,
            scale:     s.scale,
            color:     s.originalColor,
            debug:     s.debug,
        });
    }
    oneDHeightMap.draw({
        heightmap: s.heightmap,
        ctx:       ctx,
        x:         0,
        y:         0,
        direction: s.direction,
        scale:     s.scale,
        color:     s.color,
        debug:     s.debug,
    });
};

// create orginal
var hm = oneDHeightMap.create({
    length:    hmLength,
    maxHeight: hmMaxHeight,
});

// generate height map data
hm.generateHill({
    startHeight:       1,
    endHeight:         1,
    variance:          3,
    edgeDeflectMargin: 0.25,
    deviationChance:   0.9,
    endTaperMargin:    10,
    startTaperMargin:  20,
    debug:             DEBUG,
});

display({
    heightmap: hm,
    label:     'original'
});

display({
    original:  hm,
    heightmap: hm.copy().smooth(),
    label:     'smooth()'
});

display({
    original:  hm,
    heightmap: hm.copy().invert(),
    label:     'invert()'
});

display({
    original:  hm,
    heightmap: hm.copy().reverse(),
    label:     'reverse()'
});

display({
    original:  hm,
    heightmap: hm.copy().scale(0.5),
    label:     'scale(0.5)'
});


display({
    original:  hm,
    heightmap: hm.copy().subtract(15),
    label:     'subtract(15)'
});

display({
    original:  hm,
    heightmap: hm.copy().add(15),
    label:     'add(15)'
});

display({
    original:  hm,
    heightmap: hm.copy().multiply(2),
    label:     'multiply(2)'
});

display({
    original:  hm,
    heightmap: hm.copy().divide(6),
    label:     'divide(6)'
});

display({
    original:  hm,
    heightmap: hm.copy().shrink(),
    label:     'shrink()'
});

display({
    original:  hm,
    heightmap: hm.copy().grow(),
    label:     'grow()'
});

display({
    original:  hm,
    heightmap: hm.copy().drip(),
    label:     'drip()'
});

display({
    original:  hm,
    heightmap: hm.copy().dripByHeight(),
    label:     'dripByHeight()'
});

display({
    original:  hm,
    heightmap: hm.copy().distort(),
    label:     'distort()'
});

display({
    original:  hm,
    heightmap: hm.copy().generateArc(),
    label:     'generateArc()'
});



