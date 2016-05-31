/* eslint-env browser */
/* eslint strict: ["error", "function"]*/
/* global _, $, oneDHeightmap, makePresenter */

(function() {
    'use strict';

    var presenter = makePresenter({
        canvasSize: 380
    });

    var length  = presenter.length;
    var max     = presenter.maxHeight;
    var display = presenter.display;

    presenter.$container = $('.general-container');
    var roughHm = oneDHeightmap.generate.rough({
        length: length,
        max:    max,
    });

    display({
        heightmap: roughHm,
        label:     'oneDHeightmap.generate.rough()'
    });

    var randomHm = oneDHeightmap.generate.random({
        length: length,
        max:    max,
    });

    display({
        heightmap: randomHm,
        label:     'oneDHeightmap.generate.random()'
    });

    // Perlin generators

    (function() {
        // make key indexes all interpolations will be based on
        var keyIndexes = oneDHeightmap.generate.keyIndexes({
            length: length,
            max:    max,
        });

        // make heightmap from original keyIndexes using interpolator
        var make = function(interpolator) {
            return oneDHeightmap.create({
                data: oneDHeightmap.generate.interpolateKeyIndexes(keyIndexes, interpolator)
            });
        };

        // set non-keyIndexes to 0 for original
        var original = make(function(a, b, x) {
            return 0;
        });

        // helper function to keep code more DRY
        var displayGroup = function(keys) {
            keys.forEach(function(key) {

                display({
                    heightmap: original,
                    transform: function(hm) {
                        return make(oneDHeightmap.interpolate[key]);
                    },
                    label: key
                });
            });
        };

        presenter.$container = $('.perlin-original-container');

        presenter.display({
            heightmap: original,
            label:     'original keyIndexes'
        });

        presenter.$container.find('.example').removeClass('col-sm-4');

        presenter.$container = $('.perlin-container');

        displayGroup(['linear', 'block', 'smoothStep']);

        displayGroup(['sine', 'sineUp', 'sineDown']);
        displayGroup(['quad', 'quadUp', 'quadDown']);
        displayGroup(['cubic', 'cubicUp', 'cubicDown']);
        displayGroup(['quart', 'quartUp', 'quartDown']);
        displayGroup(['quint', 'quintUp', 'quintDown']);
        displayGroup(['expo', 'expoUp', 'expoDown']);
        displayGroup(['circ', 'circUp', 'circDown']);


    }());

}());

