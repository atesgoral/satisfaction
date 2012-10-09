<table>
<tr><th>Notice</th></tr>
<tr><td>
Satisfaction is long obsolete. Very shortly after its inception, the jQuery team announced (http://blog.jquery.com/2011/01/31/jquery-15-released/) support for Deferreds, immediately making Satisfaction obsolete.
I completely switched to using jQuery's Deferreds thereafter...
</td></tr>
</table>

Satisfaction
------------
Multiple asynchronous callback synchronization for JavaScript

Copyright (c) 2011 Ates Goral

MIT or BSD license.

Skip to the [Tutorial][1] or [API documentation][2].

What
----
Treading a similar territory with Promises/Futures, Satisfaction allows you to
wait for the outcome of multiple asychronous operations (that may be run in
**parallel**) and to execute a callback when all of them are complete. Because
Satisfaction allows the asynchronous operations to be carried out in parallel,
it is **n-fold faster** than chaining n asynchronous operations.

The return results of the callbacks to asynchronous operations become arguments
(in the original order in which the callbacks are intercepted) for the ultimate
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
forsaking the ability to run them in parallel:

    startAsyncOperation1(function (result1) {
        // have to wait for operation 1 to complete first
        startAsyncOperation2(function (result2) {
            processResults(result1, result2);
        });
    });

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

See [samples/satisfaction.html][3] for a more fanciful example with verbose
comments. [samples/naive.html][4] demonstrates the more naive approach of waiting
for one asynchronous operation before firing the next. The Satisfaction approach
in these samples is roughly **3 times faster** than the naive approach, simply
because it can handle the 3 operations in parallel.

There's also a [Tutorial][1]. See the [API documentation][2] for all the details.

[1]: https://github.com/atesgoral/satisfaction/wiki/Tutorial
[2]: https://github.com/atesgoral/satisfaction/wiki/API
[3]: https://github.com/atesgoral/satisfaction/blob/master/samples/satisfaction.html
[4]: https://github.com/atesgoral/satisfaction/blob/master/samples/naive.html
