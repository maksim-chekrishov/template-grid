'use strict';

/**
 * Created by m.chekryshov on 26.02.16.
 */


var _ = require('underscore');

function GridGroup(options) {
    _.extend(this, options);
};

_.extend(GridGroup.prototype, {
    /**
     * Summary rows data can be calculated for each groups
     *
     */
    summaryRow: null,

    /**
     * RowsData
     *
     */
    rows: null
});

module.exports = GridGroup;