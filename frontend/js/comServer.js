function ServerCommunitation(socketObj){





  var socket = socketObj;

  this.socketCopy = socket;
 


  function sendRequest(params){
    return new Promise(function(resolve, reject){
      socket.emit('request', LZString.compressToUTF16(JSON.stringify(params)), function(data){

      	
        resolve(JSON.parse(LZString.decompressFromUTF16(data)));
      });
    });
    
  };




this.setKey=function(to, key){
return new Promise(function(r,rj){
		
	console.log('send key!');
		r(sendRequest({method:'key.setKey', to:to, key:key}));
	});
};
this.validateAccount = async function(login, code){
	return new Promise(function(r,rj){
		

		r(sendRequest({method:'auth.validateAccount', login:login, code:code}));
	});
	
};

this.authByCrt = async function(login, crt){


return new Promise(function(r,rj){
		

		r(sendRequest({method:'auth.authCrt', login:login, crt:crt}));
	});



};
this.getDialogs = function(){
return new Promise(function(r,rj){
		r(sendRequest({method:'messages.getDialogs'}));
	});

};

this.fastInfo = function(login){

	return new Promise(function(r,rj){
		r(sendRequest({method:'info.getFast', login:login}));
	});

}
this.getLinkAttachments = function(){
return new Promise(function(r,rj){
		

		r(sendRequest({method:'attachments.getLink'}));
	});
};

this.authAccount = async function(login){

	return new Promise(function(r,rj){
		

		r(sendRequest({method:'auth.auth', login:login}));
	});

};

this.enterCode = async function(login, code){

	return new Promise(function(r,rj){
		

		r(sendRequest({method:'auth.enterCode', login:login, code:code}));
	});

};


this.registration = async function(email, l, name, surname){

return new Promise(function(r,rj){
		

r(sendRequest({method:'auth.register', e:email, l:l, name:name, surname:surname}));
	});



};


  this.sendMessage=function(message, to){
  	return new Promise(function(r,rj){
		

r(sendRequest({method:'messages.send', message:message, to:to}));
	});
  };


}