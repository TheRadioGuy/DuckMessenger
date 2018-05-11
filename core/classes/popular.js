var connection;
module.exports.setConnection = function(c){
connection=c;
};
const getFastInfo = async function(login) {

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
		return info;


	};

	async function getLogin(token){

	}


	module.exports.fastInfo = getFastInfo;
