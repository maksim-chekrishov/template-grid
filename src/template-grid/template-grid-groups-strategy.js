'use strict';

/**
 * Created by m.chekryshov on 16.02.16.
 */

var TemplateGridAbstractStrategy = require('./template-grid-abstract-strategy');
var helpers = require('app/modules/helpers');

function TemplateGridGroupsStrategy() {
  TemplateGridGroupsStrategy.super.constructor.apply(this, arguments);
}

helpers.extendClass(TemplateGridGroupsStrategy, TemplateGridAbstractStrategy);

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
