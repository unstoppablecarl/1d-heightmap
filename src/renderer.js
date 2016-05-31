'use strict';

function draw(settings) {
    var defaults = {
        heightmap:   null,
        ctx:         null,
        x:           0,
        y:           0,
        direction:   'up',
        scale:       1,
        columnWidth: 1,
        color:       'rgb(50,100,150)',
        debug:       false,
    };

    var s = Object.assign(defaults, settings)

    var heightmap   = s.heightmap;
    var ctx         = s.ctx;
    var rx          = s.x;
    var ry          = s.y;
    var direction   = s.direction;
    var scale       = s.scale;
    var columnWidth = s.columnWidth;
    var color       = s.color;
    var debug       = s.debug;

    var data = heightmap.data,
        len  = data.length,
        height,
        i,
        x,
        y,
        w,
        h;

    for (i = 0; i < len; i++) {

        height        = Math.round(data[i]);
        ctx.fillStyle = color;
        if (direction === 'up') {
            x = rx + i * columnWidth;
            y = ry - height;
            w = columnWidth;
            h = height;
        } else if (direction === 'left') {
            x = rx - height;
            y = ry + i * columnWidth;
            w = height;
            h = columnWidth;
        } else if (direction === 'right') {
            x = rx;
            y = ry + i * columnWidth;
            w = height;
            h = columnWidth;
        } else if (direction === 'down') {
            x = rx + i * columnWidth;
            y = ry;
            w = columnWidth;
            h = height;
        }
        ctx.fillRect(
            x * scale,
            y * scale,
            w * scale,
            h * scale
        );

        if (
            debug &&
            heightmap.debugData &&
            heightmap.debugData.generateHill
        ) {
            var debugData = heightmap.debugData.generateHill;

            var absoluteMin = debugData[i].absoluteMin;
            var absoluteMax = debugData[i].absoluteMax;
            var adjustedMin = debugData[i].adjustedMin;
            var adjustedMax = debugData[i].adjustedMax;

            var debugAbsoluteMinColor = 'red';
            var debugAbsoluteMaxColor = 'red';
            var debugAdjustedMinColor = 'orange';
            var debugAdjustedMaxColor = 'orange';

            var dx = x;
            var dy = y;

            if (direction === 'up') {
                dy = ry;

            } else if (direction === 'left') {
                dx = rx;
            } else if (direction === 'right') {
                dx = rx;

            } else if (direction === 'down') {
                dy = ry;
            }

            debugDraw(heightmap, ctx, dx, dy, direction, scale, absoluteMin, debugAbsoluteMinColor);
            debugDraw(heightmap, ctx, dx, dy, direction, scale, absoluteMax, debugAbsoluteMaxColor);
            debugDraw(heightmap, ctx, dx, dy, direction, scale, adjustedMin, debugAdjustedMinColor);
            debugDraw(heightmap, ctx, dx, dy, direction, scale, adjustedMax, debugAdjustedMaxColor);
        }
    }
    return this;
}

function debugDraw(heightmap, ctx, x, y, direction, scale, val, color) {

    var dx = x,
        dy = y;

    if (direction === 'up') {
        dy = y - val;
    } else if (direction === 'left') {
        dx = x + heightmap.max() - val;

    } else if (direction === 'right') {
        dx = x + val;

    } else if (direction === 'down') {
        dy = y + val;
    }

    ctx.globalAlpha = 1;
    ctx.fillStyle   = color;
    ctx.fillRect(
        dx * scale,
        dy * scale,
        1 * scale,
        1 * scale
    );
}

module.exports = draw;