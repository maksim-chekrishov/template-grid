'use strict';

/**
 * Created by m.chekryshov on 16.02.16.
 */

var TemplateGridAbstractStrategy = require('./template-grid-abstract-strategy');
var helpers = require('app/modules/helpers');
var TemplateGridOptions = require('./template-grid-options');

function TemplateGridRowsStrategy() {
  TemplateGridRowsStrategy.super.constructor.apply(this, arguments);
}

helpers.extendClass(TemplateGridRowsStrategy, TemplateGridAbstractStrategy);

_.extend(TemplateGridRowsStrategy.prototype, {

  contentTemplate: require('./template-grid-rows-template.jade'),

  /**
   * Apply sorting
   *
   */
  sortInternalData: function() {
    var options = this.context.options;

    if (!options.sortable || !options.sortColumn) {
      return;
    }

    this.internalData = _.sortBy(this.internalData, options.sortColumn);

    if (options.sortDirection === TemplateGridOptions.SortDirection.DESC) {
      this.internalData.reverse();
    }

    this.applySortingState();
  },

  /**
   * Convert source data to special internal format
   *
   */
  initInternalData: function() {
    this.internalData = this.context.convertToRowsData();
  },

  /**
   * Render grid content
   *
   */
  renderContent: function() {
    this.context.$el.append(this.contentTemplate({view: this.context, internalData: this.internalData}));
  }

});

module.exports = TemplateGridRowsStrategy;

