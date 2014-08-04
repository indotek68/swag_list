// user.js

var bcrypt = require("bcrypt");
var salt = bcrypt.genSaltSync(10);

function User(sequelize, DataTypes){
	var User = sequelize.define('user', {
		username: {
      type: DataTypes.STRING,
      allowNull: false,
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
    }
    email: {
      type: DataTypes.STRING,
      allowNull: false,
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
        return bcrypt.comparSync(userpass, dbpass);
      },
      createNewUser: function(email, username, password, err, success){
        if(passwor.length<6){
          err({message: "Password should be more than six characters"});
        }
        else{
          User.create({
            email: email,
            password: this.encryptPass(password)
          }).error(function(error){
            console.log(error);
            if(error.username){
              err({message: "Your username should be at least 6 characters long", username: username});
            }
            else{
              err({message: 'An account with that username already exists', username: username});
            }
          }).success(function(user){
            success({message: 'Account created, please log in now'});
          });
        }
      }
    }//close classMethods
  });
//passport
}







