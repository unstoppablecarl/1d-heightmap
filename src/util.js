'use strict';

var arg = function(val, defaultVal) {
    return val !== undefined ? val : defaultVal;
};

module.exports = {
    arg: arg,

    makeArray: function(length, value) {
        value = arg(value, 0);
        var a = [];

        for (var i = 0; i < length; i++) {
            a[i] = value;
        }
        return a;
    },

    /**
     * Slice array values within given range relative to i
     * @method sliceRelativeRange
     * @param {Array} array
     * @param {Number} i - index
     * @param {Number} range - number of array values to include before and after i
     * @return {Array}
     */
    sliceRelativeRange: function(array, i, range) {
        var minI = Math.max(i - range, 0);
        var maxI = i + range + 1;
        return array.slice(minI, maxI);
    },
    arrayChunk: function(array, startIndex, endIndex) {
        var minI = Math.max(startIndex, 0);
        var maxI = endIndex + 1;
        return array.slice(minI, maxI);
    }

};