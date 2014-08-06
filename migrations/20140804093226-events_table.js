module.exports = {
  up: function(migration, DataTypes, done) {
    // add altering commands here, calling 'done' when finished
    migration.createTable('events', 
    	{ id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
        },
        createdAt: DataTypes.DATE, 
        updatedAt: DataTypes.DATE,
        eventId: DataTypes.STRING,
      })
    .complete(done)
  },
  down: function(migration, DataTypes, done) {
    // add reverting commands here, calling 'done' when finished
    migration.dropTable('events')
      .complete(done)
  }
}
