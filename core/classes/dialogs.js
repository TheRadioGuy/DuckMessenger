





const ERROR_PARAMS_EMPTY_CODE = 1, ERROR_USERS_EXITS = 2, ERROR_CODE_ISNT_VALIDE = 4, ERROR_VALIDATION_NOT_NEEDED = 5, ERROR_FAILDED_AUTH=7, ERROR_AUTHCODE_ISNT_VALID = 8;


const SUCCESSFUL_REGISTER = 3, SUCCESSFUL_VALIDATION = 6, SUCCESSFUL_AUTH_BUT_NEED_VALIDATION = 9, SUCCESSFUL_AUTH = 10, SUCCESSFUL_GENERATE_TOKEN = 11, SUCCESSFUL_SENDING_MESSAGE=12, NEW_MESSAGE=13, SUCCESSFUL_GET_DIALOGS = 14;




const low = require('lowdb')
var async = require('async');
var LZString = require('lz-string');
const FileAsync = require('lowdb/adapters/FileAsync')

const adapter = new FileAsync('./core/databases/messages.json');
var shortid = require('shortid');
low(adapter)
  .then(db => {






   db.defaults({dialogs: [], messages:[] })
  .write()




var dialogsDB = db.get('dialogs');
var messagesDB = db.get('messages');


var getDialogs = function(login){
// SUCCESSFUL_GET_DIALOGS

return new Promise(function(resolve,reject){

if(isEmpty(login)){

    resolve(u(ERROR_PARAMS_EMPTY_CODE, 'Some params is empty', true));
        return false;


}



dialogs = [];

var dialogsNotSort = dialogsDB.value();

async.forEachOf(dialogsNotSort, function (value, key, callback) {
  



if(value['dialogWith'] == login){

    
dialogs.push({with:value['dialogAuthor'], dialogId:value['dialogId'], message:value['message']});


}

else if(value['dialogAuthor']==login){
dialogs.push({with:value['dialogWith'], dialogId:value['dialogId'], message:value['message']});

}




  callback();
}, function (err) {
    if (err) console.error(err.message);
    // configs is now a map of JSON data
    console.log(dialogsNotSort);
   


 resolve(u(SUCCESSFUL_GET_DIALOGS, dialogs, false));
 return false;
});












});
};

var sendMessage = function(msg, to, login){




return new Promise(function(resolve,reject){


    if(isEmpty(msg) || isEmpty(to) || isEmpty(login)){
        console.log('Empty!');
        resolve(u(ERROR_PARAMS_EMPTY_CODE, 'Some params is empty', true));
        return false;


    }

    var messageid = shortid.generate()+shortid.generate()+shortid.generate();
    var message = {id: messageid, is_read:0, message:msg, to:to, from:login, date:Math.floor(Date.now()/1000)};



    var hasDialogs = dialogsDB.find({dialogWith:login, dialogAuthor:to}).value();



    if(hasDialogs==undefined){


        var hasDialogs = dialogsDB.find({dialogWith:to, dialogAuthor:login}).value();


        if(hasDialogs==undefined){
            // Create new

            dialogsDB.push({dialogWith:login, dialogAuthor:to, dialogId:shortid.generate()+shortid.generate()+shortid.generate(), message:msg}).write();
        }
        else{

            // update

            dialogsDB.find({dialogWith:to, dialogAuthor:login}).assign({message:msg}).write();
        }

    }


    else{

        // update  message

         dialogsDB.find({dialogWith:login, dialogAuthor:to}).assign({message:msg}).write();


    }
  
    

    
    messagesDB.push(message).write();

      

    resolve(u(SUCCESSFUL_SENDING_MESSAGE, message, false));

    /*dialogsDB.remove(infoForDelete[login]).write();
     dialogsDB.remove(infoForDelete[to]).write();
     dialogsDB.push(dialogsTwo).write();
    dialogsDB.push(dialogsOne).write();*/
    
    





   
    

});

};
module.exports.sendMessage=sendMessage;
module.exports.getDialogs=getDialogs;
function forEach(data, callback){
  for(var key in data){
    if(data.hasOwnProperty(key)){
      callback(key, data[key]);
    }
  }
}


function u(code, data, isError){
 var varData = {};
    if(isError==true){
        varData['error_code'] = code;
        varData['error'] = 1;
    }
    else{
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
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

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

