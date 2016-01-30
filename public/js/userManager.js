var bcrypt = require("bcrypt-nodejs");
var validator = require('../../public/js/validator');
var _ = require('lodash');
// console.log(_);

   module.exports =  function (db) {

    var userslist = db.collection('userslist');
    return {

        findUser: function(username, password) {
            return userslist.findOne({username: username}).then(function (user) {
                console.log(bcrypt.compareSync(password, user.password));
                if (user && bcrypt.compareSync(password, user.password))
                   return user;
                else
                    return Promise.reject('error') ;
            });

            },

        createUser: function(user) {
            
                    user.password = bcrypt.hashSync(user.password);
                return userslist.insert(user);

            },

        checkUser: function(user) {
            return new Promise(function (resolve, reject) {
                console.log(user);
                var formatErrors = validator.findFormatErrors(user);
                formatErrors ? reject(formatErrors) : resolve(user);
            })
            .then(function () {
                var userlists = {};
                return userslist.find(getEveryAttr(user)).toArray()
                    .then(function ( existedUsers) {
                        for (var key in existedUsers) {
                            userlists[existedUsers[key].username] = existedUsers[key];
                        }
                        var err = [];
                        for(var key in user) 
                            if (key != 'password' && !validator.isAttrValueUnique(userlists, user, key))
                                err.push("key: " + key + " is not unique by value: " + user[key] + '</br>');
                    return existedUsers.length ?  Promise.reject(err) : Promise.resolve(user);
                });
            });
        }
    }

    function getEveryAttr(user) {
        // console.log(_(user).omit('password', '_id').value())
        return {$or: _(user).omit('password', '_id').toPairs().map(getPair).value()};
        // return {$or: _(user).omit('password', '_id').value()};
    }

    function getPair(pair) {
        var obj = {};
        obj[pair[0]] = pair[1];
        return obj;
    }
}
