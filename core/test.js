const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('./core/databases/users.json');
const db = low(adapter)
var shortid = require('shortid');
db.defaults({users: [] })
  .write()

var getDB = db.get('users');
  console.log(getDB.find({login:'DuckerMan', email:'DuckerMan@gmail.com'}).value());
  getDB.push({ userid: shortid.generate(), login: 'DuckerMan', email:'DuckerMan@gmail.com', name:'Sergey', surname:'Duck', image:'default.png', contacts:{}, rights:0, online:0, dialogs:{}})
  .write()