(function() {
    'use strict';

    angular.module('pubsub', [

    ])
    .provider('pubsub', [
        function() {
            var subscriptions = {};

            var publishFallback = function(subscription, data) {
                console.warn('no subscriptions for', subscription, data);
            };

            this.setPublishFallback = function(fn) {
                publishFallback = fn;
            };

            this.$get = [
                '$log',
                '$q',
                '$timeout',
                function($log, $q, $timeout) {
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
                                    //delete subscriptions[subscription][index];
                                    subscriptions[subscription].splice(index, 1);
                                }
                            };
                        },
                        // support for both:
                        // handle.unsubscribe();
                        // pubsub.unsubscribe(handle);
                        unsubscribe: function(handle) {
                            handle && handle.unsubscribe && handle.unsubscribe();
                        },
                        publish: function(subscription, data) {
                            if(!subscriptions[subscription] || !subscriptions[subscription].length) {
                                return publishFallback(subscription, data);
                            }
                            subscriptions[subscription].forEach(function(subscriber) {
                                subscriber(data);
                            });
                        },
                        // async version of publish provides an arbitrary timeout mechanism
                        publishAsync: function(subscription, data, delay) {
                            delay = delay || 0;
                            $timeout(function() {
                                this.publish(subscription, data);
                            }.bind(this), delay);
                        },
                        // .when(fn).thenPublish(subscription, data) provides a
                        // promise deferred mechanism
                        when: function(val) {
                            var publish = this.publish.bind(this);
                            return {
                                thenPublish: function(subscription, data) {
                                    return $q
                                            .when(val)
                                            .then(function(msg) {
                                                publish(subscription, data);
                                            }.bind(this));
                                }
                            };
                        },
                        utils: {
                            // debug.
                            // get a single subscription, or the full subscriptions object.
                            get: function(subscription) {
                                return subscription ? subscriptions[subscription] : subscriptions;
                            },
                            // clear a single subscription
                            clear: function(subscription) {
                                if(subscription && subscriptions[subscription]) {
                                    subscriptions[subscription].splice(index, 1);
                                }
                            },
                            // clean out the whole pub/sub mechanism
                            clean: function() {
                                subscriptions = {};
                            }
                        }
                    };
                }
            ];
        }
    ]);

})();
