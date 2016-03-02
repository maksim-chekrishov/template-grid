'use strict';

/**
 * Created by m.chekryshov on 12.02.16.
 */
var utils = require('./template-grid-utils');
var RowsStrategy = require('./template-grid-rows-strategy');
var GroupsStrategy = require('./template-grid-groups-strategy');
var TemplateGridCell = require('./template-grid-cell');
var TemplateGridOptions = require('./template-grid-options');
var _ = require('underscore');
var DefaultComponentsFactory = require('./template-grid-components-factory');

/**
 * Grid constructor
 *
 * @param {jQuery} $containerEl
 * @param {GridOptions} options
 * @param {GridComponentsFactory} gridComponentsFactory
 */
function TemplateGrid($containerEl, options, gridComponentsFactory) {
    this.$el = $containerEl;
    this.options = options;
    this.columnsIndexedByDataField = options.indexColumnsByDataField();
    this.gridComponentsFactory = gridComponentsFactory || this.gridComponentsFactory;

    var RowsStrategy = this.gridComponentsFactory.resolveStrategy('rows');
    var GroupsStrategy = this.gridComponentsFactory.resolveStrategy('groups');

    this.strategy = this.hasGroups()
        ? new GroupsStrategy(this, this.gridComponentsFactory)
        : new RowsStrategy(this, this.gridComponentsFactory);
}

TemplateGrid.ElementStyle = {
    '_default': '',
    '_root': 'width:100%',
    'header': 'width:100%',
    'header-cell-content': 'text-overflow: ellipsis; overflow: hidden;',
    'header-cell': 'display:inline-block',
    'cell': 'display:inline-block',
    'group-header-cell': 'display:inline-block',
    'cell-content': 'text-overflow: ellipsis; overflow: hidden;',
    'group-header-content': 'text-overflow: ellipsis; overflow: hidden;'
}

TemplateGrid.ColumnHeaderClass = {
    SORTABLE: '_sortable',
    SORTED_ASC: '_sorted-asc',
    SORTED_DESC: '_sorted-desc'
}

_.extend(TemplateGrid.prototype, {
    MIN_COLUMN_WIDTH: 10,

    cellStyleCache: null,

    blockClass: 'template-grid',

    gridComponentsFactory: new DefaultComponentsFactory(),

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
            return utils.format('{0} {1}', this.blockClass, this.options.customBlockClass);
        }
        var customBlockClass = this.options.customBlockClass;
        var classes = utils.format('js-{1} {0}__{1}', this.blockClass, elementName);

        if (customBlockClass) {
            classes += utils.format(' {0}__{1}', customBlockClass, elementName)
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
        var options = this.options;

        this.options.sortable && columnOptions.sortable && classes.push(TemplateGrid.ColumnHeaderClass.SORTABLE);
        if (options.sortable && options.sortColumn == columnOptions.dataField) {
            options.sortDirection === TemplateGridOptions.SortDirection.DESC
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

        var style = utils.format('width: {0}px; text-align: {1};',
            column.width || this.defaultColumnWidth,
            column.textAlign);

        this.cellStyleCache[column.dataField] = style;

        return style;
    },

    /**
     * Get basic styles for element.
     * This styles make grid look like table
     *
     * @param {string} [elementName = '_root']
     * @returns {string}
     */
    getElementStyle: function(elementName) {

        if (!elementName) {
            return TemplateGrid.ElementStyle._root;
        }
        if (!TemplateGrid.ElementStyle.hasOwnProperty(elementName)) {
            return TemplateGrid.ElementStyle._default;
        }

        return TemplateGrid.ElementStyle[elementName];
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

        this.defaultColumnWidth = Math.floor(availableSpace / columnsWithoutWidthLength);

        if (this.defaultColumnWidth < this.MIN_COLUMN_WIDTH) {
            this.defaultColumnWidth = this.MIN_COLUMN_WIDTH;
        }
    },

    render: function() {
        this.initRenderParams();
        this.strategy.initInternalData();
        this.strategy.sortInternalData();

        this._render();
        return this;
    },

    _render: function() {
        this.clear();
        this.strategy.renderHeader();
        this.strategy.renderContent();
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
     * @param {Object} [rawRowData]
     * @returns {string}
     */
    defaultColumnFormatter: function(cellData, rawRowData) {
        var str = cellData + '';
        return str.length
            ? str
            : this.options.noDataText;
    }
});

module.exports = TemplateGrid;
