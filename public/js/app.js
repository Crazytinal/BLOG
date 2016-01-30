'use strict';

// Declare app level module which depends on filters, and services
var myApp = angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'ngRoute', 'ng-pagination']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/index',
        controller: IndexCtrl
      }).
      when('/addPost', {
        templateUrl: 'partials/addPost',
        controller: AddPostCtrl
      }).
      when('/readPost/:id', {
        templateUrl: 'partials/readPost',
        controller: ReadPostCtrl
      }).
      when('/editPost/:id', {
        templateUrl: 'partials/editPost',
        controller: EditPostCtrl
      }).
      when('/deletePost/:id', {
        templateUrl: 'partials/deletePost',
        controller: DeletePostCtrl
      }).
      when('/signin', {
        templateUrl: 'partials/signin',
        controller: SigninCtrl
      }).
      when('/addComment/:id/:toUser', {
        templateUrl: 'partials/addComment',
        controller: addCommentCtrl
      }).
      when('/deleteComment/:post_id/:comment_id', {
        templateUrl: 'partials/deleteComment',
        controller: deleteCommentCtrl
      }).
      when('/regist', {
        templateUrl: 'partials/regist',
        controller: registCtrl
      }).
      when('/toggleComment/:post_id/:comment_id', {
        templateUrl: 'partials/toggleComment',
        controller: toggleCommentCtrl
      }).
      when('/togglePost/:id', {
        templateUrl: 'partials/togglePost',
        controller: togglePostCtrl
      })
      .
      otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);
  }]);