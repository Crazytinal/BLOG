var validator = {
  form: {
    username: {
      status: false,
      errorMessage: '6~18位英文字母、数字或下划线，必须以英文字母开头'
    }, 
    email: {
      status: false,
      errorMessage: '请输入合法邮箱'
    },
    password: {
      status: false,
      errorMessage: '请输入合法密码'
    },
    passwordConfirm: {
      status: false,
      errorMessage: '输入的密码不一致'
    }
  }, 
    //reg with no space
    //forget ',' inside object, add more ';' after object
    //inside'[]' would use variable, after '.' will use string
  isUsernameValid: function (username){
    return this.form.username.status = /^[a-zA-Z][a-zA-Z0-9_]{5,17}$/.test(username);
  },
  isPasswordValid: function (password) {
    this.form.password.passwordConfirm = password;
    return this.form.password.status = /^[a-zA-Z0-9_\-]{6,12}$/.test(password);
  },
  isPasswordConfirmValid: function(password_confirm) {
    return this.form.passwordConfirm.status = password_confirm == this.form.password.passwordConfirm;
  },

  isEmailValid: function (email){
    return this.form.email.status = /^[a-zA-Z_\-]+@([a-zA-Z_\-]+\.)+[a-zA-Z]{2,4}$/.test(email);
  },

  isFieldValid: function(fieldname, value){
    var CapFiledname = fieldname[0].toUpperCase() + fieldname.slice(1, fieldname.length);
    return this["is" + CapFiledname + 'Valid'](value);
  },

  isFormValid: function(){
    return this.form.username.status && this.form.email.status && this.form.password.status ;
  },



  isAttrValueUnique: function(registry, user, attr){
    for (var key in registry) {
      if (registry.hasOwnProperty(key) && registry[key][attr] == user[attr]) return false;
    }
    return true;
  },
//{ username: 'durant', email: 'durant@nba.com', password: 'kd35' }

  findFormatErrors: function(user) {
    var errorMessages = [];
    for(var key in user) 
        if (!this.isFieldValid(key, user[key])) {
            errorMessages.push(this.form[key].errorMessage);
        }
          console.log(user);

    //formatError should set null if it is []
    return errorMessages.length ? errorMessages : null;
  }


}

if (typeof module == 'object') { // 服务端共享
  module.exports = validator
}


