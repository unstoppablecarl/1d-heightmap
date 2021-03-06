/* eslint-env browser */
/* eslint strict: ["error", "function"]*/
/* global _, $, oneDHeightmap, makePresenter */

(function() {
    'use strict';

    var presenter = makePresenter({
        canvasSize: 800,
        $container: $('.transformations-container')
    });

    var length = presenter.length;
    var max    = presenter.maxHeight;

    var display = presenter.display;

    // create orginal generate height map data
    var hm = oneDHeightmap.generate.rough({
        length: length,
        min:    0,
        max:    max,

        startHeight:       1,
        endHeight:         1,
        variance:          3,
        edgeDeflectMargin: 0.25,
        deviationChance:   0.9,
        endTaperMargin:    10,
        startTaperMargin:  20,
        debug:             presenter.debug,
    });

    display({
        heightmap: hm,
        label:     'generate.rough()'
    });

    display({
        heightmap: hm,
        transform: function(hm) {
            hm.smooth();
        },
        label: 'smooth()'
    });

    display({
        heightmap: hm,
        transform: function(hm) {
            hm.invert();
        },
        label: 'invert()'
    });

    display({
        heightmap: hm,
        transform: function(hm) {
            hm.reverse();
        },
        label: 'reverse()'
    });

    display({
        heightmap: hm,
        transform: function(hm) {
            hm.subtract(15);
        },
        label: 'subtract(15)'
    });

    display({
        heightmap: hm,
        transform: function(hm) {
            hm.add(15);
        },
        label: 'add(15)'
    });

    display({
        heightmap: hm,
        transform: function(hm) {
            hm.multiply(1.4);
        },
        label: 'multiply(1.4)'
    });

    display({
        heightmap: hm,
        transform: function(hm) {
            hm.divide(6);
        },
        label: 'divide(6)'
    });

    display({
        heightmap: hm,
        transform: function(hm) {
            hm.shrink();
        },
        label: 'shrink()'
    });

    display({
        heightmap: hm,
        transform: function(hm) {
            hm.grow();
        },
        label: 'grow()'
    });

    display({
        heightmap: hm,
        transform: function(hm) {
            hm.drip();
        },
        label: 'drip()'
    });

    display({
        heightmap: hm,
        transform: function(hm) {
            hm.dripByHeight();
        },
        label: 'dripByHeight()'
    });

    display({
        heightmap: hm,
        transform: function(hm) {
            hm.distort(25, 5);
        },
        label: 'distort(2, 5)'
    });

    display({
        heightmap: hm,
        transform: function(hm) {
            hm.distortChunk(50, 150);
        },
        label: 'distortChunk(150, 150)'
    });

    display({
        heightmap: hm,
        transform: function(hm) {
            hm.adjustRandomSpacedPositions(2, 10, true, function(val) {
                return val + 10;
            });
        },
        label: 'adjustRandomSpacedPositions(...)'
    });

    display({
        heightmap: hm,
        transform: function(hm) {
            hm.adjustEvery(10, function(val) {
                return val + 10;
            });
        },
        label: 'adjustEvery(10, ...)'
    });

    display({
        heightmap: hm,
        transform: function(hm) {
            hm.smoothStartHeight(50, 100);
        },
        label: 'smoothStartHeight(50, 100)'
    });

    display({
        heightmap: hm,
        transform: function(hm) {
            hm.smoothStartHeightFromPercent(0.25, 100);
        },
        label: 'smoothStartHeightFromPercent(0.25, 100)'
    });

    display({
        heightmap: hm,
        transform: function(hm) {
            hm.smoothEndHeight(hm.data.length - 50, 100);
        },
        label: 'smoothEndHeight(hm.data.length - 50, 100)'
    });

    display({
        heightmap: hm,
        transform: function(hm) {
            hm.smoothEndHeightFromPercent(0.75, 100);
        },
        label: 'smoothEndHeightFromPercent(0.75, 100)'
    });

    display({
        heightmap: hm,
        transform: function(hm) {
            hm.scaleHeightToMinMax(60, 130);
        },
        label: 'scaleHeightToMinMax(60, 130)'
    });


}());