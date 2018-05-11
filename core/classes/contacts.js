



var connection, es;
var setConnection = function(c){
connection=c;
};
var setEscape = function(e){
es = e;
};
module.exports.setConnection=setConnection;
module.exports.setEscape=setEscape;


var LZString = require('lz-string');


const low = require('lowdb')

const ERROR_PARAMS_EMPTY_CODE = 0;



const FileSync = require('lowdb/adapters/FileSync');

const adapt = new FileSync('./core/databases/users.json');
const users = low(adapt).get('users');



const FileAsync = require('lowdb/adapters/FileAsync')

const adapter = new FileAsync('./core/databases/contacts.json');
var shortid = require('shortid');
low(adapter)
  .then(db => {








   db.defaults({contacts: [] })
  .write()



var contacts = db.get('contacts');



var addToContacts = async function(login, userMail, howWrite){



if(isEmpty(login) || isEmpty(userMail) || isEmpty(howWrite)){
    return u(ERROR_PARAMS_EMPTY_CODE, 'Some params is empty', true);
}

var hasContact = await connection.query(`SELECT mail FROM contacts WHERE mail = '${userMail}' AND addedBy = '${login}'`);

if(hasContact.length!=0) return u(400, 'Contacts is already in your contact list', true);


var userInfo = await connection.query(`SELECT login, image, email FROM users WHERE email = '${userMail}' `);
userInfo = userInfo[0];

if(typeof userInfo == 'undefined') return u(401, 'User mail isnt exists', true);



if(userInfo['login']==login) return u(403, 'WTF?!', true);

connection.query(`INSERT INTO contacts VALUES('${userMail}', '${login}', '`+userInfo['login']+`', '${howWrite}', `+Math.floor(Date.now()/1000)+`)`);


return u(402, {hw:howWrite, image:userInfo['image'], date:Math.floor(Date.now()/1000), login:userInfo['login'], mail:userInfo['email']}, false);
};


var getMyContacts = async function(login){
    if(isEmpty(login)){
    return u(ERROR_PARAMS_EMPTY_CODE, 'Some params is empty', true);
}


var value = await connection.query(`SELECT mail, loginUser, name, surname, image FROM contacts INNER JOIN users ON loginUser = login WHERE addedBy = '${login}'`);




return u(404, value, false);

}

module.exports.addToContacts=addToContacts;
module.exports.getMyContacts=getMyContacts;

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


    
  });



