'use strict';

/**
 * Created by m.chekryshov on 12.02.16.
 */
var utils = require('./utils');
var TemplateGridOptions = require('./data-objects/grid-options');
var _ = require('underscore');
var DefaultComponentsFactory = require('./components-factory');

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

    var Strategy =  this.gridComponentsFactory.resolveStrategy(this);

    this.strategy = new Strategy(this, this.gridComponentsFactory);
}

_.extend(TemplateGrid.prototype, {

    gridComponentsFactory: new DefaultComponentsFactory(),

    render: function() {
        this.strategy.initRenderParams();
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
            .addClass(this.strategy.buildElementClass())
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
