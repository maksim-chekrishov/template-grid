'use strict';

/**
 * Created by m.chekryshov on 12.02.16.
 */


function GridColumn(options) {
  _.extend(this, options);
};

_.extend(GridColumn.prototype, {
  /**
   * Text align will be applied for column cells.
   *
   * @type {string}
   */
  textAlign: 'center',

  /**
   * Header text.
   *
   * @type {string}
   */
  text: null,

  /**
   * Name of data field
   *
   * @type {string}
   */
  dataField: null,

  /**
   * Column width
   *
   * @type {Number}
   */
  width: null,

  /**
   * Customer can disable sorting for concrete column
   *
   * @type {Number}
   */
  sortable: true,

  /**
   * Function to customize cell format
   * for example 90 => '90 км'
   *
   * @param {Object} cellValue
   * @param {Object} rawRowData
   * @returns {string}
   */
  formatter: null
});

module.exports = GridColumn;
