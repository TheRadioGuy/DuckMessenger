const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')

const adapter = new FileAsync('./core/databases/users.json');
var shortid = require('shortid');

var crts = require('./classes/crts.js');
var attachments = require('./classes/attachments.js');
low(adapter)
  .then(db => {






   db.defaults({users: [] })
  .write()



var getDB = db.get('users');

var mail = require('./classes/mail.js');
var LZString = require('lz-string');




// errors constant
// thanks Alexey!
const ERROR_PARAMS_EMPTY_CODE = 1, ERROR_USERS_EXITS = 2, ERROR_CODE_ISNT_VALIDE = 4, ERROR_VALIDATION_NOT_NEEDED = 5, ERROR_FAILDED_AUTH=7, ERROR_AUTHCODE_ISNT_VALID = 8;


const SUCCESSFUL_REGISTER = 3, SUCCESSFUL_VALIDATION = 6, SUCCESSFUL_AUTH_BUT_NEED_VALIDATION = 9, SUCCESSFUL_AUTH = 10;

var registerAccountPartOne = function(login, email, name, surname){



	return new Promise(function(resolve, reject){
		console.log('call');
		if(isEmpty(login) || isEmpty(email) || isEmpty(name) || isEmpty(surname)){
			resolve(u(ERROR_PARAMS_EMPTY_CODE, 'Some params is empty', true));

			
			return false;
		}

		



 if(getDB.find({login:login, email:email}).value()!=undefined){
resolve(u(ERROR_USERS_EXITS, 'User is already exists', true));

 	// user exists

return false;
 }


  getDB.push({ userid: shortid.generate()+shortid.generate(), login: login, email:email, name:name, surname:surname, image:'defaultImage', contacts:{}, rights:0, online:0, dialogs:{}, is_validate:0})

  .write();


var authCode = Math.floor(Math.random() * 9999);


if(authCode <= 1000){
authCode = authCode + (1000-authCode);
}

  resolve(u(SUCCESSFUL_REGISTER,  authCode, false));








	});

};



var authAccount = function(login){
	return new Promise(function(resolve,reject){

if(isEmpty(login)){

	resolve(u(ERROR_PARAMS_EMPTY_CODE, 'Some params is empty', true));

			
			return false;
}



	if(getDB.find({login:login}).value()==undefined  || getDB.find({login:login}).value()['is_validate'] == 0){
		resolve(u(ERROR_FAILDED_AUTH, 'Falied auth', true));
		return false;
	}

	var authCode = Math.floor(Math.random() * 9999);


if(authCode <= 1000){
authCode = authCode + (1000-authCode);
}

resolve(u(SUCCESSFUL_AUTH_BUT_NEED_VALIDATION, authCode, false));

	});


};


var authCodeEnter = function(login, code, realCode){
return new Promise(function(resolve,reject){



	if(empty(code) || empty(realCode) || empty(login)){
	resolve(u(ERROR_PARAMS_EMPTY_CODE, 'Some params is empty', true));

			
			return false;
}


if(getDB.find({login:login}).value()==undefined){

	resolve(u(ERROR_FAILDED_AUTH, 'Falied auth', true));
	return false;
}



if(code==realCode){





resolve(u(SUCCESSFUL_AUTH, crts.generateCrt(login), false))

}
else{

	var authCode = Math.floor(Math.random() * 9999);


if(authCode <= 1000){
authCode = authCode + (1000-authCode);
}



resolve(u(ERROR_AUTHCODE_ISNT_VALID, authCode, true));

}

});
};
var validateAccount = function(login, code, realCode){
return new Promise(function(resolve,reject){
console.log(empty(realCode));
console.log(empty(code));
console.log(empty(login));
if(empty(code) || empty(realCode) || empty(login)){
	resolve(u(ERROR_PARAMS_EMPTY_CODE, 'Some params is empty', true));

			
			return false;
}


if(code==realCode){

	// successful


	if(getDB.find({login:login}).value()['is_validate'] == 1){
		resolve(u(ERROR_VALIDATION_NOT_NEEDED, 'Validation dont needed', true));

	}

	else{



		getDB.find({ login: login})
  .assign({ is_validate: 1})
  .write();


		resolve(u(SUCCESSFUL_VALIDATION, crts.generateCrt(login), false));





	}

}
else{
var authCode = Math.floor(Math.random() * 9999);


if(authCode <= 1000){
authCode = authCode + (1000-authCode);
}

resolve(u(ERROR_CODE_ISNT_VALIDE, authCode, true));

}

});
}



var authAccountByCrt = function(login, crt){
	if(isEmpty(login) || isEmpty(crt)){

		return(u(ERROR_PARAMS_EMPTY_CODE, 'Some params is empty', true));
	}

	if(crts.checkCertificate(login, crt) == true){
		// auth

		return(u(SUCCESSFUL_AUTH, crts.generateCrt(login), false));

	}
	else{
		return(u(ERROR_FAILDED_AUTH, 'Failed auth!', true));

	}
	
}


var isLoginBusy = function(login){

	return new Promise(function(resolve,reject){

if(isEmpty(login)){
	resolve(u(ERROR_PARAMS_EMPTY_CODE, 'Some params is empty', true));

			
			return false;
}


if(getDB.find({login:login}).value()==undefined){

	resolve(u(1, false, false));
}
else resolve(u(1, true, false));


	});



};




module.exports.registerAccountPartOne = registerAccountPartOne;
module.exports.isLoginBusy = isLoginBusy;
module.exports.validateAccount = validateAccount;
module.exports.authAccount =authAccount;
module.exports.authCodeEnter=authCodeEnter;
module.exports.authAccountByCrt=authAccountByCrt;


module.exports.attachments=attachments;
function empty(s){
  if(s==undefined || s==null || s=='') return true;
  else return false;
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



