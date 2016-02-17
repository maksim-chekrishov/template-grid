'use strict';

/**
 * Created by m.chekryshov on 15.02.16.
 */
function GridOptions(options) {
  _.extend(this, options);
}

/**
 * Sort direction enum
 *
 * @type {{ASC: string, DESC: string}}
 */
GridOptions.SortDirection = {
  ASC: 'asc',
  DESC: 'desc'
};

_.extend(GridOptions.prototype, {
  /**
   * Data source
   *
   * @type {Array}
   */
  source: true,

  /**
   * Sortable flag
   *
   * @type {boolean}
   */
  sortable: true,

  /**
   * Column for initial sorting
   *
   * @type {string}
   */
  sortColumn: null,

  /**
   * Sort direction for initial sorting
   *
   * @type {SortDirection}
   */
  sortDirection: GridOptions.SortDirection.ASC,

  /**
   * DataField name or function(dataItem)
   *
   * @type {string|Function}
   */
  group: null,

  /**
   * Columns options
   *
   * @type {Array.<GridColumn>}
   */
  columns: null,

  /**
   * No data text, will be applied for undefined and null
   *
   * @type {string}
   */
  noDataText: 'n/a',

  /**
   * Custom block class for example 'components-grid'.
   * This class will be applied for all grid elements (components-grid__row)
   *
   * @type {string}
   */
  customBlockClass: null,

  /**
   * Index columns options by dataField
   *
   * @returns {Object}
   */
  indexColumnsByDataField: function() {
    if (!this.columns || !this.columns.length) {
      return {};
    }
    return _.indexBy(this.columns, 'dataField');
  }
})

module.exports = GridOptions;
