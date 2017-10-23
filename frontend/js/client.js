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

	$('#blockAuth').fadeOut(200);
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






}

