'use strict';

/**
 * Created by m.chekryshov on 16.02.16.
 */

var TemplateGridAbstractStrategy = require('./abstract-strategy');
var utils = require('../utils');
var TemplateGridOptions = require('../data-objects/grid-options');
var _ = require('underscore');

/**
 * Inherited from AbstractStrategy
 *
 * @constructor
 */
function TemplateGridRowsStrategy() {
    TemplateGridRowsStrategy.super.constructor.apply(this, arguments);
}

utils.extendClass(TemplateGridRowsStrategy, TemplateGridAbstractStrategy);

_.extend(TemplateGridRowsStrategy.prototype, {
    /**
     * Apply sorting
     *
     */
    sortInternalData: function() {
        var options = this.context.options;

        if (!options.sortable || !options.sortColumn) {
            return;
        }

        this.internalData = this.sortRows(this.internalData, options.sortColumn, options.sortDirection);
    },

    /**
     * Convert source data to special internal format
     *
     */
    initInternalData: function() {
        this.internalData = this.convertToInternalRows()
    }
});

module.exports = TemplateGridRowsStrategy;

