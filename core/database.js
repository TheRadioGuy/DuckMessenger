const Sequelize = require('sequelize');



function setupConnection(db, login, password, config){
global.sequelize = new Sequelize(db, login, password, config);

return {startConnection:startConnection};
}




function startConnection(){
  return new Promise(function(resolve, reject) {
    sequelize
      .authenticate()
      .then(() => {



        let User = require('./models/User.js');

        let db = {sequelize:sequelize, models:{}, Sequelize:Sequelize};
        const path = require('path');
        const dir =path.join(__dirname, "models");
        const fs = require('fs');

   fs.readdirSync(dir).forEach(file => {
     const modelDir = path.join(dir, file);
     const model = sequelize.import(modelDir);
     db.models[model.name] = model;

    db.models[model.name].sync({force: false}).then(('Init models'));
   });



   resolve(db);


      })
      .catch(err => {
        reject(err);
      });
  });

}




module.exports.setupConnection=setupConnection;
