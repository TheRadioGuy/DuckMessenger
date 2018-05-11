const p = require('./popular.js');
var connection, es;
var setConnection = function(c) {
  connection = c;
  p.setConnection(connection);

};
var setEscape = function(e) {
  es = e;
};
module.exports.setConnection = setConnection;
module.exports.setEscape = setEscape;

const Op = global.conn.getConnection('dialogs').Sequelize.Op;



const ERROR_PARAMS_EMPTY_CODE = 1,
  ERROR_USERS_EXITS = 2,
  ERROR_CODE_ISNT_VALIDE = 4,
  ERROR_VALIDATION_NOT_NEEDED = 5,
  ERROR_FAILDED_AUTH = 7,
  ERROR_AUTHCODE_ISNT_VALID = 8;


const SUCCESSFUL_REGISTER = 3,
  SUCCESSFUL_VALIDATION = 6,
  SUCCESSFUL_AUTH_BUT_NEED_VALIDATION = 9,
  SUCCESSFUL_AUTH = 10,
  SUCCESSFUL_GENERATE_TOKEN = 11,
  SUCCESSFUL_SENDING_MESSAGE = 12,
  NEW_MESSAGE = 13,
  SUCCESSFUL_GET_DIALOGS = 14,
  SUCCESSFUL_GET_MESSAGES = 15;




const low = require('lowdb')
var async = require('async');
var LZString = require('lz-string');
const FileAsync = require('lowdb/adapters/FileAsync')

