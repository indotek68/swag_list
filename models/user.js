// user.js

var bcrypt = require("bcrypt");
var salt = bcrypt.genSaltSync(10);
var passport = require("passport");
var passportLocal = require("passport-local");

function User(sequelize, DataTypes){
	var User = sequelize.define('user', {
		username: {
      type: DataTypes.STRING,
      notEmpty: true,
      unique: true,
      validate: {
        len: [6,30]
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      notEmpty: true,
      unique: true,
      validate: {
        isEmail: true
      }
    }
	},//var User closure
  {
    classMethods: {
      associate: function(db){
        User.hasMany(db.event);
      },
      encryptPass: function(password) {
        var hash = bcrypt.hashSync(password, salt);
        return hash;
      },
      comparePass: function(userpass, dbpass){
        return bcrypt.compareSync(userpass, dbpass);
      },
      createNewUser: function(email, username, password, err, success){
        if(password.length < 6){
          err({message: "Password should be more than six characters"});
        }
        else{
          User.create({
            email: email,
            username: username,
            password: this.encryptPass(password)
          }).error(function(error){
            //console.log(error);
            if(error.username){
              err({message: "Your username should be at least 6 characters long", username: username});
              
            }
            else if(error.email){
              err({message: 'An account with that email already exists', email: email});
            }
            else{
              err({message: 'An account with that username already exists'})
            }
          }).success(function(user){
            success({message: 'Account created, please log in now'});
          });
        }
      }
    }//close classMethods
  });
//passport
passport.use(new passportLocal.Strategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  },

  function(req, username, password, done){
    // find a user in the DB
    User.find({
      where: {
        username: username
      }
    })
    //when that's done,
    .done(function(error, user){
      if(error){
        console.log(error);
        return done(err, req.flash('loginMessage', 'Oops! Something went wron.'));
      }
      if (user === null){
        return done (null, false, req.flash('loginMessage', 'Username does not exist.'));
      }
      if((User.comparePass(password, user.password))!== true){
        return done (null, false, req.flash('loginMessage', 'Invalid Password'))
      }
      done(null, user);
    })
  }));
  
  return User;
}

module.exports = User;







