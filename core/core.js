var mysql = require('promise-mysql');

global.config = require(__dirname + '/config.js').settings;
mysql.createConnection(global.config).then(function(connection) {




	// // TODO: SEQULIZE FULL
console.log('Init');
	require('./database.js').setupConnection(global.config.db.dbName, global.config.db.dbUser, global.config.db.dbPassword,global.config.db.options).startConnection().then(async function(db) {
		global.db = db;
		global.conn = require('./classes/connection.js');

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

		// db.models.users.findAll({where:{login:'DuckerManZ'}, attributes:['userid']}).then((r)=>console.log(r[0]['dataValues']))





			var shortid = require('shortid');

			var crts = require('./classes/crts.js');
			var attachments = require('./classes/attachments.js');
			var contacts = require('./classes/contacts.js');
			var calls = require('./classes/calls.js');
			var dialogs = require('./classes/dialogs.js');

			dialogs.setConnection(connection);
			dialogs.setEscape(connection.escape);
			contacts.setConnection(connection);
			contacts.setEscape(connection.escape); // Говнокод, но все-же

			var async = require('async');



			var mail = require('./classes/mail.js');
			var LZString = require('lz-string');



			// errors constant
			// thanks Alexey!
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
				SUCCESSFUL_GENERATE_TOKEN = 11;


			const SUCCESSFUL_GETTING_INFO = 15;
			var registerAccountPartOne = async function(login, email, name, surname) {



				if (isEmpty(login) || isEmpty(email) || isEmpty(name) || isEmpty(surname)) {
					return (u(ERROR_PARAMS_EMPTY_CODE, 'Some params is empty', true));

				}

				try {
					login = login.toString();
				} catch (e) {
					// log

					return (666, 'Internal server error', true);
				}

				login = login.replace(/[^a-z ^1-9]/ig, '');



				var hasUsers = await connection.query(`SELECT login FROM users WHERE login = '${login}' OR email = '${email}'`);


				if (hasUsers.length != 0) {
					return (u(ERROR_USERS_EXITS, 'User is already exists', true));

					// user exists

				}


				connection.query(`INSERT INTO users VALUES(NULL, '${login}', '${email}', '${name}', '${surname}', 'default', 1, 0, 0, 0, 0)`);

				var authCode = Math.floor(Math.random() * 9999);


				if (authCode <= 1000) {
					authCode = authCode + (1000 - authCode);
				}

				return (u(SUCCESSFUL_REGISTER, authCode, false));



			};



			var authAccount = async function(login) {


				if (isEmpty(login)) {

					return (u(ERROR_PARAMS_EMPTY_CODE, 'Some params is empty', true));



				}

				var user = await connection.query(`SELECT is_validate FROM users WHERE login = '${login}' `);
				console.log('USER : ');
				console.log(user);
				if (typeof user[0] == 'undefined' || user[0]['is_validate'] == 0) {
					return (u(ERROR_FAILDED_AUTH, 'Falied auth', true));
					return false;
				}

				var authCode = Math.floor(Math.random() * 9999);


				if (authCode <= 1000) {
					authCode = authCode + (1000 - authCode);
				}

				return (u(SUCCESSFUL_AUTH_BUT_NEED_VALIDATION, authCode, false));



			};


			var authCodeEnter = async function(login, code, realCode) {



				if (empty(code) || empty(realCode) || empty(login)) {
					return (u(ERROR_PARAMS_EMPTY_CODE, 'Some params is empty', true));


				}


				var user = await connection.query(`SELECT is_validate FROM users WHERE login = '${login}' `);



				if (typeof user[0] == 'undefined') {

					return (u(ERROR_FAILDED_AUTH, 'Falied auth', true));

				}



				if (code == realCode) {



					return (u(SUCCESSFUL_AUTH, crts.generateCrt(login), false))

				} else {

					var authCode = Math.floor(Math.random() * 9999);


					if (authCode <= 1000) {
						authCode = authCode + (1000 - authCode);
					}



					return (u(ERROR_AUTHCODE_ISNT_VALID, authCode, true));

				}


			};
			var validateAccount = async function(login, code, realCode) {


				if (empty(code) || empty(realCode) || empty(login)) {
					return (u(ERROR_PARAMS_EMPTY_CODE, 'Some params is empty', true));


					return false;
				}


				if (code == realCode) {

					// successful
					var user = await connection.query(`SELECT is_validate FROM users WHERE login = '${login}' `);
					console.log('USER : ');
					console.log(user[0]);


					if (user[0]['is_validate'] == 1) {
						return (u(ERROR_VALIDATION_NOT_NEEDED, 'Validation dont needed', true));

					} else {



						connection.query(`UPDATE users SET is_validate = 1 WHERE login = '${login}' `);


						return (u(SUCCESSFUL_VALIDATION, crts.generateCrt(login), false));



					}

				} else {
					var authCode = Math.floor(Math.random() * 9999);


					if (authCode <= 1000) {
						authCode = authCode + (1000 - authCode);
					}

					return (u(ERROR_CODE_ISNT_VALIDE, authCode, true));

				}


			}


			 function changeProfilePhoto(login, photoID) {
			   if (!login || !photoID) return (u(ERROR_PARAMS_EMPTY_CODE, 'Some params is empty', true));
			   let db = global.conn.getConnection('user');
			   db.models.users.update({
			     image: photoID,
			   }, {
			     where: {
			       login: login
			     }
			   });
			   return u(0, true, false);
			 };

			var getFastInfo = async function(login) {

				var info = await connection.query(`SELECT name, surname, userid, image, online, lastOnline, is_offical FROM users WHERE login = '${login}'`);

				var info = info[0];

				if (typeof info == 'undefined') {
					info = {
						name: 'DELETED',
						surname: 'ACCOUNT',
						userid: 0,
						is_deleted: 1
					};
				}
				return (u(SUCCESSFUL_GETTING_INFO, info, false));


			};

			var authAccountByCrt = function(login, crt) {
				if (isEmpty(login) || isEmpty(crt)) {

					return (u(ERROR_PARAMS_EMPTY_CODE, 'Some params is empty', true));
				}

				if (crts.checkCertificate(login, crt) == true) {
					// auth

					return (u(SUCCESSFUL_AUTH, crts.generateCrt(login), false));

				} else {
					return (u(ERROR_FAILDED_AUTH, 'Failed auth!', true));

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

			// end



			var generateToken = function(login) {
				return new Promise(function(resolve, reject) {


					if (isEmpty(login)) {

						resolve(u(ERROR_PARAMS_EMPTY_CODE, 'Some params is empty', true));


						return false;
					}

					var token = shortid.generate() + shortid.generate() + shortid.generate();
					resolve(u(SUCCESSFUL_GENERATE_TOKEN, token, false));


				});
			};



			var setOnline = function(login) {
				return new Promise(function(resolve, reject) {
					if (isEmpty(login)) {
						resolve(u(ERROR_PARAMS_EMPTY_CODE, 'Some params is empty', true));


						return false;
					}


					connection.query(`UPDATE users SET online = 1 WHERE login = '${login}' `);

					resolve(u(0, true, false));



					setTimeout(function() {

						connection.query(`UPDATE users SET online = 0, lastOnline=` + Math.floor(Date.now() / 1000) + ` WHERE login = '${login}' `);
						console.log('Delete online =( ');
					}, 9000);
				});
			}

			 async function getOnline(login) {
			 	let db = global.conn.getConnection('user');
				if (isEmpty(login)) {
					return (u(ERROR_PARAMS_EMPTY_CODE, 'Some params is empty', true));
				}

				let raw = await db.models.users.findAll({where:{
					login:login
				}, attributes:['online', 'lastOnline']});



				var user;

				if (raw.length == 0){

					 user = {
						online: 0,
						lastOnline: 0
					};

				}

				else{
					user = raw[0].dataValues;
				}

				return (u(0, user, false));
			}


			var searchUsers = async function(userLogin) {
				let db = global.conn.getConnection('user');
				if (userLogin.length <= 3) return u(0, [], false);


				let usersRaw = await db.models.users.findAll({
					where:{
						login:{
							[Op.like]: `%${userLogin}%`
						}
					},
					limit:10,
					attributes:['name', 'surname', 'userid', 'image', 'online', 'lastOnline', 'is_offical', 'login'],
					raw:true
				})

				var users = usersRaw;

				if(usersRaw.length == 0) users = [];


				return u(0, users, false);


			}



			module.exports.changeProfilePhoto = changeProfilePhoto;

			module.exports.registerAccountPartOne = registerAccountPartOne;
			module.exports.validateAccount = validateAccount;
			module.exports.authAccount = authAccount;
			module.exports.authCodeEnter = authCodeEnter;
			module.exports.authAccountByCrt = authAccountByCrt;
			module.exports.generateToken = generateToken;
			module.exports.getFastInfo = getFastInfo;
			module.exports.searchUsers = searchUsers;
			module.exports.setOnline = setOnline;
			module.exports.getOnline = getOnline;

			module.exports.attachments = attachments;
			module.exports.calls = calls;
			module.exports.contacts = contacts;
			module.exports.dialogs = dialogs;

			function empty(s) {
				if (s == undefined || s == null || s == '') return true;
				else return false;
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




});
