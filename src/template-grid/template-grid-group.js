'use strict';

/**
 * Created by m.chekryshov on 26.02.16.
 */


var _ = require('underscore');

function GridGroup() {
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
    rowsData: null
});

module.exports = GridGroup;