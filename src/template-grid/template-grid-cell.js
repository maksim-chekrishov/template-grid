'use strict';

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
  text: null,
  /**
   * Origin value
   *
   */
  value: null
});

module.exports = TemplateGridCell;