const adapter = new FileAsync('./core/databases/messages.json');
var shortid = require('shortid');
low(adapter)
  .then(dbs => {






    dbs.defaults({
        dialogs: []
      })
      .write()




    var dialogsDB = dbs.get('dialogs');








    var editMessage = function(login, id, newMessage) {

      return new Promise(function(resolve, reject) {


        if (isEmpty(login) || isEmpty(id) || isEmpty(newMessage)) {

          resolve(u(ERROR_PARAMS_EMPTY_CODE, 'Some params is empty', true));



        }

        id = parseInt(id);


        connection.query("SELECT fromU, date, toU FROM messages WHERE id = '" + id + "'", function(err, resp) {




          if (!isEmpty(err)) {
            resolve(u(700, 'Message not found', true));
            return false;

          }


          var message = resp[0];

          message['from'] = message['fromU'];
          message['to'] = message['toU'];


          if (message['from'] != login || (Math.floor(Date.now() / 1000) - message['date']) > 172800) { // 172800seconds = 48 hours

            resolve(u(701, 'You cannot edit this message', true));
            return false;

          }

          connection.query("UPDATE messages SET message='" + newMessage + "', is_edited=1 WHERE id = '" + id + "'");

          resolve(u(702, message['to'], false));



        });



      });





    };

    var deleteMessage = function(login, id) {



      return new Promise(function(resolve, reject) {


        if (isEmpty(login) || isEmpty(id)) {

          resolve(u(ERROR_PARAMS_EMPTY_CODE, 'Some params is empty', true));



        }

        id = parseInt(id);


        connection.query("SELECT fromU, date, toU FROM messages WHERE id = '" + id + "'", function(err, resp) {






          if (!isEmpty(err)) {
            resolve(u(700, 'Message not found', true));
            return false;

          }


          var message = resp[0];

          message['from'] = message['fromU'];
          message['to'] = message['toU'];


          if (message['from'] != login || (Math.floor(Date.now() / 1000) - message['date']) > 172800) { // 172800seconds = 48 hours

            resolve(u(701, 'You cannot delete this message', true));
            return false;

          }

          connection.query("DELETE FROM messages WHERE id = '" + id + "'");

          resolve(u(702, message['to'], false));



        });



      });




    };


    var getMessages = async function(login, loginMy) {




      if (isEmpty(login) || isEmpty(loginMy)) {

        return (u(ERROR_PARAMS_EMPTY_CODE, 'Some params is empty', true));
        return false;


      }





      const resp = await connection.query(`SELECT * FROM messages WHERE fromU = '${login}' AND toU = '${loginMy}' UNION SELECT * FROM messages WHERE fromU = '${loginMy}' AND toU = '${login}' ORDER BY date DESC`);


      return (u(SUCCESSFUL_GET_MESSAGES, resp.map(value => Object.assign({
        from: value.fromU,
        to: value.toU,
      }, value, {
        fromU: undefined,
        toU: undefined
      })), false));


    };
  var getDialogs = function(login) {
    // SUCCESSFUL_GET_DIALOGS
    return new Promise((resolve, reject) => {
      let db = global.conn.getConnection('dialogs');
      db.models.dialogs.findAll({
        where: {
          dialogAuthor: login
        },
        order: [
          ['time', 'DESC']
        ],
        raw: true
      }).then((dialogsRaw) => {

        var dialogs = [];
        if(dialogsRaw.length==0){
           resolve(u(SUCCESSFUL_GET_DIALOGS, dialogs, false));
           return false;
        }

        dialogsRaw.forEach((value, i) => {
          let valuesT = {
            with: value['dialogAuthor'],
            dialogId: value['dialogId'],
            message: value['message'],
            time: value['time']
          }

          if(value.is_group==1){

            valuesT.is_group = value['is_group'];
            valuesT.peoples = value['peoples'];
            valuesT.groupName = value['groupName'];

            dialogs.push(valuesT);
            if(dialogsRaw.length == i+1){
              console.log(dialogs);
              resolve(u(SUCCESSFUL_GET_DIALOGS, dialogs, false));
            }

            console.log('Group');
          }

          else if (value['dialogAuthor'] == login) valuesT.with = value['dialogWith'];

          p.fastInfo(valuesT.with).then((r)=>{
            dialogs.push(Object.assign(valuesT, r));
            if(dialogsRaw.length == i+1){
              console.log(dialogs);
              resolve(u(SUCCESSFUL_GET_DIALOGS, dialogs, false));
            }
          });

        });


      });



    });



    /*   if(value['dialogAuthor'] == login) preVal.with = value['dialogWith'];

       resolve(u(SUCCESSFUL_GET_DIALOGS, dialogs, false));*/

  };

    var sendMessage = async function(msg, to, login) {

      let db = global.conn.getConnection('dialogs');


      if (isEmpty(msg) || isEmpty(to) || isEmpty(login)) {
        console.log('Empty!');
        return (u(ERROR_PARAMS_EMPTY_CODE, 'Some params is empty', true));
        return false;


      }



      var r = await connection.query("INSERT INTO messages VALUES(NULL, 0, '" + msg + "', '" + login + "', '" + to + "', '" + Math.floor(Date.now() / 1000) + "', 0)");


      var messageid = r.insertId;
      var message = {
        id: messageid,
        is_read: 0,
        message: msg,
        to: to,
        from: login,
        date: Math.floor(Date.now() / 1000),
        is_edited: 0
      };



      let hasDialogRaw_One = await db.models.dialogs.findAll({
        where: {
          dialogWith: login,
          dialogAuthor: to
        },
        attributes:['dialogId'],
        raw:true
      });

      let hasDialogRaw_Two = await db.models.dialogs.findAll({
        where: {
          dialogWith: to,
          dialogAuthor: login
        },
        attributes:['dialogId'],
        raw:true
      });

    if(hasDialogRaw_One.length == 0 && hasDialogRaw_Two.length == 0){
      // We haven't dialogs
      db.models.dialogs.create({
        dialogWith:to,
        dialogAuthor:login,
        message:msg,
        time:Math.floor(Date.now()/1000)

      });

      db.models.dialogs.create({
        dialogWith:login,
        dialogAuthor:to,
        message:msg,
        time:Math.floor(Date.now()/1000)

      });
      console.log('No dialogs');
    }

    else {

    db.models.dialogs.update({
      time: Math.floor(Date.now()/1000),
      message:msg
    }, {
      where: {
        dialogWith:login,
        dialogAuthor:to
      }
    });

    db.models.dialogs.update({
      time: Math.floor(Date.now()/1000),
      message:msg
    }, {
      where: {
        dialogWith:to,
        dialogAuthor:login
      }
    });

    console.log('Update dialogs');

  }





      let reMessage = Object.assign(message, await p.fastInfo(login));
      let reMessageTo = Object.assign(message, await p.fastInfo(to));

      return (u(SUCCESSFUL_SENDING_MESSAGE, [reMessage, reMessageTo], false));




      /*dialogsDB.remove(infoForDelete[login]).write();
       dialogsDB.remove(infoForDelete[to]).write();
       dialogsDB.push(dialogsTwo).write();
      dialogsDB.push(dialogsOne).write();*/









    };
    module.exports.sendMessage = sendMessage;
    module.exports.getDialogs = getDialogs;
    module.exports.getMessages = getMessages;
    module.exports.editMessage = editMessage;
    module.exports.deleteMessage = deleteMessage;

    function forEach(data, callback) {
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          callback(key, data[key]);
        }
      }
    }


    function u(code, data, isError) {
      var varData = {};
      if (isError == true) {
        varData['error_code'] = code;
        varData['error'] = 1;
      } else {
        varData['code'] = code;
        varData['error'] = 0;
      }



      varData['msg'] = data;
      return LZString.compressToUTF16(JSON.stringify(varData));
    }



    function isEmpty(obj) {

      // null and undefined are "empty"
      if (obj == null) return true;

      // Assume if it has a length property with a non-zero value
      // that that property is correct.
      if (obj.length > 0) return false;
      if (obj.length === 0) return true;

      // If it isn't an object at this point
      // it is empty, but it can't be anything *but* empty
      // Is it empty?  Depends on your application.
      if (typeof obj !== "object") return true;

      // Otherwise, does it have any properties of its own?
      // Note that this doesn't handle
      // toString and valueOf enumeration bugs in IE < 9
      for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
      }

      return true;
    }






  });
