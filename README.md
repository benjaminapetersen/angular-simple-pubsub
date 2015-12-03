# angular-simple-pubsub
A super simple pub/sub module for angular. This module provides a method for doing
pub/sub without using `$scope` or `$rootScope`.  Using scopes for pub/sub feels
a bit like a code smell, angular-simple-pubsub provides functionality as a service.

## Basic Usage

```javascript

// Usage in any angular component supporting injection.
// Created with directives & services in mind, not just controllers
.controller('myController', ['pubsub', function(pubsub) {

     // setup a couple of subscriptions
     var subscription1 = pubsub.subscribe('foo:bar', function(data) {
             console.log('subscription1', data);
         }),
         subscription2 = pubsub.subscribe('/baz/bam', function(data) {
             console.log('subscription2', data);
         });

     // publish some arbitrary data
     pubsub.publish('foo:bar', {msg: 'Hello World!'});
     pubsub.publish('/baz/bam', {msg: 'Greetings World!'});


     // take a look at all the current subscriptions
     pubsub.utils.get() // -> {'foo:bar': Array[1], '/baz/bam': Array[1]}

     // be sure to clean up after yourself!
     subscription1.unsubscribe();
     subscription2.unsubscribe();

     // clear a single subscription entirely
     pubsub.clear('/shizzle/pop');

     // blow away the whole system & start fresh
     pubsub.clean();

}]);

```

## Additional

There are two methods to defer publication of data.  The first is `.publishAsync()`, which
allows for an arbitrary timeout with a default of `0`.

```javascript
    pubsub.publishAsync('foo', { msg: 'Aloha, World!'}, 100);
```

And then there is a promise style method for delaying publication.  This is provided for
convenience, one could easily use `$q.when().then()` directly with pubsub in the chain.

```javascript
    pubsub
        .when(function() {
            return true;
        })
        .thenPublish('foo', {msg: 'Konnichiwa, World!'})

```

## Advanced Configuration

Pubsub is a provider and currently allows you to configure the default publish
fallback function.  This is especially useful for debugging.

```javascript

angular.module('pubsubapp', [
    'pubsub'
])
.config([
    'pubsubProvider',
    function(pubsubProvider) {
        pubsubProvider.setPublishFallback(function(sub, data) {
            console.info('SHIZZLES!', sub, data);
        });
    }
])
.controller('pubsub-controller', [
    'pubsub',
    function(pubsub) {
        var count = 0;

        // no 'subscribe' to the following event anywhere will cause the fallback
        // function to be called

        setInterval(function() {
            pubsub.publish('some:random/thing');
        }, 1000);
    }
]);

```
## Utilities

There are three utility methods provided. `pubsub.utils.get(subscription)`
can be used to get access to a single subscriptions list of callbacks, or the entire subscription map (if no subscription name provided).  `pubsub.utils.clear(subscription)` will clear out all callbacks for a subscription.  `pubsub.utils.clean()` will reset the entire subscription map.

You may also view the demo.html page.
