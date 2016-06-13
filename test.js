'use strict';

var rng = Math.random;

var range = function(min, max) {
    return Math.floor(rng() * (max - min + 1)) + min;
};

var randomArray = function(arr) {
    return arr[range(0, arr.length - 1)];
}

var getChunkSizes = function(length, min, max) {

    var remaining = length;
    var chunks    = [];

    while (remaining > 0) {
        var chunkSize = range(min, max);
        chunkSize = Math.min(remaining, chunkSize);

        remaining -= chunkSize;
        chunks.push(chunkSize);
    }

    return chunks;
};

var arraySum = function(arr) {
    return arr.reduce((prev, curr) => prev + curr);
}

var arrayFilterIndexes = function(arr, func){
    var out = [];
    arr.forEach(function(val, i){
        if(func(val, i, arr)){
            out.push(i);
        }
    });
    return out;
};

var randomFilteredArrayIndex = function(arr, func){

    var validIndexes = arrayFilterIndexes(arr, func);

    if (!validIndexes.length) {
        return false;
    }

    return randomArray(validIndexes);
}

var distributeFromValid = function(arr, min, max, length) {
    var invalidIndex = arr.length - 1;

    arr = [].concat(arr);

    while (arr[invalidIndex] < min) {

        var validIndex = randomFilteredArrayIndex(arr, (val) => val > min );

        if(validIndex === false){
            break;
        }

        arr[validIndex]--;
        arr[invalidIndex]++;

    }

    return arr;
};

var distributeToValid = function(arr, min, max, length) {
    arr = arr.filter((val) => val >= min);

    while (arraySum(arr) < length) {

        var validIndex = randomFilteredArrayIndex(arr, (val) => val > min );

        if(validIndex === false){
            break;
        }

        arr[validIndex]++;
    }

    return arr;
};

var distribute = function(arr, min, max, length) {
    var sum     = arraySum(arr);
    var valid   = arr.filter((v) => v >= min);
    var invalid = arr.filter((v) => v < min);

    if (!invalid.length) {
        return arr;
    }

    var availableToRemove    = valid.map((v) => v - min);
    var availableToRemoveSum = arraySum(availableToRemove);
    var availableToAdd       = valid.map((v) => max - v);
    var availableToAddSum    = arraySum(availableToAdd);

    var needToAdd = min - invalid[0];

    var canDistributeFromValid = availableToRemoveSum >= needToAdd;
    var canDistributeToValid   = availableToAddSum >= invalid + needToAdd;

    var options = [];

    if (canDistributeFromValid) {
        options.push(distributeFromValid);
    }
    if (canDistributeToValid) {
        options.push(distributeToValid);
    }

    if (!options.length) {
        return;
    }
    var func = randomArray(options);
    var result = func(arr, min, max, length);
    var invalid = result.filter((v) => v < min);

    if (invalid.length) {


        console.log(' ---');
        console.log('INVALID');
        console.log(arr, arraySum(arr));
        console.log('invalid', invalid[0]);
        console.log('needToAdd', needToAdd);

        console.log('valid', valid);
        console.log('availableToRemove', availableToRemove);
        console.log('availableToRemoveSum', availableToRemoveSum);
        console.log('availableToAdd', availableToAdd);
        console.log('availableToAddSum', availableToAddSum);

        console.log('r', result);
        console.log(' ---');

    }

    return result;
}

var test = function() {

    var length = 200;
    var min    = 27;
    var max    = 100;

    var x = getChunkSizes(length, min, max);
    var result = distribute(x, min, max, length);

    console.log('result', result);
}

var c = 1000;
while (c--) {
    test();
}
