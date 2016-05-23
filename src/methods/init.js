'use strict';

var methods = {
    init: function(settings) {

        var s = Object.assign({}, this.factory.defaults, settings);

        this.data = s.data;

        if (!this.data) {
            this.data = [];
            for (var i = 0; i < s.length; i++) {
                this.data[i] = 0;
            }
        }

        this.minHeight = s.minHeight;
        this.maxHeight = s.maxHeight;

        return this;
    },
    copy: function(settings) {
        var srcSettings = {
            data:      [].concat(this.data),
            minHeight: this.minHeight,
            maxHeight: this.maxHeight,
        };

        settings = Object.assign(srcSettings, settings);

        return this.factory(settings);
    },
};
module.exports = methods;
