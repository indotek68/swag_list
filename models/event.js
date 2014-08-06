function Event(sequelize, DataTypes){
	var Event = sequelize.define('event', {
    eventId: DataTypes.STRING 
	},
  {
    classMethods: {
      associate: function(db){
        Event.hasMany(db.user)
      }
    }
  })
  return Event;
};

module.exports = Event;