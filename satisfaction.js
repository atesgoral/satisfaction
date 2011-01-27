/**
 * Satisfaction
 *
 * Multiple asynchronous callback synchronization for JavaScript
 *
 * Copyright (c) 2011 Ates Goral
 *
 * MIT or BSD license. Does something this short even need a license?
 */
function Satisfaction(satisfy, scope) {
    var queued = 0,
        met = 0,
        results = [],
        wanting;

    function guarantee() {
        queued == met && satisfy.apply(scope, results.concat(wanting.args));
    }
    
    this.from = function (callback, scope) {
        return (function (satisfaction, idx) {
            return function () {
                if (callback) {
                    results[idx] = callback.apply(scope || this, arguments);
                }
                met++;
                wanting && guarantee();
            }
        })(this, queued++);
    };
    
    this.guarantee = function () {
        wanting = { args: Array.prototype.slice.call(arguments) };
        guarantee();
    };
}
