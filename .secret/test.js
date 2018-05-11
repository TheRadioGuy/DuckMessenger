

require('./untitled.js').setupConnection('loto', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    operatorsAliases: false,

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },

    // SQLite only
    storage: 'path/to/database.sqlite'
  }).startConnection().then((db)=>{
    console.log(db.models);
  });
