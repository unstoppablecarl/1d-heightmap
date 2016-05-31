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


};
module.exports = methods;
