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
this.validateAccount = function(login, code){
	return new Promise(function(r,rj){
		

		r(sendRequest({method:'auth.validateAccount', login:login, code:code}));
	});
	
};

this.authByCrt = function(login, crt){


return new Promise(function(r,rj){
		

		r(sendRequest({method:'auth.authCrt', login:login, crt:crt}));
	});



};
this.getDialogs = function(){
return new Promise(function(r,rj){
		r(sendRequest({method:'messages.getDialogs'}));
	});

};


this.deleteMessage = function(id){
return new Promise(function(r,rj){
		r(sendRequest({method:'messages.delete', id:id}));
	});

};

this.editMessage = function(id, msg){
return new Promise(function(r,rj){
		r(sendRequest({method:'messages.edit', id:id, msg:msg}));
	});

};

this.getMessages=function(login){
return new Promise(function(r,rj){
		r(sendRequest({method:'messages.get', login:login}));
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

this.setOnline = function(){
	return new Promise(function(r,rj){
		

		r(sendRequest({method:'account.setOnline'}));
	});

};
this.getOnline = function(login){
	return new Promise(function(r,rj){
		

		r(sendRequest({method:'account.getOnline', login:login}));
	});

};

this.setTyping = function(to){
	return new Promise(function(r,rj){
		

			r(sendRequest({method:'messages.setTyping', to:to}));
	});


};
this.authAccount = function(login){

	return new Promise(function(r,rj){
		

		r(sendRequest({method:'auth.auth', login:login}));
	});

};


this.deleteAccount = function(user){
	
	return new Promise(function(r,rj){
		

		r(sendRequest({method:'admin.deleteAccount', user:user}));
	});

}

this.searchUser = function(login){

	return new Promise(function(r,rj){
		

		r(sendRequest({method:'users.search', login:login}));
	});

};

this.callUser = function(login){

	return new Promise(function(r,rj){
		

		r(sendRequest({method:'calls.call', login:login}));
	});

};

this.callAccept = function(login){

	return new Promise(function(r,rj){
		

		r(sendRequest({method:'calls.accept', login:login}));
	});

};


this.callEnd = function(login){

	return new Promise(function(r,rj){
		

		r(sendRequest({method:'calls.end', login:login}));
	});

};

this.callSay = function(user, data){
return new Promise(function(r,rj){
		

		r(sendRequest({method:'calls.say', user:user, dataCalling:data}));
	});
}
this.contactsAdd = function(mail, data){

	return new Promise(function(r,rj){
		

		r(sendRequest({method:'contacts.add', mail:mail, data:data}));
	});

};
this.contactsGet = function(mail, data){

	return new Promise(function(r,rj){
		

		r(sendRequest({method:'contacts.get'}));
	});

};
this.enterCode = function(login, code){

	return new Promise(function(r,rj){
		

		r(sendRequest({method:'auth.enterCode', login:login, code:code}));
	});

};

this.registration = function(email, l, name, surname){

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