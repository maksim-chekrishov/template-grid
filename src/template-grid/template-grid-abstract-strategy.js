'use strict';

/**
 * Created by m.chekryshov on 16.02.16.
 */

/**
 * Abstract class for grid strategies
 *
 * @param {TemplateGrid} context - template grid instance
 * @constructor
 */
function TemplateGridAbstractStrategy(context) {
  this.context = context;
}

function virtualMethod() {
  console.warn('TemplateGridAbstractStrategy: virtual method should be overwritten at child class')
}

_.extend(TemplateGridAbstractStrategy.prototype, {
  /**
   * Current sorting state
   *
   */
  sortingState: null,

  /**
   * Header template
   *
   */
  headerTemplate: require('./template-grid-header-template.jade'),

  /**
   * Special internal format of data
   *
   */
  internalData: null,

  /**
   * Apply sorting
   *
   */
  sortInternalData: virtualMethod,

  /**
   * Convert source data to special internal format
   *
   */
  initInternalData: virtualMethod,

  /**
   * Render grid content
   *
   */
  renderContent: virtualMethod,

  /**
   * Render grid header
   */
  renderHeader: function() {
    this.context.$el.append(this.headerTemplate({view: this.context}));
  },

  /**
   * Apply sorting state
   *
   */
  applySortingState: function() {
    var options = this.context.options;

    this.sortingState = {
      sortColumn: options.sortColumn,
      sortDirection: options.sortDirection
    };
  }
});

module.exports = TemplateGridAbstractStrategy;
