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

};