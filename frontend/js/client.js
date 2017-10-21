function Client(serverCommunitation){
var socket = serverCommunitation;








this.validateAccount = async function(login, code){
	return new Promise(function(r,rj){
		

		r(socket.sendRequest({method:'auth.validateAccount', login:login, code:code}));
	});
	
};

this.authAccount = async function(login){

	return new Promise(function(r,rj){
		

		r(socket.sendRequest({method:'auth.auth', login:login}));
	});

};

this.enterCode = function(login, code){

	return new Promise(function(r,rj){
		

		r(socket.sendRequest({method:'auth.enterCode', login:login, code:code}));
	});

};


this.registration = function(email, l, name, surname){

return new Promise(function(r,rj){
		

r(socket.sendRequest({method:'auth.register', e:email, l:l, name:name, surname:surname}));
	});



};



}