function Client(serverCommunitation){
	var win = new modulesWindow();
var socket = serverCommunitation;


const ERROR_PARAMS_EMPTY_CODE = 1, ERROR_USERS_EXITS = 2, ERROR_CODE_ISNT_VALIDE = 4, ERROR_VALIDATION_NOT_NEEDED = 5, ERROR_FAILDED_AUTH=7, ERROR_AUTHCODE_ISNT_VALID = 8;


const SUCCESSFUL_REGISTER = 3, SUCCESSFUL_VALIDATION = 6, SUCCESSFUL_AUTH_BUT_NEED_VALIDATION = 9, SUCCESSFUL_AUTH = 10;







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
	$('.row').fadeIn(250);
	$('#blockAuth').fadeOut(200);

	setCookie('lastLogin', r['msg']['login']);
  		setCookie('lastCrt', r['msg']['crt']);
}


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

