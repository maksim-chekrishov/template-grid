'use strict';

/**
 * Created by m.chekryshov on 03.03.16.
 */
var TemplateGrid = require('./template-grid');

module.exports = function($) {

    /**
     * Jquery wrapper for TemplateGrid
     *
     * @param {TemplateGridOptions} options
     * @param {TemplateGridComponetsFactory} [componentsFactory = defaultGridComponentsFactory]
     */
    $.fn.templateGrid = function(options, componentsFactory) {
        var dataKey = 'template-grid';

        if (!arguments.length) {
            return this.data(dataKey);
        }

        var gridInstance = new TemplateGrid(this, options, componentsFactory);

        this.data(dataKey, gridInstance);

        return this;
    }
}