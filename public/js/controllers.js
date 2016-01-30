'use strict';

/* Controllers */

function IndexCtrl($scope, $http, $rootScope) {


  $scope.onPageChange = function() {
  
  $http.get('/api/posts').
    success(function(data, status, headers, config) {
      for(var i = 0;i < data.posts.length; i++) {
        console.log(data.posts[i].visible == false, data.posts[i].visible)
        if (data.posts[i].visible == false) {
          delete data.posts[i].text;
          data.posts[i].text = 'this post has been unshown by administer';
          console.log(data.posts[i].text)
        }
      }
      $scope.posts = data.posts.slice(($scope.currentPage-1)*5, $scope.currentPage*5-1);
      // console.log($scope.posts)
      $rootScope.logined = data.logined;
      $rootScope.user = !! data.logined ? data.logined.username  : "guest"; 
      $scope.length = data.posts.length;
      $scope.pageCount = $scope.length/5 + 1;
     
      $scope.getPostNum = function() {
        setTimeout(function() {

        var posts =  $('.post');
        $scope.length = posts.length;
        console.log($scope.length);
        }, 50);
      }

    });

      // ajax request to load data
      console.log($scope.currentPage);
    };

}

function AddPostCtrl($scope, $http, $location, $rootScope) {
  console.log($rootScope.user)
  var now = new Date();
  $scope.form = {
    author: $rootScope.logined.username,
    title: 'default',
    text: "foo",
    time: now.toLocaleString(),
    visible: true
  };

  $scope.submitPost = function () {
    if ($scope.form.text && $scope.form.title)
    $http.post('/api/post', $scope.form).
      success(function(data) {
        $location.path('/');
      });
  };
}

function ReadPostCtrl($scope, $http, $routeParams) {
  $http.get('/api/post/' + $routeParams.id).
    success(function(data) {
        if (data.post.visible == false) {
          delete data.post.text;
          data.post.text = 'this post has been unshown by administer';
        }

        for(var i = 0; i<  data.post.comments.length;i++) {
          console.log(data.post.comments[i].time)
          if (data.post.comments[i].visible == false) {
            delete data.post.comments[i].text ;
            data.post.comments[i].text = 'this comment has been unshown by administer';
          }
        }
      $scope.post = data.post;
    });
}

function EditPostCtrl($scope, $http, $location, $routeParams) {
  $scope.form = {};
  $http.get('/api/post/' + $routeParams.id).
    success(function(data) {
      $scope.form = data.post;
    });

  $scope.editPost = function () {
    if ($scope.form.text && $scope.form.title)
    $http.put('/api/post/' + $routeParams.id, $scope.form).
      success(function(data) {
        $location.url('/readPost/' + $routeParams.id);
      });
  };
}

function DeletePostCtrl($scope, $http, $location, $routeParams) {
  $http.get('/api/post/' + $routeParams.id).
    success(function(data) {
      $scope.post = data.post;
    });

  $scope.deletePost = function () {
    $http.delete('/api/post/' + $routeParams.id).
      success(function(data) {
        $location.url('/');
      });
  };

  $scope.home = function () {
    $location.url('/');
  };
}

function SigninCtrl($scope, $http, $location, $rootScope) {
  console.log($rootScope.logined)
  $scope.form = {
    username: "",
    password: ''
  }

  $scope.errorMessage = '';
  $scope.signin = function() {
    $http.post('/api/signin', $scope.form)
      .success(function(data) {
        console.log(data)
        console.log(data == 'true')
        if (data == 'true')
          $location.url('/');
        else {

          $scope.errorMessage = 'username or password is not correct';
          $location.url('/signin');
        }
    })
  };
}

function addCommentCtrl($scope, $http, $location, $routeParams, $rootScope) {
  $scope.form = {};
  $scope.form.text = 'foo';
  $scope.submit = function() {
    var now = new Date();
  var post_data = {
      fromUser: $rootScope.user,  //session.user
      toUser: '@'+$routeParams.toUser,
      text: $scope.form.text,
      time: now.toLocaleString(),
      visible: true
    }
    if ($scope.form.text)
    $http.post('/api/addComment/' + $routeParams.id, post_data)
      .success(function(data) {
        $location.url('readPost/' + $routeParams.id);
      })
  }
}

function deleteCommentCtrl($scope, $http, $location, $routeParams) {
  console.log($routeParams);

    $scope.deleteComment = function () {
    $http.delete('/api/post/' + $routeParams.post_id + '/' + $routeParams.comment_id).
      success(function(data) {
        $location.url('/readPost/' + $routeParams.post_id);
      });
    }
    $scope.home = function () {
    $location.url('/readPost/' + $routeParams.post_id);
  };
}


//todo check user whether dulplicate
function registCtrl($scope, $http, $location, $rootScope) {
  $scope.is_username_unique = false;
  $scope.is_email_unique = false;

    $('input:not(.button)').blur(function(){
    var self = this;
    if (validator.isFieldValid(this.id, $(this).val()) ) {
      console.log(this.id)
      if (this.id != 'passwordConfirm' && this.id != 'password')
      $.post('/api/validate-unique', {field: this.id, value: $(this).val() }, function(data, status){
            var fieldUnique = 'is_' + self.id + "_unique";
        if (status == 'success'){
          if (data.isUnique){
            console.log('unique');
            $scope[fieldUnique] = true;
            $(self).next('.error').text('').hide();
          } else {
            console.log('not unique')
            $scope[fieldUnique] = false;
            $(self).next('.error').text("value is not unique").show();
            validator.form[self.id].status = false;
          }
        }
      });
    } else {
      $(this).next('.error').text(validator.form[this.id].errorMessage).show();
    }
  });



  $scope.form = {
    username: '',
    email: '',
    password: ''
  }

  $scope.regist = function() {

    $('input:not(.button)').blur();

   setTimeout(function() { 
    console.log((validator.isFormValid() && $scope.is_username_unique && $scope.is_email_unique))
    if (validator.isFormValid() && $scope.is_username_unique && $scope.is_email_unique) {
            console.log('yeah') 
            $http.post('api/regist', $scope.form).
              success(function(data) {
               console.log(data);
               $location.url('/');
              });
    }
            }, 1000);
  }


}

function signoutCtrl($scope, $http, $location, $rootScope) {
    $scope.signOut = function () {
      console.log('signout')
      $http.post('api/signout').
        success(function() {
          $rootScope.logined = false;
          $rootScope.user = !! $rootScope.logined ? $rootScope.logined.username + "'s" : "a"; 
          $location.url('/signin');
        })

    }
}

function toggleCommentCtrl($scope, $http, $location, $routeParams) {
   $scope.toggleComment = function () {
    $http.post('/api/toggleComment/' + $routeParams.post_id + '/' + $routeParams.comment_id).
      success(function(data) {
        $location.url('/readPost/' + $routeParams.post_id);
      });
    }
    $scope.home = function () {
    $location.url('/readPost/' + $routeParams.post_id);
}
}

function togglePostCtrl($scope, $http, $location, $routeParams) {
     $scope.togglePost = function () {
    $http.post('/api/togglePost/' + $routeParams.id).
      success(function(data) {
        $location.url('/');
      });
    }
    $scope.home = function () {
    $location.url('/');
  }
}

myApp.controller('signoutCtrl', signoutCtrl);