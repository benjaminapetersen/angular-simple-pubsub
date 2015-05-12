'use strict';

angular.module('pubsub', [

])


.provider('pubsub', [
    function() {
        var subscriptions = {};

        var publishFallback = function(subscription, data) {
            console.warn('no subscriptions for', subscription, data);
        }

        this.setPublishFallback = function(fn) {
            publishFallback = fn;
        }

        this.$get = [
            '$log',
            function($log) {
                return {
                    subscribe: function(subscription, subscriber) {
                        if(!subscriptions[subscription]) {
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

                        if(!subscriptions[subscription]) {
                            return publishFallback(subscription, data);
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
            }
        ]
    }
])


// .factory('pubsub', function() {
//     var subscriptions = {};

//     return {
//         subscribe: function(subscription, subscriber) {
//             if(!subscriptions[subscription]) {
//                 subscriptions[subscription] = [];
//             }

//             // adds the callback to the array & returns the index for deletion later
//             var index = (subscriptions[subscription].push(subscriber) -1);

//             // return an unsubscribe function
//             return {
//                 unsubscribe: function() {
//                     delete subscriptions[subscription][index];
//                 }
//             }

//         },
//         publish: function(subscription, data) {

//             // TODO: convert to a provider & provide configuration
//             // to set a severity to failure to publish.
//             // Default should probably be at least a warning. Perhaps
//             // set a level or provide a callback function...?
//             if(!subscriptions[subscription]) {
//                 return;
//             }
//             subscriptions[subscription].forEach(function(subscriber) {
//                 subscriber(data || {});
//             });

//         },
//         utils: {
//             // get a list of all subscriptions
//             getAll: function() {
//                 return subscriptions;
//             },
//             // clear a single subscription
//             clear: function(subscription) {
//                 if(subscription && subscriptions[subscription]) {
//                     delete subscriptions[subscription];
//                 }
//             },
//             // clean out the whole pub/sub mechanism
//             clean: function() {
//                 subscriptions = {};
//             }
//         }
//     };

// });

