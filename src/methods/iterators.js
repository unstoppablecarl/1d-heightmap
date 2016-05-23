'use strict';

var arg = require('../util').arg;

var methods = {
    each: function(func, context) {
        context = arg(context, this);

        this.data.forEach(func, context);
        return this;
    },
    map: function(func, context) {
        return this.copy({
            data: this.data.map(func, context)
        });
    },
    mapEach: function(func, context) {
        context = arg(context, this);

        this.data = this.data.map(func, context);
        return this;
    },
    merge: function(heightmap, func, maxLength) {
        maxLength = arg(maxLength, Math.max(this.data.length, heightmap.data.length));

        var target = this,
            source = heightmap,
            i;
        for (i = 0; i < maxLength; i++) {
            var targetVal = target.data[i];
            var srcVal    = source.data[i];

            target.data[i] = func(targetVal, srcVal, i, target.data, source.data);
        }
        return this;
    },
    adjustEvery: function(interval, func) {
        return this.mapEach(function(val, i, arr) {
            if (i % interval === 0) {
                return func(val, i, arr);
            } else {
                return val;
            }
        });
    }
};
module.exports = methods;
