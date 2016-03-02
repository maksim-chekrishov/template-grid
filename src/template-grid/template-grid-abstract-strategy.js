'use strict';

/**
 * Created by m.chekryshov on 16.02.16.
 */

var _ = require('underscore');
var $ = require('jquery');
var GridOptions = require('./template-grid-options');
var TemplateGridCell = require('./template-grid-cell');

/**
 * Abstract class for grid strategies
 *
 * @param {TemplateGrid} context - template grid instance
 * @constructor
 */
function TemplateGridAbstractStrategy(context, gridComponentsFactory) {
    this.context = context;
    this.gridComponentsFactory = gridComponentsFactory || this.gridComponentsFactory;

    this.rowsTemplate = gridComponentsFactory.resolveTemplate('rows');
    this.headerTemplate = gridComponentsFactory.resolveTemplate('header');
}

function virtualMethod() {
    console.warn('TemplateGridAbstractStrategy: virtual method should be overwritten at child class')
}

_.extend(TemplateGridAbstractStrategy.prototype, {
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

module.exports = TemplateGridAbstractStrategy;
