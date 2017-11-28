const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')

const adapter = new FileAsync('./core/databases/users.json');
var shortid = require('shortid');

var crts = require('./classes/crts.js');
var attachments = require('./classes/attachments.js');
var calls = require('./classes/calls.js');
var async = require('async');

low(adapter)
  .then(db => {






   db.defaults({users: []})
  .write()



var getDB = db.get('users');
var mail = require('./classes/mail.js');
var LZString = require('lz-string');




// errors constant
// thanks Alexey!
const ERROR_PARAMS_EMPTY_CODE = 1, ERROR_USERS_EXITS = 2, ERROR_CODE_ISNT_VALIDE = 4, ERROR_VALIDATION_NOT_NEEDED = 5, ERROR_FAILDED_AUTH=7, ERROR_AUTHCODE_ISNT_VALID = 8;


const SUCCESSFUL_REGISTER = 3, SUCCESSFUL_VALIDATION = 6, SUCCESSFUL_AUTH_BUT_NEED_VALIDATION = 9, SUCCESSFUL_AUTH = 10, SUCCESSFUL_GENERATE_TOKEN = 11;


const SUCCESSFUL_GETTING_INFO = 15;
var registerAccountPartOne = function(login, email, name, surname){



	return new Promise(function(resolve, reject){
		console.log('call');
		if(isEmpty(login) || isEmpty(email) || isEmpty(name) || isEmpty(surname)){
			resolve(u(ERROR_PARAMS_EMPTY_CODE, 'Some params is empty', true));

			
			return false;
		}

			try{
			loginLow = login.toString().toLowerCase();
		}
		catch(e){
			// log

			resolve(666, 'Internal server error', true);
		}
		
		login = login.replace(/[^a-z ^1-9]/ig, '');




 if(getDB.find({login:login, email:email}).value()!=undefined){
resolve(u(ERROR_USERS_EXITS, 'User is already exists', true));

 	// user exists

return false;
 }


  getDB.push({ userid: shortid.generate()+shortid.generate(), login: login, loginLow:loginLow , email:email, name:name, surname:surname, settings:{}, image:'defaultImage', rights:0, online:0, is_validate:0, lastOnline:0, is_offical:0})

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


var changeProfilePhoto = function(login, photoID){

getDB.find({login:login}).assign({image:photoID}).write();
return u(0, true, false);
};


var getFastInfo = function(login){
	return new Promise(function(resolve,reject){
		var info = getDB.find({login:login}).value();


		if(info == undefined){
			info = {name:'DELETED', surname:'', userid:0};
		}
resolve(u(SUCCESSFUL_GETTING_INFO, {name:info['name'], surname:info['surname'], userid:info['userid'], image:info['image'], online:info['online'], lastOnline:info['lastOnline'], is_offical:info['is_offical']} , false));

	});

};

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



// admin
/* rigths:
1 - user
2 - support agent
3 - Moderator
4 - J.ADM
5 - M.ADM
6 - Administator
7 - Main Administator
*/
	var deleteUser = function(login, user) {
		return new Promise(function(resolve, reject) {
			if (isEmpty(login)) {

				resolve(u(ERROR_PARAMS_EMPTY_CODE, 'Some params is empty', true));


				return false;
			}

			var myInfo = getDB.find({login:login});
			if(myInfo['rights']<=4){
				resolve(u(666, 'Permission denied!', true));
				return false;
			}


			getDB.remove({login:user}).write();
			resolve(u(0, 'Permission denied!', false));

		});
	}
// end



var generateToken = function(login){
return new Promise(function(resolve,reject){


if(isEmpty(login)){

	resolve(u(ERROR_PARAMS_EMPTY_CODE, 'Some params is empty', true));

			
			return false;
}

var token = shortid.generate() + shortid.generate() + shortid.generate();
resolve(u(SUCCESSFUL_GENERATE_TOKEN, token, false));


});
};


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



var setOnline = function(login){
return new Promise(function(resolve, reject){
	if(isEmpty(login)){
			resolve(u(ERROR_PARAMS_EMPTY_CODE, 'Some params is empty', true));

			
			return false;
	}


	getDB.find({ login: login}).assign({online:1}).write();

	resolve(u(0, true, false));


	
	setTimeout(function(){
		getDB.find({ login: login}).assign({lastOnline:Math.floor(Date.now()/1000), online:0}).write();

		console.log('Delete online =( ');
	}, 9000);
});
}

var getOnline = function(login){
return new Promise(function(resolve, reject){
	if(isEmpty(login)){
			resolve(u(ERROR_PARAMS_EMPTY_CODE, 'Some params is empty', true));

			
			return false;
	}


	var online = getDB.find({ login: login}).value();

	resolve(u(0, {online:online['online'], lastOnline:online['lastOnline']}, false));



});
}


var searchUsers = function(userLogin){

	return new Promise(function(resolve,reject){
		try{
			userLogin = userLogin.toString();
		}
		catch(e){
			// log

			resolve(666, 'Internal server error', true);
		}

		var tmpUsersArr = getDB.filter({login:userLogin}).sortBy('lastOnline')
  .take(99999999999999999999999999999999999999)
  .value();







  if(typeof tmpUsersArr[0]=='undefined'){
  	resolve(u(0, [], false));
  	return false;
  } 


var usersArr = [];


  async.forEachOf(tmpUsersArr, function (value, key, callback) {
  	var tmpValue = {name:value['name'], surname:value['surname'], online:value['online'], lastOnline:value['lastOnline'], image:value['image'], login:value['login'], userid:value['userid']};

  	usersArr.push(tmpValue);


  callback();
}, function (err) {
    if (err) console.error(err.message);
   

   resolve(u(0, usersArr, false));

});



	});


}






module.exports.changeProfilePhoto=changeProfilePhoto;

module.exports.registerAccountPartOne = registerAccountPartOne;
module.exports.isLoginBusy = isLoginBusy;
module.exports.validateAccount = validateAccount;
module.exports.authAccount =authAccount;
module.exports.authCodeEnter=authCodeEnter;
module.exports.authAccountByCrt=authAccountByCrt;
module.exports.generateToken=generateToken;
module.exports.getFastInfo=getFastInfo;
module.exports.searchUsers=searchUsers;
module.exports.setOnline=setOnline;
module.exports.getOnline=getOnline;
module.exports.deleteUser=deleteUser;
module.exports.attachments=attachments;
module.exports.calls=calls;
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



