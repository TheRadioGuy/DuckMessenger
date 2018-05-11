var mysql      = require('promise-mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'duckmessenger'
}).then(function(connection){



duck().then(function(r){
	console.log(r.length)
}).catch((e)=>console.log(e));

async function duck(){
	console.log('Add');
	/*for (var i = 0; i < 50000; i++) {
		console.log('Add '  + i);
		connection.query("INSERT INTO users(login) VALUES('"+Math.round(Math.random()*99999999999)+"')").catch((r)=>console.log(e));
	}*/
	return await connection.query("SELECT login FROM users")
	
}

});
