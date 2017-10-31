function Client(serverCommunitation){
	var win = new modulesWindow();
var socket = serverCommunitation;

this.openSocket = socket;

const ERROR_PARAMS_EMPTY_CODE = 1, ERROR_USERS_EXITS = 2, ERROR_CODE_ISNT_VALIDE = 4, ERROR_VALIDATION_NOT_NEEDED = 5, ERROR_FAILDED_AUTH=7, ERROR_AUTHCODE_ISNT_VALID = 8;


const SUCCESSFUL_REGISTER = 3, SUCCESSFUL_VALIDATION = 6, SUCCESSFUL_AUTH_BUT_NEED_VALIDATION = 9, SUCCESSFUL_AUTH = 10;






var cache = {}; // Cache for blobs.

socket.socketCopy.on('new message', function(msg){
msg = JSON.parse(LZString.decompressFromUTF16(msg))['msg'];
var key = getKeyForUser(msg['from']);

if(key==undefined) key = getKeyForUser(msg['to']);




console.log('key : ' + key);
msg['message'] = decryptMessage(msg['message'], key);



console.log(msg);
});

socket.socketCopy.on('encryptionKey', function(key){
key = JSON.parse(LZString.decompressFromUTF16(key));



console.log(key);

setKeyForUser(key['from'], key['key']);
});



function setKey(to, key){
socket.setKey(to, key);
return true;
}

var getDialogs = function(){
	socket.getDialogs().then(function(r){

		console.log(r);
		$('#prealoderDialogs').hide();

		forEach(r['msg'], function(key, value){
			
			var message = decryptMessage(value['message'], getKeyForUser(value['with']));
			

					socket.fastInfo(value['with']).then(function(z){
						console.log(value);
						console.log(z);


						getFileSecter(z['msg']['image']).then(function(url){


							$(`<div class="dialog waves-effect waves-light" onclick="client.selectDialog('`+value['with']+`')" id="message`+value['with']+`">
  <p id="userName">`+z['msg']['name']+" " + z['msg']['surname'] +`</p>
   <p id="textMessage" style="
">`+message+`</p>
  <img src="`+url+`" id="profilePhoto"></img>
</div>`).prependTo('#leftPanelMessages');


						});



						
					});
		});

		
	});
}









this.selectDialog = function(login){
$('#message'+login).addClass('selectedDialog');
$('#message'+login+' #userName').addClass('selectedName');
$('#message'+login+' #textMessage').addClass('selectedText');



socket.getMessages(login).then(function(r){
console.log(r);
})




};



function forEach(data, callback){
  for(var key in data){
    if(data.hasOwnProperty(key)){
      callback(key, data[key]);
    }
  }
}




this.registration = function(email, login, name,surname){



  $('#blockAuth #subText').show();
  $('#blockAuth #progressAuth').show();



  socket.registration(email, login, name, surname).then(function(r){
   

  	  $('#blockAuth #subText').hide();
  $('#blockAuth #progressAuth').hide();

  	console.log(r);


  	if(r['error_code']==ERROR_PARAMS_EMPTY_CODE){
  		$('#myNameInput').addClass('invalid');
  		$('#mySurnameInput').addClass('invalid');
  		$('#myEmailInput').addClass('invalid');
  		$('#myLoginRegInput').addClass('invalid');
  	}
  	else if(r['error_code']==ERROR_USERS_EXITS){
  		$('#myLoginRegInput').addClass('invalid');

  			win.openWindowText('infoPopup', {title:'Логин занят', text:'Данный логин занят.'});

  	}

  	
  	else if(r['code']==SUCCESSFUL_REGISTER){
  		$('#registrationS').hide();
$('#needRegcodeSection').fadeIn(300);
  	}


  })


};


this.enterCode = function(login, code){

  $('#blockAuth #subText').show();
  $('#blockAuth #progressAuth').show();


  socket.enterCode(login, code).then(function(r){
   

  	  $('#blockAuth #subText').hide();
  $('#blockAuth #progressAuth').hide();

  	console.log(r);


  	if(r['error_code']==ERROR_PARAMS_EMPTY_CODE){
  		$('#myRegcodeInput').addClass('invalid');
  	}
  	else if(r['error_code']==ERROR_AUTHCODE_ISNT_VALID){
  		$('#myRegcodeInput').addClass('invalid');
  		win.openWindowText('infoPopup', {title:'Неверный код', text:'Данный код авторизации неверен.'});
  			
  	}
  	else if(r['code']==SUCCESSFUL_AUTH){
  		// auth!

  		getDialogs();

  		$('.row').fadeIn(250);
  		setCookie('lastLogin', r['msg']['login']);
  		setCookie('lastCrt', r['msg']['crt']);


  		$('#blockAuth').fadeOut(200);
  	}


  })


}

this.authAccount=function(login){

  $('#blockAuth #subText').show();
  $('#blockAuth #progressAuth').show();



  socket.authAccount(login).then(function(r){
   

  	  $('#blockAuth #subText').hide();
  $('#blockAuth #progressAuth').hide();

  	console.log(r);


  	if(r['error_code']==ERROR_PARAMS_EMPTY_CODE){
  		$('#myLoginInput').addClass('invalid');
  	}
  	else if(r['error_code']==ERROR_FAILDED_AUTH){

  			
  			$('#firstAuthSection').hide();
			$('#registrationS').fadeIn(300);	
			$('#myLoginRegInput').focus();
			$('#myLoginRegInput').val(login);
  	}
  	else if(r['code']==SUCCESSFUL_AUTH_BUT_NEED_VALIDATION){
  		$('#firstAuthSection').hide();
$('#needAuthcodeSection').fadeIn(300);
  	}


  })
}


this.authByCrt = function(login,crt){


socket.authByCrt(login, crt).then(function(r){




console.log(r);




 if(r['code']==10){
	// auth!!

	getDialogs()
	$('.row').fadeIn(250);
	$('#blockAuth').fadeOut(200);

	setCookie('lastLogin', r['msg']['login']);
  		setCookie('lastCrt', r['msg']['crt']);
}


});


};



var encryptMessage = function(text, key){
var textBytes = aesjs.utils.utf8.toBytes(text);
key = aesjs.utils.hex.toBytes(key);
var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
var encryptedBytes = aesCtr.encrypt(textBytes);
var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
return encryptedHex;


};

 var decryptMessage = function(text, key){
var encryptedBytes = aesjs.utils.hex.toBytes(text);
 key = aesjs.utils.hex.toBytes(key);
// The counter mode of operation maintains internal state, so to 
// decrypt a new instance must be instantiated. 
var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
var decryptedBytes = aesCtr.decrypt(encryptedBytes);
 
// Convert our bytes back into text 
var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
return decryptedText;

};





this.sendMessage = function(message,to){
	var key = getKeyForUser(to);
	if(key==undefined){
		key = generateEncryptKey();
		setKeyForUser(to, key);




		setKey(to, key);

	}
	
	message = encryptMessage(message, key);


socket.sendMessage(message, to).then(function(r){
	console.log(r);
});
};


  function toHexString(byteArray) {
  return Array.from(byteArray, function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('')
}


var getKeyForUser = function(id){
var keys = localStorage.getItem('keys');


if(keys == undefined || keys == "null") return undefined;


keys = JSON.parse(keys);


return keys[id];
};

var setKeyForUser = function(id, key){

	var keys = localStorage.getItem('keys');
	if(keys == undefined || keys == "null") keys = {};
	else keys = JSON.parse(keys);


	keys[id] = key;

	localStorage.setItem('keys', JSON.stringify(keys));


}



var generateEncryptKey = function(){
            var key = Array();

            for(var i = 0;i < 33;i++){
              if(key.length == 32){
                 return toHexString(new Uint8Array(key));
              
              }


            key.push(Math.floor(Math.random() * 256));
            }
            

             }



this.getLinkAttachments = function(){
socket.getLinkAttachments().then(function(r){
	console.log(r);
});
};




this.validateAccount = function(login, code){

	  $('#blockAuth #subText').show();
  $('#blockAuth #progressAuth').show();



socket.validateAccount(login, code).then(function(r){

 $('#blockAuth #subText').hide();
  $('#blockAuth #progressAuthCode').hide();


console.log(r);


if(r['error_code']==ERROR_PARAMS_EMPTY_CODE){
  		$('#myAuthcodeInput').addClass('invalid');
  	}


else if(r['code']==6){
	// auth!!
	getDialogs()
	$('.row').fadeIn(250);

	$('#blockAuth').fadeOut(200);

	setCookie('lastLogin', r['msg']['login']);
  		setCookie('lastCrt', r['msg']['crt']);
}

else if(r['error_code']==4){

	win.openWindowText('infoPopup', {title:'Неверный код', text:'Данный код регистрации неверен.'});




}

});
};




$('#cancelButton').on('click', function(){
console.log('closeWindow');
win.closeWindows();
});


$('#agreeButton').on('click', function(){
console.log('closeWindow');
win.closeWindows();
});




function createBlobFromSource (b64Data, contentType, sliceSize) {
  contentType = contentType || '';
  sliceSize = sliceSize || 512;

  var byteCharacters = atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  var blob = new Blob(byteArrays, {type: contentType});

var blobUrl = URL.createObjectURL(blob);

return blobUrl;
}



var getFileSecter = function(id){
	return new Promise(function(resolve,reject){


			$.get('/getAttachment/'+id, {}, function(r){



	try{
		r = JSON.parse(r);



	}


	catch(e){

		resolve(false);
		return false;

	}
try{
	var blob = createBlobFromSource(r['data'], r['mime']);
}
catch(e){
	resolve(false);
	return false;
}
resolve(blob);





});



	});



}


this.getFile = function(id){
	return new Promise(function(resolve,reject){


			$.get('/getAttachment/'+id, {}, function(r){



	try{
		r = JSON.parse(r);



	}


	catch(e){

		resolve(false);
		return false;

	}
try{
	var blob = createBlobFromSource(r['data'], r['mime']);
}
catch(e){
	resolve(false);
	return false;
}
resolve(blob);





});



	});



}

this.uploadFile = function(file, isProfileImage){

}

function insertDialogs(dialog){

}


}

