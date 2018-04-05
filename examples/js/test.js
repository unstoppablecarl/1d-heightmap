/* eslint-env browser */
/* eslint strict: ["error", "function"]*/
/* global _, $, oneDHeightmap, makePresenter */

(function() {
    'use strict';

    var TEST_MODE = false;

    var canvasWidth     = 1000;
    var canvasHeight    = 400;
    var hmWidth         = canvasWidth;
    var realCanvasWidth = canvasWidth;

    if (TEST_MODE) {
        realCanvasWidth = 1000;
    }

    var ctx = makeCanvas(realCanvasWidth, canvasHeight);

    var lastFrame               = performance.now();
    var requestAnimationFrameId = window.requestAnimationFrame(gameLoop);
    var FPS                     = 1;
    var alpha                   = 0.1;

    var rectWidth = canvasWidth;
    var rectX     = (realCanvasWidth * 0.5) - (rectWidth * 0.5);
    var offsetX   = rectX;

    var renderers = [];

    var renderer1 = (function() {

        var rangePercent = 0.4;
        var minPercent   = 0.6;
        var range        = rangePercent * canvasHeight;
        var min          = minPercent * canvasHeight;

        return makeRenderer({

            color:   '#214640',
            speed:   15,
            makeHm1: function() {
                var hm = make(hmWidth, range, min);
                hm = roughen1(hm);
                hm = roughen2(hm);
                return hm;
            },
            makeHm2: function(hm1) {
                var hm = make(hmWidth, range, min, hm1);
                hm = roughen1(hm);
                hm = roughen2(hm);
                return hm;
            }
        })
    }());

    var renderer2 = (function() {

        var rangePercent = 0.4;
        var minPercent   = 0.4;
        var range        = rangePercent * canvasHeight;
        var min          = minPercent * canvasHeight;

        return makeRenderer({

            color:   '#2c675e',
            speed:   50,
            makeHm1: function() {
                var hm = make(hmWidth, range, min);
                hm = roughen1(hm);
                hm = roughen2(hm);
                return hm;
            },
            makeHm2: function(hm1) {
                var hm = make(hmWidth, range, min, hm1);
                hm = roughen1(hm);
                hm = roughen2(hm);
                return hm;
            }
        })
    }());

    var renderer3 = (function() {

        var rangePercent = 0.15;
        var minPercent   = 0.1;
        var range        = rangePercent * canvasHeight;
        var min          = minPercent * canvasHeight;

        return makeRenderer({
            color:   '#318276',
            speed:   300,
            makeHm1: function() {
                var hm = make(hmWidth, range, min);
                hm = roughen1(hm);
                return hm;
            },
            makeHm2: function(hm1) {
                var hm = make(hmWidth, range, min, hm1);
                hm = roughen1(hm);
                return hm;
            }
        })
    }());

    renderers.push(renderer1);
    renderers.push(renderer2);
    renderers.push(renderer3);

    function step(dt) {

        drawBg();

        for (var i = 0; i < renderers.length; i++) {
            var renderer = renderers[i];
            renderer(dt);
        }

        drawTestRect();
    }

    function makeRenderer(settings) {
        var s = settings;

        var color   = s.color;
        var speed   = s.speed;
        var makeHm1 = s.makeHm1;
        var makeHm2 = s.makeHm2;

        var x1 = offsetX;
        var x2 = offsetX - hmWidth;

        var hm1 = makeHm1();
        var hm2 = makeHm2(hm1);

        return function(dt) {

            x1 += dt * speed;
            x2 += dt * speed;

            var leftX     = rectX + rectWidth;
            var h1Visible = x1 < leftX;

            oneDHeightmap.draw({
                ctx:       ctx,
                heightmap: hm1,
                x:         x1,
                y:         canvasHeight,
                color:     color
            });

            oneDHeightmap.draw({
                ctx:       ctx,
                heightmap: hm2,
                x:         x2,
                y:         canvasHeight,
                color:     color
            });

            if (!h1Visible) {
                x1 = offsetX;
                x2 = offsetX - hmWidth;

                hm1 = hm2;
                hm2 = makeHm2(hm1);
            }
        };
    }

    function stopGameLoop() {
        window.cancelAnimationFrame(requestAnimationFrameId);
    }

    function gameLoop(timestamp) {
        requestAnimationFrameId = window.requestAnimationFrame(gameLoop);

        if (timestamp < lastFrame + (1000 / 60)) {
            return;
        }

        var dt = (timestamp - lastFrame) / 1000;
        lastFrame = timestamp;
        FPS       = FPS + (1 - alpha) * (1 / dt - FPS);

        step(dt);
    }

    function drawBg() {

        ctx.fillStyle = '#162321';
        ctx.fillRect(0, 0, realCanvasWidth, canvasHeight);
        ctx.fillStyle   = '#ff0000';
        ctx.strokeStyle = '#ff0000';
    }

    function drawTestRect() {
        if (TEST_MODE) {
            ctx.strokeRect(rectX, 0, rectWidth, canvasHeight);
        }
    }

    function makeCanvas(width, height) {

        var $container = $('.example-container');
        $container.append('<canvas>');
        var canvas = $container.find('canvas').last()[0];
        canvas.width  = width;
        canvas.height = height;
        var ctx = canvas.getContext('2d');
        return ctx;
    }

    function keyIndexesToOneD(keyIndexes) {

        var values  = [];
        var indexes = [];

        keyIndexes.forEach(function(item) {
            values.push(item.value);
            indexes.push(item.index);
        });

        var hm = oneDHeightmap.create({
            data: values
        });

        hm.indexes = indexes;

        hm.toKeyIndexes = function() {
            var result = [];

            this.each(function(val, i) {
                result.push({
                    value: val,
                    index: this.indexes[i],
                })
            });

            return result;
        }

        return hm;
    }

    function makeKeyIndexes(length, height, add) {
        var keyIndexes = oneDHeightmap.generate.keyIndexes({
            length:     length,
            minSpacing: length * 0.1,
            maxSpacing: length * 0.2,
            min:        0,
            max:        height,
            minSlope:   -1.5,
            maxSlope:   0.5,
        });

        keyIndexes = oneDHeightmap.generate.addKeyIndexes({
            keyIndexes:    keyIndexes,
            valueRangeMin: -0.25,
            valueRangeMax: 1,
        });

        var hm = keyIndexesToOneD(keyIndexes);
        hm.trimHeight();
        hm.scaleHeightTo(height);
        hm.add(add);
        return hm.toKeyIndexes();
    }

    function make(width, range, min, prevHm) {

        var keyIndexes = makeKeyIndexes(width, range, min);

        if (prevHm) {
            var lastKeyIndex  = keyIndexes[keyIndexes.length - 1];
            var prevLastValue = prevHm.data[0];
            lastKeyIndex.value = prevLastValue;
        }

        var hm = oneDHeightmap.generate.fromKeyIndexes(keyIndexes, oneDHeightmap.interpolate.linear);
        return hm;
    }

    function roughen1(hm) {
        hm = hm.copy();
        var length = hm.data.length;

        var entropy = oneDHeightmap.generate.perlin({
            length:       length,
            minSpacing:   length * 0.01,
            maxSpacing:   length * 0.05,
            min:          0,
            max:          length * 0.02,
            interpolator: oneDHeightmap.interpolate.linear
        });

        entropy
            .trimHeight()
            .scaleHeightTo(length * 0.02)
            .subtract(entropy.max());

        taper(entropy);

        hm.mergeAdd(entropy);
        hm.add(entropy.max() * 2);

        return hm;
    }

    function roughen2(hm) {
        hm = hm.copy();
        var length = hm.data.length;

        var entropy2 = oneDHeightmap.generate.perlin({
            length:       length,
            minSpacing:   length * 0.05,
            maxSpacing:   length * 0.1,
            min:          0,
            max:          length * 0.03,
            interpolator: oneDHeightmap.interpolate.linear
        });

        entropy2.trimHeight().scaleHeightTo(length * 0.08).subtract(entropy2.max());

        hm.add(entropy2.max() * 2);
        taper(entropy2);

        hm.mergeAdd(entropy2);

        return hm;
    }

    function taper(hm) {

        var taperKeyIndexes = [
            {
                index: 0,
                value: 0,
            },
            {
                index: Math.round(hm.data.length * 0.1),
                value: 1,
            },
            {
                index: Math.round(hm.data.length * 0.9),
                value: 1,
            },
            {
                index: hm.data.length - 1,
                value: 0,
            },
        ];

        var taperHm = oneDHeightmap.generate.fromKeyIndexes(taperKeyIndexes);
        return hm.mergeMultiply(taperHm);
    }

}());