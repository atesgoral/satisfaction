Satisfaction
------------
Multiple asynchronous callback synchronization for JavaScript

Copyright (c) 2011 Ates Goral

MIT or BSD license.

What
----
Treading a similar territory with Promises/Futures, Satisfaction allows you to
synchronize the outcome of multiple asychronous callbacks, and to execute a
function only when all callbacks are called. It handles the record keeping for
you. The return results of the asynchronous callbacks become arguments (in the
original order in which the callbacks were intercepted) for the ultimate
callback.

Satisfaction is optimistic. By design, it doesn't aim to handle failures.

The Problem
-----------
Suppose you're firing two (or more) asynchronous operations with callbacks which
may get called in any order and you want to run some code when all callbacks
are called.

    var result1, result2;

    startAsyncOperation1(function (result) {
        // this is success callback 1
        result1 = result;
        
        // if result2 already received, go ahead and process both
        if (result2) {
            processResults();
        }
    });

    startAsyncOperation2(function (result) {
        // this is success callback 2
        result2 = result;

        // if result1 already received, go ahead and process both
        if (result1) {
            processResults();
        }
    });

    function processResults() {
        // do something with result1 and result2
    }

We have redundant and repetitive checks to ensure that the result processing is
only done when all results are received. Imagine doing this for not 2 but 3, 4,
5, etc. callbacks. A complex mashup of data from multiple sources could easily
get out of hand.

One obvious solution to this problem is to pipeline the asynchronous operations,
by forsaking the ability to run them in parallel.

The Solution
------------
Satisfaction provides the syntactic sugar (with shameless puns when it comes to
method names) to let you wait on multiple asynchronous operations (that run
in parallel) and finally execute a function that processes all of their
collected results. Here's a more satisfactory rendition of the scenario above:

    var satisfaction = new Satisfaction(function (result1, result2) {
        // do something with result1 and result2
    });

    startAsyncOperation1(satisfaction.from(function (result) {
        // this is success callback 1
        return result;
    }));

    startAsyncOperation2(satisfaction.from(function (result) {
        // this is success callback 2
        return result;
    }));

    satisfaction.guarantee();

See sample.html for a more fanciful example with more verbose comments.
