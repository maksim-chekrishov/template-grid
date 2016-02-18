'use strict';

/**
 * Created by m.chekryshov on 16.02.16.
 */

var _ = require('underscore');
var TemplateGridAbstractStrategy = require('./template-grid-abstract-strategy');
var utils = require('./template-grid-utils');

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
    this.internalData = [];

    _.each(this.context.options.source, function(raw) {

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
