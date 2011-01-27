/**
 * Satisfaction
 *
 * Multiple asynchronous callback synchronization for JavaScript
 *
 * Copyright (c) 2011 Ates Goral
 *
 * MIT or BSD license. Does something this short even need a license?
 */
 
 /**
  * @param satisfy Callback to call when all async expectations are satisfied
  * @param scope The optional callback scope
  */
 function Satisfaction(satisfy, scope) {
    var queued = 0,
        met = 0,
        results = [],
        wanting;

    function guarantee() {
        results.push.apply(results, wanting.args);
        queued == met && satisfy.apply(scope, results);
    }
    
    /**
     * Set an expectation by intercepting a callback
     * @param callback The callback function we're intercepting
     */
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
    
    /**
     * Call when you're done setting expectations
     */     
    this.guarantee = function () {
        wanting = { args: arguments };
        guarantee();
    };
}
