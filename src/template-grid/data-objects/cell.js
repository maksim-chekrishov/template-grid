'use strict';

var _ = require('underscore');

/**
 * Created by m.chekryshov on 16.02.16.
 */
function TemplateGridCell(options) {
  _.extend(this, options);
}

_.extend(TemplateGridCell.prototype, {
  /**
   * Data field name
   *
   */
  dataField: null,
  /**
   * Cell text
   *
   */
  html: null,
  /**
   * Origin value
   *
   */
  value: null
});

module.exports = TemplateGridCell;
