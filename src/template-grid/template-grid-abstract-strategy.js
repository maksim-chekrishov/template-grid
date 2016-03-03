'use strict';

/**
 * Created by m.chekryshov on 16.02.16.
 */

var _ = require('underscore');
var $ = require('jquery');
var GridOptions = require('./template-grid-options');
var TemplateGridCell = require('./template-grid-cell');
var TemplateGridOptions = require('./template-grid-options');
var utils = require('./template-grid-utils');

/**
 * Abstract class for grid strategies
 *
 * @param {TemplateGrid} context - template grid instance
 * @constructor
 */
function AbstractStrategy(context, gridComponentsFactory) {
    this.context = context;
    this.gridComponentsFactory = gridComponentsFactory || this.gridComponentsFactory;

    this.rowsTemplate = gridComponentsFactory.resolveTemplate('rows');
    this.headerTemplate = gridComponentsFactory.resolveTemplate('header');
}

function virtualMethod() {
    console.warn('TemplateGridAbstractStrategy: virtual method should be overwritten at child class')
}

AbstractStrategy.ColumnCellClass = {
    SORTABLE: '_sortable',
    SORTED_ASC: '_sorted-asc',
    SORTED_DESC: '_sorted-desc'
}

_.extend(AbstractStrategy.prototype, {
    /**
     * Class for root element
     *
     */
    blockClass: 'template-grid',

    /**
     * Header template
     *
     */
    headerTemplate: null,

    /**
     * Rows template
     *
     */
    rowsTemplate: null,

    /**
     * Special internal format of data
     *
     */
    internalData: null,

    /**
     * Required for rendering
     *
     */
    defaultColumnWidth: null,

    cellStyleCache: null,

    elementsStyle: {
        '_default': '',
        '_root': 'width:100%',
        'header': 'width:100%',
        'header-cell-content': 'text-overflow: ellipsis; overflow: hidden;',
        'header-cell': 'display:inline-block',
        'cell': 'display:inline-block',
        'group-header-cell': 'display:inline-block',
        'cell-content': 'text-overflow: ellipsis; overflow: hidden;',
        'group-header-content': 'text-overflow: ellipsis; overflow: hidden;'
    },

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
     * Calculate params required for rendering
     */
    initRenderParams: function() {
        var containerWidth = this.context.$el.width();
        var columnsWidth = 0;
        var columnsWithoutWidthLength = 0;

        _.each(this.context.options.columns, function(col, i) {
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

    /**
     * Get basic styles for element.
     * This styles make grid look like table
     *
     * @param {string} [elementName = '_root']
     * @returns {string}
     */
    getElementStyle: function(elementName) {
        if (!elementName) {
            return this.elementsStyle._root;
        }
        if (!this.elementsStyle.hasOwnProperty(elementName)) {
            return this.elementsStyle._default;
        }

        return this.elementsStyle[elementName];
    },

    /**
     * Build column cell classes
     *
     * @param {GridColumn} column
     */
    buildColumnCellClass: function(column) {
        var classes = [];
        var options = this.context.options;

        options.sortable && column.sortable && classes.push(AbstractStrategy.ColumnCellClass.SORTABLE);
        if (options.sortable && options.sortColumn == column.dataField) {
            options.sortDirection === TemplateGridOptions.SortDirection.DESC
                ? classes.push(AbstractStrategy.ColumnCellClass.SORTED_DESC)
                : classes.push(AbstractStrategy.ColumnCellClass.SORTED_ASC);
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
     * Add blocks (default and custom) prefixes for element
     *
     * @param {string} [elementName] - optional, returns root blocks classes when empty
     * @returns {string}
     */
    buildElementClass: function(elementName) {
        if (!elementName) {
            return utils.format('{0} {1}', this.blockClass, this.context.options.customBlockClass);
        }
        var customBlockClass = this.context.options.customBlockClass;
        var classes = utils.format('js-{1} {0}__{1}', this.blockClass, elementName);

        if (customBlockClass) {
            classes += utils.format(' {0}__{1}', customBlockClass, elementName)
        }

        return classes;
    },

    /**
     * Render grid header
     */
    renderHeader: function() {
        this.context.$el.append(this.headerTemplate({grid: this.context}));
        this.bindHeaderActions();
    },

    /**
     * Bind header actions
     *
     */
    bindHeaderActions: function(e) {
        var _this = this;
        this.context.$el.find('.js-header-cell').click(function(e) {
            _this.onHeaderCellClick.call(_this, e, this);
        });
    },

    /**
     * Sort rows
     *
     * @param {Array.<Object.<string,GridCell>>} rowsData
     * @param {string} sortColumn
     * @param {string} sortDirection
     * @returns {Object.<string,GridCell>} sorted rowsData
     */
    sortRows: function(rowsData, sortColumn, sortDirection) {
        var sortedRows = _.sortBy(rowsData, function(row) {
            return row[sortColumn].value;
        });
        if (sortDirection === GridOptions.SortDirection.DESC) {
            sortedRows.reverse();
        }

        return sortedRows;
    },

    convertToInternalRows: function(rawRowsDataParam) {
        var rawRowsData = rawRowsDataParam || this.context.options.source;

        if (!rawRowsData || !rawRowsData.length) {
            return [];
        }

        return _.map(rawRowsData, this.convertToInternalRow.bind(this));
    },

    convertToInternalRow: function(rawRowData) {
        var _this = this;

        return _.mapObject(_this.context.columnsIndexedByDataField, function(columnOptions, dataField) {
            var formatter = columnOptions.formatter || _this.context.defaultColumnFormatter;
            var value = rawRowData[dataField];

            return new TemplateGridCell({
                value: value,
                dataField: dataField,
                text: formatter(value, rawRowData)
            });
        });
    },

    /**
     * Get element dataField
     *
     * @param {dom element} el
     */
    getElementDataField: function(el) {
        return $(el).data('datafield');
    },

    /**
     * On header click
     *
     * @param {event args} e
     * @param {event context} eventContext
     */
    onHeaderCellClick: function(e, eventContext) {
        var dataField = this.getElementDataField(eventContext);
        var options = this.context.options;

        if (!options.sortable || !this.context.columnsIndexedByDataField[dataField].sortable) {
            return;
        }

        var SortDirection = GridOptions.SortDirection;

        if (!options.sortColumn || options.sortColumn !== dataField) {
            options.sortColumn = dataField;
            options.sortDirection = SortDirection.ASC;
        } else {
            // If grid already sorted by this column
            options.sortDirection = !options.sortDirection || options.sortDirection === SortDirection.ASC
                ? SortDirection.DESC
                : SortDirection.ASC;
        }

        this.sortInternalData();
        this.context._render();
    },

    /**
     * Render grid content
     *
     */
    renderContent: function() {
        this.context.$el.append(this.rowsTemplate({
            grid: this.context,
            rowsData: this.internalData
        }));
    }
});

module.exports = AbstractStrategy;
