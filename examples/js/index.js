/* eslint-env browser */
/* eslint strict: ["error", "function"]*/
/* global _, $, oneDHeightmap, makePresenter */

(function() {
    'use strict';

    var stripIndent = function(str) {
        var match = str.match(/^[ \t]*(?=\S)/gm);

        if (!match) {
            return str;
        }

        var indent = Math.min.apply(Math, match.map(function(x) { return x.length})); // eslint-disable-line
        var re     = new RegExp('^[     ]{' + indent + '}', 'gm');

        return indent > 0 ? str.replace(re, '') : str;
    };

    var funcToString = function(func) {
        var arr = (func + '').split('\n').slice(1, -1);
        return stripIndent(arr.join('\n'));
    };

    // mountain treeline
    (function() {

        var presenter = makePresenter({
            canvasSize:    500,
            scale:         1,
            $container:    $('.mountain-treeline-container'),
            originalColor: '#164b42'
        });

        var length  = presenter.length;
        var display = presenter.display;

        var hm;
        var makeHm = function() {
            hm = oneDHeightmap.generate.perlin({
                length:       length, // 500
                interpolator: oneDHeightmap.interpolate.linear,
                startHeight:  20,
                endHeight:    20,
                minSpacing:   10,
                maxSpacing:   20,
                min:          10,
                max:          500,
                minSlope:     -1,
                maxSlope:     1,
            });
        };
        makeHm();

        display({
            heightmap:   hm,
            description: funcToString(makeHm)
        });

        var hm2;
        var makeHm2 = function() {
            hm2 = oneDHeightmap.generate.random({
                length: length, // 500
                min:    0,
                max:    16,
            });
            hm2.dripByHeight(0.45, 0.75);
            hm2.smooth();
        }
        makeHm2();

        display({
            heightmap:   hm2,
            description: funcToString(makeHm2),
        });


        var makeHm3 = function() {
            hm.mergeAdd(hm2);
            hm.smoothSlopes();
            hm.smoothCorners();

        };
        makeHm3();

        display({
            heightmap:   hm,
            description: funcToString(makeHm3),
        });

    }());

}());