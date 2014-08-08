function Event(sequelize, DataTypes){
	var Event = sequelize.define('event', {
    eventId: DataTypes.STRING,
    show_date: DataTypes.STRING,
    show_data: DataTypes.STRING
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