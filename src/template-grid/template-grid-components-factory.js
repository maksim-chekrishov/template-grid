'use strict';

/**
 * Created by m.chekryshov on 02.03.16.
 */
var _ = require('underscore');

function ComponentsFactory(options) {
    _.extend(this, options);
};

_.extend(GridGroup.prototype, {
    /**
     * Summary rows data can be calculated for each groups
     *
     */
    templatesByName: {
        header: require('jade!./template-grid-header-template.jade'),
    },

    /**
     * RowsData
     *
     */
    rows: null
});

module.exports = GridGroup;