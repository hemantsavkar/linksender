// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])
    .factory('CallLogService', ['$q', function ($q) {
        return {

            list: function (days) {
                var q = $q.defer();
                // days is how many days back to go
                window.plugins.calllog.list(days, function (response) {
                    q.resolve(response.rows);
                }, function (error) {
                    q.reject(error)
                });
                return q.promise;
            },

            contact: function (phoneNumber) {
                var q = $q.defer();
                window.plugins.calllog.contact(phoneNumber, function (response) {
                    q.resolve(response);
                }, function (error) {
                    q.reject(error)
                });
                return q.promise;
            },

            show: function (phoneNumber) {
                var q = $q.defer();
                window.plugins.calllog.show(phoneNumber, function (response) {
                    q.resolve(response);
                }, function (error) {
                    q.reject(error)
                });
                return q.promise;
            }
        }
}])
    .controller('DebugCtrl', ['$scope', '$interval', '$http', 'CallLogService',
    function ($scope, $interval, $http, CallLogService) {
            document.addEventListener("deviceready", function () {
                cordova.plugins.backgroundMode.setDefaults({
                    text: 'Doing heavy tasks.'
                });
                // Enable background mode
                cordova.plugins.backgroundMode.enable();
                // Called when background mode has been activated
                cordova.plugins.backgroundMode.onactivate = function () {
                    setTimeout(function () {
                        // Modify the currently displayed notification
                        cordova.plugins.backgroundMode.configure({
                            text: 'Maha Kisaan Miss Call Watcher !!!!'
                        });
                    }, 2000);
                }
                $interval(function () {
                    $scope.data = {};
                    $scope.callTypeDisplay = function (type) {
                        switch (type) {
                        case 1:
                            return 'Incoming';
                        case 2:
                            return 'Outgoing';
                        case 3:
                            return 'Missed';
                        default:
                            return 'Unknown';
                        }
                    };

                    CallLogService.list(3).then(
                        function (callLogs) {
                            //console.log(callLog);
                            //$scope.calldata = callLog;
                                angular.forEach(callLogs, function (callLog) {
                                    if(callLog.type==3){
                                    var telephoneNumber = callLog.number.toString()
                                    telephoneNumber = telephoneNumber.replace('+', 'L');
                                    var request = $http({
                                        method: "post",
                                        url: "http://test.hemantsavkar.in/SMSSender.svc/AcceptSMSSendRequest/" + telephoneNumber + "/M"
                                    });
                                    request.then(function (response) {
                                        console.log(response.data)
                                    });
                                    }
                                    
                                    
                                });

                        },
                        function (error) {
                            console.error(error);
                            console.error(error);
                        });

                }, 60000);
            }, false);

    }])
    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleLightContent();
            }
        });
    })

.config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
        .state('tab', {
        url: "/tab",
        abstract: true,
        templateUrl: "templates/tabs.html"
    })

    // Each tab has its own nav history stack:

    .state('tab.dash', {
        url: '/dash',
        views: {
            'tab-dash': {
                templateUrl: 'templates/tab-dash.html',
                controller: 'DebugCtrl'
            }
        }
    })

    .state('tab.chats', {
            url: '/chats',
            views: {
                'tab-chats': {
                    templateUrl: 'templates/tab-chats.html',
                    controller: 'ChatsCtrl'
                }
            }
        })
        .state('tab.chat-detail', {
            url: '/chats/:chatId',
            views: {
                'tab-chats': {
                    templateUrl: 'templates/chat-detail.html',
                    controller: 'ChatDetailCtrl'
                }
            }
        })

    .state('tab.account', {
        url: '/account',
        views: {
            'tab-account': {
                templateUrl: 'templates/tab-account.html',
                controller: 'AccountCtrl'
            }
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/dash');

});