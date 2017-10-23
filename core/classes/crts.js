const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')

const adapter = new FileAsync('./core/databases/crt.json');
var shortid = require('shortid');


low(adapter)
  .then(db => {






   db.defaults({crt: [] })
  .write()



var getDB = db.get('crt');





var generateCrt = function(login){

crt = GeneratePublicKey256()+GeneratePublicKey256();



 getDB.push({login:login, crt:crt})


  .write();



  return crt;
};

var checkCertificate = function(login,crt){
if(getDB.find({login:login, crt:crt}).value()==undefined ) return false;
else return true;
};

module.exports.generateCrt = generateCrt;
module.exports.checkCertificate = checkCertificate;

   function GeneratePublicKey256(){
            var key = Array();

            for(var i = 0;i < 33;i++){
              if(key.length == 32){
                 return toHexString(key);
              
              }


            key.push(Math.floor(Math.random() * 256));
            }
            

             }

       function toHexString(byteArray) {
  return Array.from(byteArray, function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('')
}



  });





