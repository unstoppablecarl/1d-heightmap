/* eslint-env browser */
/* eslint strict: ["error", "function"]*/
/* global _, $, oneDHeightmap, makePresenter */

(function() {
    'use strict';

    var presenter = makePresenter({
        canvasSize: 1000,
        scale:      1,
    });

    var length  = presenter.length;
    var display = presenter.display;

    var height = length * 0.2;

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


    function makeKeyIndexes(height) {
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
        return hm.toKeyIndexes();

    }

    function make(keyIndexes) {
        return oneDHeightmap.generate.fromKeyIndexes(keyIndexes, oneDHeightmap.interpolate.linear);
    }

    function fitKeyIndexes(from, to) {
        return from.map(function(item, i) {
            var prev    = from[i - 1];
            var index   = item.index;
            var value   = item.value;
            var l1Value = to.data[index];
            var min     = l1Value * 0;
            var max     = l1Value * 0.75;

            if (value > max) {
                // prevent excessive zigzag
                if (prev && prev.value < value && prev.value > min) {
                    min = Math.max(min, prev.value)
                }

                item.value = oneDHeightmap.rng.range(min, max);
            }
            return item;
        });
    }

    var l1KeyIndexes = makeKeyIndexes(height);
    var l1           = make(l1KeyIndexes);

    l1.add(height * 0.66);

    var l2KeyIndexes = makeKeyIndexes(l1.max());
    l2KeyIndexes = fitKeyIndexes(l2KeyIndexes, l1);
    var l2 = make(l2KeyIndexes);

    l1.add(height * 0.66);
    l2.add(height * 0.66);

    var l3KeyIndexes = makeKeyIndexes(l2.max());
    l3KeyIndexes = fitKeyIndexes(l3KeyIndexes, l2);
    var l3 = make(l3KeyIndexes);


    l1.add(height * 0.66);
    l2.add(height * 0.66);
    l3.add(height * 0.66);


    // display({
    //     heightmap: l1,
    //     label:     'l1'
    // })

    // display({
    //     heightmap: l1,
    //     label:     'l2',
    //     transform: function() {
    //         return l2;
    //     }
    // });

    // display({
    //     heightmap: l2,
    //     label:     'l3',
    //     transform: function() {
    //         return l3;
    //     }
    // });

    l1 = roughen(l1);
    l2 = roughen(l2);
    l3 = roughen(l3);

    l1 = addTrees(l1);
    l2 = addTrees(l2);
    l3 = addTrees(l3);

    presenter.$container.append('<canvas>');
    var canvas = presenter.$container.find('canvas').last()[0];
    canvas.width  = (length);
    canvas.height = (l1.max() + 50);
    var ctx = canvas.getContext('2d');

    ctx.fillStyle = '#162321';
    ctx.fillRect(0,0,canvas.width, canvas.height);

    oneDHeightmap.draw({
        ctx:       ctx,
        heightmap: l1,
        y:         canvas.height,
        color:     '#214640'
    })

    oneDHeightmap.draw({
        ctx:       ctx,
        heightmap: l2,
        y:         canvas.height,
        color:     '#2c675e'
    })

    oneDHeightmap.draw({
        ctx:       ctx,
        heightmap: l3,
        y:         canvas.height,
        color:     '#318276'
    })


    function addTrees(hm, weight) {
        var original = hm;

        hm = hm.copy();
        var hm2 = oneDHeightmap.generate.random({
            length: length, // 500
            min:    0,
            max:    16,
        });
        hm2.dripByHeight(0.45, 0.75);
        hm2.smooth();

        hm.mergeAdd(hm2);
        hm.smoothSlopes();
        hm.smoothCorners();

        var wave = oneDHeightmap.generate.perlin({
            length:       length,
            minSpacing:   length * 0.15,
            maxSpacing:   length * 0.25,
            min:          0.1,
            max:          3,
            minSlope:     -0.1,
            maxSlope:     0.1,
            interpolator: oneDHeightmap.interpolate.sine
        });

        hm.merge(original, function(a, b, i) {
            var w = wave.data[i];
            w = Math.min(1, w);
            var delta = a - b;
            return b + (delta * w);
        });

        return hm;
    }


    function roughen(hm) {

        var length = hm.data.length;

        var entropy = oneDHeightmap.generate.perlin({
            length:     length,
            minSpacing: length * 0.01,
            maxSpacing: length * 0.05,
            min:        0,
            max:        length * 0.02,
            interpolator: oneDHeightmap.interpolate.linear
        });

        var entropy2 = oneDHeightmap.generate.perlin({
            length:     length,
            minSpacing: length * 0.05,
            maxSpacing: length * 0.1,
            min:        0,
            max:        length * 0.03,
            interpolator: oneDHeightmap.interpolate.linear
        });

        entropy.trimHeight().scaleHeightTo(length * 0.02).subtract(entropy.max());
        entropy2.trimHeight().scaleHeightTo(length * 0.08).subtract(entropy2.max());

        hm.mergeAdd(entropy);
        hm.add(entropy.max() * 2);

        hm.mergeAdd(entropy2);
        hm.add(entropy2.max() * 2);


        return hm;
    }

}());