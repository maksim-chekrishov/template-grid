'use strict';

/**
 * Created by m.chekryshov on 16.02.16.
 */

var _ = require('underscore');
var TemplateGridAbstractStrategy = require('./template-grid-abstract-strategy');
var utils = require('./template-grid-utils');
var GridGroup = require('./template-grid-group');

function TemplateGridGroupsStrategy() {
    TemplateGridGroupsStrategy.super.constructor.apply(this, arguments);
}

utils.extendClass(TemplateGridGroupsStrategy, TemplateGridAbstractStrategy);

_.extend(TemplateGridGroupsStrategy.prototype, {
    /**
     * Convert source data to special internal format
     *
     */
    initInternalData: function() {
        var options = this.context.options;
        var internalRows = this.convertToInternalRows();

        var groupsMap = _.groupBy(internalRows, options.group);
        var groupsRows = _.values(groupsMap);

        this.internalData = _.map(groupsRows, function(groupRows) {
            new GridGroup({
                rowsData: groupRows,

            });
        });
    },

    /**
     * Apply sorting
     *
     */
    sortInternalData: function() {

    },

    /**
     * Render grid content
     *
     */
    renderContent: function() {

    }
});

module.exports = TemplateGridGroupsStrategy;
