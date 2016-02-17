'use strict';

/**
 * Created by m.chekryshov on 12.02.16.
 */
var helpers = require('app/modules/helpers');
var RowsStrategy = require('./template-grid-rows-strategy');
var GroupsStrategy = require('./template-grid-groups-strategy');
var TemplateGridCell = require('./template-grid-cell');
var TemplateGridOptions = require('./template-grid-options');

/**
 * Grid constructor
 *
 * @param {jQuery} $containerEl
 * @param {GridOptions} options
 */
function TemplateGrid($containerEl, options) {
  this.$el = $containerEl;
  this.options = options;

  this.strategy = this.hasGroups()
    ? new GroupsStrategy(this)
    : new RowsStrategy(this)
}

TemplateGrid.RenderContentMode = {
  /**
   * Init/reinit rowsData from source,
   * apply sorting and render
   *
   */
  FULL: 'full',

  /**
   * Render by exististing row data
   *
   */
  REFRESH: 'REFRESH'
}

TemplateGrid.ColumnHeaderClass = {
  SORTABLE: '_sortable',
  SORTED_ASC: '_sorted-asc',
  SORTED_DESC: '_sorted-desc'
}

_.extend(TemplateGrid.prototype, {
  MIN_COLUMN_WIDTH: 10,

  cellStyleCache: null,

  groupsData: null,

  rowsData: null,

  blockClass: 'template-grid',

  /**
   * Required for rendering
   *
   */
  defaultColumnWidth: null,

  /**
   * Add blocks (default and custom) prefixes for element
   *
   * @param {string} [elementName] - optional, returns root blocks classes when empty
   * @returns {string}
   */
  buildElementClass: function(elementName) {
    if (!elementName) {
      return helpers.format('{0} {1}', this.blockClass, this.options.customBlockClass);
    }
    var customBlockClass = this.options.customBlockClass;
    var classes = helpers.format('{0}__{1}', this.blockClass, elementName);

    if (customBlockClass) {
      classes += helpers.format(' {0}__{1}', customBlockClass, elementName)
    }

    return classes;
  },

  warn: function(message) {
    console.warn('TemplateGrid: ' + message);
  },

  /**
   * Build column header class
   *
   * @param {GridColumn} columnOptions
   */
  buildColumnHeaderClasses: function(columnOptions) {
    var classes = [];
    var sortingState = this.strategy.sortingState;

    this.options.sortable && columnOptions.sortable && classes.push(TemplateGrid.ColumnHeaderClass.SORTABLE);
    if (sortingState.sortColumn == columnOptions.dataField) {
        sortingState.sortDirection === TemplateGridOptions.SortDirection.DESC
          ? classes.push(TemplateGrid.ColumnHeaderClass.SORTED_DESC)
          : classes.push(TemplateGrid.ColumnHeaderClass.SORTED_ASC);
    }

    return classes.join(' ');
  },

  /**
   * Build cell style
   *
   * @param column
   * @returns {*}
   */
  buildCellStyle: function(column) {
    this.cellStyleCache = this.cellStyleCache || {};

    if (this.cellStyleCache.hasOwnProperty(column.dataField)) {
      return this.cellStyleCache[column.dataField];
    }

    var style = helpers.format('width: {0}px; text-align: {1};',
      column.width || this.defaultColumnWidth,
      column.textAlign);

    this.cellStyleCache[column.dataField] = style;

    return style;
  },

  /**
   * Calculate params required for rendering
   */
  initRenderParams: function() {
    var containerWidth = this.$el.width();
    var columnsWidth = 0;
    var columnsWithoutWidthLength = 0;

    _.each(this.options.columns, function(col, i) {
      col.width
        ? columnsWidth += col.width
        : columnsWithoutWidthLength++;
    });

    var availableSpace = containerWidth - columnsWidth;

    this.defaultColumnWidth = Math.round(availableSpace / columnsWithoutWidthLength);

    if (this.defaultColumnWidth < this.MIN_COLUMN_WIDTH) {
      this.defaultColumnWidth = this.MIN_COLUMN_WIDTH;
    }
  },

  render: function() {
    this.clear();
    this.initRenderParams();
    this.strategy.renderHeader();
    this.renderContent(TemplateGrid.RenderContentMode.FULL);

    return this;
  },

  hasGroups: function() {
    return !!this.options.group;
  },

  clear: function() {
    this.$el
      .css('width', '100%')
      .addClass(this.buildElementClass())
      .empty();
  },

  /**
   * Default column formatter,
   * will be applied for columns without custom formatter
   *
   * @param {*} cellData
   * @param {Object} rawRowData
   * @returns {string}
   */
  defaultColumnFormatter: function(cellData, rawRowData) {
    var str = cellData + '';
    return str.length
      ? str
      : this.options.noDataText;
  },

  /**
   * Convert raw data from source to special format for rows
   *
   * @param {Array} [rawRowsData = source]
   * @returns {*}
   */
  convertToRowsData: function(rawRowsDataParam) {

    var rawRowsData = rawRowsDataParam || this.options.source;

    if (!rawRowsData || !rawRowsData.length) {
      return [];
    }

    var _this = this;
    var columnsIndexedByDataField = this.options.indexColumnsByDataField();

    return _.map(rawRowsData, function(rawRowData) {
      return _.mapObject(columnsIndexedByDataField, function(columnOptions, dataField) {
        var formatter = columnOptions.formatter || _this.defaultColumnFormatter;
        var value = rawRowData[dataField];

        return new TemplateGridCell({
          value: value,
          dataField: dataField,
          text: formatter(value, rawRowData)
        });
      });
    });
  },

  /**
   * Render content in supplied mode
   *
   * @param {TemplateGrid.RenderContentMode} renderMode
   */
  renderContent: function(renderMode) {
    if (renderMode === TemplateGrid.RenderContentMode.FULL) {
      this.strategy.initInternalData();
      this.strategy.sortInternalData();
      this.strategy.renderContent();
    } else if (TemplateGrid.RenderContentMode.REFRESH) {
      this.strategy.renderContent();
    } else {
      this.warn('Incorrect mode for render content method');
      return;
    }
  }
});

module.exports = TemplateGrid;
