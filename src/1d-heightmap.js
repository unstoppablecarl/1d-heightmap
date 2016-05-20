'use strict';

var factory = function OneDHeightmap(settings) {
    return Object.create(factory.methods).init(settings);
};

factory.defaults = {
    data:      null,
    length:    100,
    minHeight: 1,
    maxHeight: 20,
};

factory.methods = Object.assign(
    {
        factory: factory
    },
    require('./methods/compositions'),
    require('./methods/generators'),
    require('./methods/getters'),
    require('./methods/init'),
    require('./methods/iterators'),
    require('./methods/rng'),
    require('./methods/transformations')
);

module.exports = factory;