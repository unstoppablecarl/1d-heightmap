/* eslint-env browser */
/* eslint strict: ["error", "function"]*/
/* global _, $, oneDHeightmap */

var makePresenter = function(settings) {
    'use strict';

    var defaults = {
        scale:            1,
        debug:            false,
        canvasSize:       400,

        canvasMargin:     2,
        originalColor:    'rgba(150,50,50,0.5)',
        heightmap:        null,
        direction:        'up',
        label:            null,
        color:            'rgba(50,100,150,0.5)',
        $container:       $('.example-container'),
        $exampleTemplate: $('.example-template')
    };

    var s                = Object.assign({}, defaults, settings);
    var defaultSettings  = s;
    var scale            = s.scale;
    var canvasSize       = s.canvasSize;
    var canvasMargin     = s.canvasMargin;
    var $exampleTemplate = s.$exampleTemplate;
    var compiled         = _.template($exampleTemplate.html());

    // length of example heightmap
    var length    = Math.floor(canvasSize / scale);
    var maxHeight = s.maxHeight || Math.floor(length * 0.5);

    var api = {
        display:      display,
        length:       length,
        maxHeight:    maxHeight,
        createCanvas: createCanvas,
        $container:   s.$container,
    };

    function createCanvas(direction, width, height, label, description) {
        direction = direction || 'up';

        // swap if rotated
        if (direction === 'left' || direction === 'right') {
            var t = width;
            width  = height;
            height = t;
        }

        api.$container.append(compiled({
            width:       width,
            height:      height,
            label:       label,
            description: description,
        }))
        var canvas = api.$container.find('.example').last().find('canvas')[0];

        canvas.width  = (width + canvasMargin * 2) * scale;
        canvas.height = (height + canvasMargin * 2) * scale;

        return canvas;
    }

    function display(settings) {

        var s = Object.assign({}, defaultSettings, settings);

        var hm;
        var original    = s.heightmap;
        var label       = s.label;
        var transform   = s.transform;
        var direction   = s.direction;
        var description = s.description;
        var width       = original.data.length;
        var height      = original.max();
        var x           = canvasMargin;
        var y           = canvasMargin;

        if (transform) {

            hm = original.copy();
            hm = transform(hm) || hm;
            // remove negative values
            hm.clampMin(0);

            width  = Math.max(width, hm.data.length);
            height = Math.max(height, hm.max());
        }

        var canvas = api.createCanvas(direction, width, height, label, description);
        var ctx    = canvas.getContext('2d');

        if (direction === 'up') {
            y = height + canvasMargin;
        } else if (direction === 'left') {
            x = height + canvasMargin;
        }

        oneDHeightmap.draw({
            heightmap: original,
            ctx:       ctx,
            x:         x,
            y:         y,
            scale:     s.scale,
            direction: s.direction,
            color:     s.originalColor,
            debug:     s.debug,
        });

        if (hm) {
            oneDHeightmap.draw({
                heightmap: hm,
                ctx:       ctx,
                x:         x,
                y:         y,
                direction: s.direction,
                scale:     s.scale,
                color:     s.color,
                debug:     s.debug,
            });
        }
    }

    return api;

};

