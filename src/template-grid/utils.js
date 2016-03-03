'use strict';

/**
 * Created by m.chekryshov on 18.02.16.
 */
module.exports = {
    /**
     * Extend class
     *
     * @param Child
     * @param Parent
     */
    extendClass: function(Child, Parent) {
        var F = function() {
        };
        F.prototype = Parent.prototype;
        Child.prototype = new F();
        Child.prototype.constructor = Child;
        Child.super = Parent.prototype;
    },

    /**
     * Simple formatting function
     *
     * @param {string}
     * @return {string}
     *
     * @example
     * this.format('His name was {0} {1}.','Maksim','Kindzadza') // => 'His name was Maksim Kindzadza.'
     */

    format: function(str) {
        var args = Array.prototype.slice.call(arguments);
        args.shift();

        if (!args || !args.length) {
            return str;
        }

        return str.replace(/\{\{|\}\}|\{(\d+)\}/g, function(m, n) {
            if (m === '{{') {
                return '{';
            }

            if (m === '}}') {
                return '}';
            }

            return args[n];
        });
    }
}