const withoutCompress = false;
const filesDirectory = "./usersFiles";
const settings = {
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'duckmessenger',
  connectionLimit: 10,


  db:{
    dbName:'duckmessenger',
    dbUser:'root',
    dbPassword:'root',
    options:{
        host: 'localhost',
        dialect: 'mysql',
        define: {
        timestamps: false
    },
        operatorsAliases: false,

        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        },

        // SQLite only
        storage: 'path/to/database.sqlite'

      }
  }
};
module.exports.withoutCompress=withoutCompress;
module.exports.settings=settings;
