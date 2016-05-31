'use strict';

var makeArray = require('../util').makeArray;

var methods = {
    /**
     * Initialzie 1dHeightmap object.
     * @method init
     * @param {Object} [settings] - Settings object.
     * @param {Number} [settings.length] - Length of height map.
     * @param {Array}  [settings.data] - Length of height map. If set, settings.length is ignored.
     * @return {Object} Initialized 1dHeightmap object.
     */
    init: function(settings) {
        var s = settings || {};

        this.data = s.data || makeArray(s.length);

        return this;
    },
    copy: function() {
        var settings = {
            data: [].concat(this.data)
        };
        return this.factory(settings);
    },
    min: function() {
        return Math.min.apply(null, this.data);
    },
    max: function() {
        return Math.max.apply(null, this.data);
    },
    range: function() {
        return this.max() - this.min();
    }
};

module.exports = methods;
