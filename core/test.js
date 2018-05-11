const config = require('./config.js');

require('./database.js').setupConnection(config.settings.db.dbName, config.settings.db.dbUser, config.settings.db.dbPassword, config.settings.db.options).startConnection().then(async function(db) {

  const Op = db.Sequelize.Op;


  // let hasUser = await db.models.users.findAll({
  //   where: {
  //     [Op.or]: [{
  //       login: 'DuckerManZ'
  //     }, {
  //       email: 'serg@duck.ru'
  //     }]
  //   }
  // });
  //
  // console.log(hasUser[0].dataValues);
   db.models.users.findAll({where:{login:'DuckerMfgganZ'}, attributes:['userid']}).then((r)=>console.log(!r))
});
