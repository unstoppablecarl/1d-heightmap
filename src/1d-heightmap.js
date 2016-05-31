'use strict';

var factory = function OneDHeightmap(settings) {
    return Object.create(factory.methods).init(settings);
};

factory.methods = Object.assign(
    {
        factory: factory
},
    require('./methods/mergers'),
    require('./methods/init'),
    require('./methods/iterators'),
    require('./methods/transformations')
);

module.exports = factory;