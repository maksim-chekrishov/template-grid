'use strict';

/**
 * Created by m.chekryshov on 16.02.16.
 */

var _ = require('underscore');
var $ = require('jquery');
var GridOptions = require('./template-grid-options');
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
     * Header template
     *
     */
    headerTemplate: require('jade!./template-grid-header-template.jade'),

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
            this.context.warn('onHeaderCellClick: sortable mode is disabled');
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
        this.context.clear();
        this.renderHeader();
        this.renderContent();
    }
});

module.exports = TemplateGridAbstractStrategy;
