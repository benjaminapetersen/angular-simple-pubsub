# angular-simple-pubsub
A super simple pub/sub module for angular. This is a fresh and experimental module
for doing pub/sub without using `$scope` or `$rootScope`.  There is something about
using scopes for pub/sub that feels like a smell to me, especially in the context
of services, directives, etc.


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
     pubsub.utils.getAll() // -> {'foo:bar': Array[1], '/baz/bam': Array[1]}

     // be sure to clean up after yourself!
     subscription1.unsubscribe();
     subscription2.unsubscribe();

     // clear a single subscription entirely
     pubsub.clear('/shizzle/pop');

     // blow away the whole system & start fresh
     pubsub.clean();

}]);

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