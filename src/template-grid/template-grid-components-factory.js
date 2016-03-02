'use strict';

/**
 * Created by m.chekryshov on 02.03.16.
 */
var _ = require('underscore');

function ComponentsFactory(options) {
    _.extend(this, options);
};

_.extend(ComponentsFactory.prototype, {
    /**
     * Templates
     *
     */
    templateByName: {
        header: require('jade!./template-grid-header-template.jade'),
        rows: require('jade!./template-grid-rows-template.jade'),
        groupHeader: require('jade!./template-grid-group-header-template.jade')
    },

    strategyByName: {
        groups: require('./template-grid-groups-strategy'),
        rows: require('./template-grid-rows-strategy')
    },

    resolveTemplate: function(name) {
        return this.templateByName[name];
    },

    resolveStrategy: function(name) {
        return this.strategyByName[name];
    }
});

module.exports = ComponentsFactory;