angular.module('pubsub', [

])

.factory('pubsub', function() {
    var subscriptions = {},
        hasOwnProp = subscriptions.hasOwnProperty;

    return {
        subscribe: function(subscription, subscriber) {
            if(!hasOwnProp.call(subscriptions, subscription)) {
                subscriptions[subscription] = [];
            }

            // adds the callback to the array & returns the index for deletion later
            var index = (subscriptions[subscription].push(subscriber) -1);

            // return an unsubscribe function
            return {
                unsubscribe: function() {
                    delete subscriptions[subscription][index];
                }
            }

        },
        publish: function(subscription, data) {
            if(!hasOwnProp.call(subscriptions, subscription)) {
                return;
            }
            subscriptions[subscription].forEach(function(subscriber) {
                subscriber(data || {});
            });

        },
        utils: {
            // get a list of all subscriptions
            getAll: function() {
                return subscriptions;
            },
            // clear a single subscription
            clear: function(subscription) {
                if(subscription && subscriptions[subscription]) {
                    delete subscriptions[subscription];
                }
            },
            // clean out the whole pub/sub mechanism
            clean: function() {
                subscriptions = {};
            }
        }
    };

});

