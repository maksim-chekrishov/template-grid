'use strict';

/**
 * Created by m.chekryshov on 02.03.16.
 */
var _ = require('underscore');
var $ = require('jquery');

function ComponentsFactory(options) {
    // deep extend
    $.extend(true, this, options);
};

_.extend(ComponentsFactory.prototype, {
    /**
     * Templates
     *
     */
    templateByName: {
        header: require('jade!./templates/header-template.jade'),
        rows: require('jade!./templates/rows-template.jade'),
        groupHeader: require('jade!./templates/group-header-template.jade')
    },

    strategyByName: {
        groups: require('./strategies/groups-strategy'),
        rows: require('./strategies/rows-strategy')
    },

    resolveTemplate: function(name) {
        return this.templateByName[name];
    },

    /**
     * Resolve strategy for grid instance
     *
     * @param {TemplateGrid} gridInstance
     * @returns {*}
     */
    resolveStrategy: function(gridInstance) {
        return gridInstance.hasGroups()
            ? this.strategyByName['groups']
            : this.strategyByName['rows'];
    }
});

module.exports = ComponentsFactory;