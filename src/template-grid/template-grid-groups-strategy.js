'use strict';

/**
 * Created by m.chekryshov on 16.02.16.
 */

var _ = require('underscore');
var TemplateGridAbstractStrategy = require('./template-grid-abstract-strategy');
var utils = require('./template-grid-utils');
var GridGroup = require('./template-grid-group');
var GridOptions = require('./template-grid-options');
var $ = require('jquery');

function TemplateGridGroupsStrategy() {
    TemplateGridGroupsStrategy.super.constructor.apply(this, arguments);

    this.groupHeaderTemplate = this.gridComponentsFactory.resolveTemplate('groupHeader');
}

utils.extendClass(TemplateGridGroupsStrategy, TemplateGridAbstractStrategy);

_.extend(TemplateGridGroupsStrategy.prototype, {

    groupHeaderTemplate: null,

    /**
     * Convert source data to special internal format
     *
     */
    initInternalData: function() {
        var options = this.context.options;
        var internalRows = this.convertToInternalRows();

        var groupsMap = _.groupBy(internalRows, function(rowData) {
            var groupData = _.pick(rowData, options.group);
            var groupHash = _.map(groupData, function(cellData) {
                return cellData.value;
            }).join('_');

            return groupHash;
        });

        var groupsRows = _.values(groupsMap);

        this.internalData = _.map(groupsRows, function(groupRows) {
            var summaryRowData = options.groupSummaryRowBuilder
                ? options.groupSummaryRowBuilder(groupRows)
                : null;

            return new GridGroup({
                rows: groupRows,
                summaryRow: summaryRowData
            });
        });
    },

    /**
     * Apply sorting
     *
     */
    sortInternalData: function() {
        var options = this.context.options;
        var _this = this;

        if (!options.sortable || !options.sortColumn) {
            return;
        }

        _.each(this.internalData, function(groupData) {
            groupData.rows = _this.sortRows(groupData.rows, options.sortColumn, options.sortDirection);
        });

        this.internalData = _.sortBy(this.internalData, function(groupData) {
            var targetRow = groupData.summaryRow || groupData.rows[0];

            return targetRow[options.sortColumn].value;
        });

        if (options.sortDirection === GridOptions.SortDirection.DESC) {
            this.internalData.reverse();
        }
    },

    /**
     * Render grid content
     *
     */
    renderContent: function() {
        var _this = this;

        var $fragment = $(document.createDocumentFragment());

        _.each(this.internalData, function(groupData) {

            var $header = $(_this.groupHeaderTemplate({
                grid: _this.context,
                groupData: groupData
            }));

            var $rows = $(_this.rowsTemplate({
                grid: _this.context,
                rowsData: groupData.rows
            }));

            $fragment.append($header)
                .append($rows);
        });

        _this.context.$el.append($fragment);
    }
});

module.exports = TemplateGridGroupsStrategy;
