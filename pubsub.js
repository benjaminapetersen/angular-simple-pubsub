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
]);