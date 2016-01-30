var _ = require('lodash');
var validator = require('../public/js/validator')
var express = require('express');
var debug = require('debug')('hi');

var mongo = require('mongodb').MongoClient;
var mongourl = 'mongodb://localhost:27017/myblog';
var db, userslist, postlist, userManager;

mongo.connect(mongourl).catch(function(error) {
    debug("Connect to mongodb " + mongourl + "was failed with error: " + error);
  }).then(function(db_) {
   db = db_;
   userslist = db.collection('userslist');
   postlist = db.collection('postlist');
   userManager = require("../public/js/userManager")(db);
     var admin = {
    username: 'administer',
    email: 'test@gg.com',
    password: 'administer'
  }
    

console.log(userManager);
  });


// GET
var api = express.Router();

api.get('/posts', function (req, res) {
  var now = new Date()
  console.log(typeof now, now, now.toString())
  var posts = [];
  postlist.find().toArray()
  .then(function(doc) {
        doc.forEach(function (post, i) {
      posts.push({
        id: i,
        title: post.title,
        author: post.author,
        text: post.text.substr(0, 50) + '...',
        time: post.time,
        visible: post.visible
        });
      });
  })
  .then(function() {
    var islogin = req.session.user? _(req.session.user).omit('_id', 'password').value() : false;
    res.json({
      posts: posts,
      logined: islogin
  });
});


});

api.get('/post/:id', function (req, res) {
  var id = req.params.id;
  postlist.find().toArray()
    .then(function(post_data) {
      debug(post_data[id]);

      if (id >= 0 && id < post_data.length) {
        var post = _.cloneDeep( post_data[id]);

        post.id = id;
        post.comments.forEach(function(comment, i) {
          comment.id = i;
        });
        
        res.json({
          post: post
        });
      } else {
        res.json(false);
      }

    });


});
// // POST

api.post('/post', function (req, res) {
  var post = _.cloneDeep(req.body);
  console.log(post)
  post.comments = [];

  postlist.insert(post);  //database addpost

  debug(post);
  res.json(post);
});

// // PUT

 api.put('/post/:id', function (req, res) {
   var id = req.params.id;
   postlist.find().toArray().
    then(function(post_data) {
      var _id = post_data[id]._id;
      console.log(_id);
      console.log(req.body)
      var update = _(req.body).omit('id', '_id').value();
      console.log(update)
      postlist.findOneAndReplace({_id: _id}, update).then(function(doc) {
        res.json(true);
      }).catch(function(err) {
        res.json(false);
      });
    });
 });

// // DELETE

api.delete('/post/:id', function (req, res) {
  var id = req.params.id;

   postlist.find().toArray().
    then(function(post_data) {
      var _id = post_data[id]._id;
      console.log(_id);
      postlist.findOneAndDelete({_id: _id}).then(function(doc) {
        res.json(true);
      }).catch(function(err) {
        res.json(false);
      });
    });

});

api.post('/signin', function (req, res) {
  
    var username = req.body.username;
    var password = req.body.password;
     userManager.findUser(username, password).then(function(user) {
           req.session.user = user;
           res.send(true);

    }).catch(function() {
      res.send(false);
    });

});

api.post('/addComment/:id', function (req, res) {
  var id = req.params.id;

  postlist.find().toArray().
    then(function(post_data) {
      var _id = post_data[id]._id;
      console.log(_id);
      console.log(req.body)
      var update = {$push: {comments: req.body}};
      postlist.findOneAndUpdate({_id: _id}, update).then(function(doc) {
        res.json(true);
      }).catch(function(err) {
        res.json(false);
      });
    });


});

api.delete('/post/:post_id/:comment_id', function(req, res) {
  var post_id = req.params.post_id;
  var comment_id = req.params.comment_id;

   postlist.find().toArray().
    then(function(post_data) {
      var _id = post_data[post_id]._id;
      console.log(_id);
      var comment = post_data[post_id].comments[comment_id];
      console.log(comment)
      var update = {$pull: {comments: comment}}
      postlist.findOneAndUpdate({_id: _id}, update).then(function(doc) {
        res.json(true);
      }).catch(function(err) {
        res.json(false);
      });
    });



});

/*to do  after using database , migrate to user.js*/

api.post('/regist', function(req, res) {
  var user_info = req.body;



   userManager.checkUser(user_info)
       .then(userManager.createUser)
       .then(function (data) {
              var user = data.ops[0];
              req.session.user = user;
              res.json(true);
       })
       .catch (function (err) {
           console.warn("regist error: ", err);
           res.json(false);
       });

});

api.post('/signout', function(req, res) {
  delete req.session.user;
  console.log(req.session.user);

  res.json(true);
})

//api validate-unique
api.post('/validate-unique', function(req, res) {
    userslist.find({}).toArray(function(err, users_) {
        var userlists = {};
        //turn array into dic with key of username
        for (var key in users_) {
            userlists[users_[key].username] = users_[key];
        }
        validateUnique(userlists,req,res);
    });
 
});

  function validateUnique(users, req, res){
      user = {};
      user[req.body.field] = req.body.value;
      result = validator.isAttrValueUnique(users, user, req.body.field) ? 
        {isUnique: true} : {isUnique: false}
      res.json(result);

  }

api.post('/toggleComment/:post_id/:comment_id', function(req, res) {
  var post_id = req.params.post_id;
  var comment_id = req.params.comment_id;

   postlist.find().toArray().
    then(function(post_data) {
      var _id = post_data[post_id]._id;
      console.log(_id);
      var comment = post_data[post_id].comments[comment_id];
      var new_comment = _.cloneDeep(comment);
      new_comment.visible = ! comment.visible;
      console.log(comment, new_comment)
      var upgrate = {$set: {"comments.$": new_comment}}
      postlist.update({_id: _id, comments: comment }, upgrate).then(function(doc) {
        res.json(true);
      }).catch(function(err) {
        res.json(false);
      });
    });
});

api.post('/togglePost/:id', function(req, res) {
  var id = req.params.id;
  debug(id);
  postlist.find().toArray().
    then(function(post_data) {
      console.log(post_data)
      var _id = post_data[id]._id;
      console.log(_id)
      var visible = ! post_data[id].visible;
      postlist.update({_id: _id}, {$set: {visible: visible}}).then(function(doc) {
        res.json(true);
      }).catch(function(err) {
        res.json(false);
      });
    })
});

module.exports = api;