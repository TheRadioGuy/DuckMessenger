function Client(serverCommunitation) {

var db = openDatabase("dialogs", "1.0", "Dialogs cache", 10 * 1024 * 1024);
const that = this;
db.transaction(function(tx) {
	// Some changes in proto
	that.tx = tx;

	console.log('open connect');
	// console.log(tx);
	// tx.executeSql = (query, attr)=>{
	// 	return new Promise((resolve,reject)=>{
	// 		tx.executeSql(query, attr, result=>resolve(result), (_, err)=>reject(err));
	// 		return false;
	// 	});
	// }

});
	window.AudioContext = window.AudioContext || window.webkitAudioContext; // copypaste from socket.io-p2p, TODO




	var blobsCaches = {};
	var win = new modulesWindow();
	var socket = serverCommunitation;

	var Peer;


	var isCalling = false;
	var callingInterval;
	var callingStartTimestamp;
	var blobsCalling = [];
	var audios = {};
	var callingMs = 0;
	var tmpCache = {};
	var isMessageSelected=false;
	var isMobile = $(window).width() <= 480;
	this.openSocket = socket;
	this.openWindow = win;

	const ERROR_PARAMS_EMPTY_CODE = 1,
		ERROR_USERS_EXITS = 2,
		ERROR_CODE_ISNT_VALIDE = 4,
		ERROR_VALIDATION_NOT_NEEDED = 5,
		ERROR_FAILDED_AUTH = 7,
		ERROR_AUTHCODE_ISNT_VALID = 8;


	const SUCCESSFUL_REGISTER = 3,
		SUCCESSFUL_VALIDATION = 6,
		SUCCESSFUL_AUTH_BUT_NEED_VALIDATION = 9,
		SUCCESSFUL_AUTH = 10;



	var cache = {}; // Cache for blobs.



	socket.socketCopy.on('new message', function(msg) {
		msg = JSON.parse(LZString.decompressFromUTF16(msg));
		console.log(msg);
		var key = getKeyForUser(msg['from']);

		if (key == undefined) key = getKeyForUser(msg['to']);



		console.log('key : ' + key);
		msg['message'] = decryptMessage(msg['message'], key);



		console.log(msg);



		messageParser(msg['message'], 'messageToMe', msg['id'], '').then(function(messageInfo) {



			$('#message' + msg['from']).prependTo('#leftPanelMessages');

			$('#message' + msg['from'] + ' #textMessage').text(messageInfo['dialogsText']);



			if ($('#message' + msg['from']).length == 0) {


				console.log('length null');





					getFileSecter(msg['image'], 'photo_128').then(function(url) {


						tmpCache['s' + msg['image']] = url;
						if (url == false) url = '/images/defaultprofileimage.jpg';

						if(document.hidden){
									Notification.requestPermission(function(){
							var mailNotification = new Notification(msg['name'] + " " + msg['surname'], {
							tag: "message",
							body: messageInfo['dialogsText'],
							icon: url
						});


							mailNotification.onclick = function(){
								window.focus();
							};
						});
						}







						$(`<div class="dialog waves-effect waves-light" onclick="client.selectDialog('` + msg['from'] + `')" id="message` + msg['from'] + `">
  <p id="userName">` + msg['name'] + " " + msg['surname'] + `</p>
   <p id="textMessage" class="truncate" style="
">` + messageInfo['dialogsText'] + `</p>
  <img src="` + url + `" id="profilePhoto"></img>
</div>`).prependTo('#leftPanelMessages');


					});






			}



			if ($('#block' + msg['from']).length != 0) {


				$('#block' + msg['from'] + ' .messagesList').append(messageInfo['template']);

				$('#block' + msg['from']).scrollTop(9999999999999999999999999999999999999);

			}


			console.log(messageInfo);
		});



	});

	socket.socketCopy.on('privateChat', function(data){

		if(JSON.parse(data.signal).candidate) return false;
		console.log(data.signal)
		if(!isEmpty(Peer) && Peer.initiator==true) var peer = Peer;
		else var peer = new SimplePeer({reconnectTimer:1});

			peer.on('signal', (d)=>{

				console.log(d);
			socket.socketCopy.emit("messages.startPrivate", {signal:JSON.stringify(d), login:data.from})
	});

			peer.on('connect', function(){
				console.log("Connect with peer");
				window.test = peer;
				peer.on('data', (data)=>console.log('Get msg : ' + data));
			})
		peer.signal(data.signal);

		Peer = peer;


	});

	this.startPrivateChat = function(to){
	let peer = new SimplePeer({ initiator: true, reconnectTimer:1 });
	peer.on('signal', (data)=>socket.socketCopy.emit("messages.startPrivate", {signal:JSON.stringify(data), login:to}));
	Peer = peer;
	};

	socket.socketCopy.on('signal', function(data){

		if(JSON.parse(data.signal).candidate) return false;
		console.log(data.signal)
		if(!isEmpty(Peer) && Peer.initiator==true) var peer = Peer;
		else var peer = new SimplePeer({reconnectTimer:1});

			peer.on('signal', (d)=>{

				console.log(d);
			socket.socketCopy.emit("startCall", {signal:JSON.stringify(d), login:data.from})
	});

			peer.on('connect', function(){
				console.log("Connect with peer");
				window.test = peer;
				peer.on('data', (data)=>console.log('Get msg : ' + data));
			})
		peer.signal(data.signal);

		Peer = peer;


	});

	this.startCall = function(to){
	let peer = new SimplePeer({ initiator: true, reconnectTimer:1 });
	peer.on('signal', (data)=>socket.socketCopy.emit("startCall", {signal:JSON.stringify(data), login:to}));
	Peer = peer;
	};

	socket.socketCopy.on('encryptionKey', function(key) {
		key = JSON.parse(LZString.decompressFromUTF16(key));



		console.log(key);

		setKeyForUser(key['from'], key['key']);
	});

	socket.socketCopy.on('callAccept', function(msg) {

		msg = JSON.parse(LZString.decompressFromUTF16(msg));


		startRecord(function(result){
				socket.callSay(msg['from'], result);
			});


		// say
		$('#meCallToFriend').show();
			$('#friendCallToMe').hide();
			$('.callingProcessBlock #callingEnd').removeClass('scale-out');
			$('.callingProcessBlock #callingEnd').addClass('scale-in');
			$('.callingProcessBlock #callingEnd').css('animation', 'duck');




			callingStartTimestamp = Math.floor(Date.now()/1000);

			clearInterval(callingInterval);

		callingInterval = setInterval(function() {
			var callingTime = new Date(Math.floor(Date.now()/1000)-callingStartTimestamp);

			$('.callingTime').text(callingTime.getMinutes() + ':' + callingTime.getSeconds());

		}, 1000);


			$('.callingTime').removeClass('scale-out');
			$('.callingTime').addClass('scale-in');
			$('.animationCalling').hide();
	});



	socket.socketCopy.on('callData', function(msg) {

		var data = JSON.parse(LZString.decompressFromUTF16(msg))['data'];

		console.log(data);

		  var binary=convertDataURIToBinary(data);


  var blob=new Blob([binary], {type : 'audio/webm'});

  blobsCalling.push(blob);



  var blobUrl = URL.createObjectURL(new Blob(blobsCalling, {type : 'audio/webm'}));
  console.log('URL : ' + blobUrl);





	});

	socket.socketCopy.on('deleteMessage', function(msg) {
		console.log('deleteMessage');


		console.log(msg);

		$('#messageID'+msg['id']).remove();





	});

		socket.socketCopy.on('editMessage', function(msg) {
		console.log('editMessage');


		console.log(msg);
		var editMessage = decryptMessage(msg['msg'], getKeyForUser(msg['from']));
		console.log(editMessage);
		$('#messageID'+msg['id']).text(editMessage);





	});








function convertDataURIToBinary(dataURI) {
	var BASE64_MARKER = ';base64,';
  var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  var base64 = dataURI.substring(base64Index);
  var raw = window.atob(base64);
  var rawLength = raw.length;
  var array = new Uint8Array(new ArrayBuffer(rawLength));

  for(i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
}



	socket.socketCopy.on('callEnd', function(msg) {
		blobsCalling = [];
		callingMs=0;
		$('#mask').hide();
		$('.callingProcessBlock').removeClass('scale-in');
		$('.callingProcessBlock').addClass('scale-out');

		if(typeof voice=='object') voice.stop();
	});




	socket.socketCopy.on('call', function(msg) {
		msg = JSON.parse(LZString.decompressFromUTF16(msg));



		console.log(msg);
		$('#mask').show();
		$('.callingProcessBlock').removeClass('scale-out');
		$('.callingProcessBlock').addClass('scale-in');

		$('#meCallToFriend').hide();
		$('#friendCallToMe').show();

		$('.callingProcessBlock .userInfoCall').text(msg['name']);
		$('.cirleLoadUserImageCall').show();


		getFileSecter(msg['image'], 'photo_450').then(function(photo) { // load photo

					$('.cirleLoadUserImageCall').hide();

					$('.cirleLoadUserImageCall').circleProgress('value', 50);


						if (photo == false) photo = '/images/defaultprofileimage.jpg';
						if(photo=='defaultImage') photo = '/images/defaultprofileimage.jpg';



						$('.callingProcessBlock #userImageCalling').attr('src', photo);

						tmpCache['m' + msg['image']] = photo;

					});


		$('.callingProcessBlock #callingDisline').removeClass('scale-out');
			$('.callingProcessBlock #callingDisline').addClass('scale-in');

			$('.callingProcessBlock #callingAccept').removeClass('scale-out');
			$('.callingProcessBlock #callingAccept').addClass('scale-in');


			$('#callingAccept').attr('onclick', "client.acceptCall('"+msg['from']+"', true);");
			$('#callingDisline').attr('onclick', "client.callEnd('"+msg['from']+"', true);");





	});

	socket.socketCopy.on('typing', function(msg) {
		msg = JSON.parse(LZString.decompressFromUTF16(msg));
		console.log(msg);



		console.log($('#block' + msg['who'] + ' .animationDiv').show());


		if (msg['type'] == 1) {

			$('#block' + msg['who'] + ' .topPanelLastonline').hide();

			$('#block' + msg['who'] + ' .animationDiv').show();
		} else {
			$('#block' + msg['who'] + ' .topPanelLastonline').show();
		}
		$('#block' + msg['who'] + ' .animationDiv').hide();
	});

	function setKey(to, key) {
		socket.setKey(to, key);
		return true;
	}


	var getDialogs = function() {
		socket.getDialogs().then(function(r) {

			console.log(r);
			$('#prealoderDialogs').hide();
			if (r['msg'].length==0) {

				console.log('No dialogs');

				/*$('#noDialogs').show();*/
			}
			forEach(r['msg'], function(key, value) {
				var message;
				try {
					message = decryptMessage(value['message'], getKeyForUser(value['with']));
				} catch (e) {
				// todo
				//

				var key = generateEncryptKey();
				setKeyForUser(value['with'], key);
				setKey(value['with'], key);
					message = '<span style="color:#ce4242;">Ошибка</span>';
				}



				console.log(value);

				if (typeof message.split('_')[2] != 'undefined') message = message.split('_')[0];

				getFileSecter(value['image'], 'photo_128').then(function(url) {
					if (url == false) url = '/images/defaultprofileimage.jpg';

					tmpCache['s' + value['image']] = url;

					var styleVerify = '';
					if(value.is_offical==1) styleVerify = `<img src="images/verify_account.svg" class="userVerify" id='messagesVerify'>`;


					$(`<div class="dialog waves-effect waves-light" onclick="client.selectDialog('` + value['with'] + `')" id="message` + value['with'] + `">
  <p id="userName">` + value['name'] + " " + value['surname']+styleVerify + `</p>
   <p id="textMessage" class="truncate" style="
">` + message + `</p>
  <img src="` + url + `" id="profilePhoto"></img>
</div>`).appendTo('#leftPanelMessages');


				});



			});


		});
	}
this.exit = function(){
socket.exit();
deleteCookie('lastLogin');
deleteCookie('lastCrt');
window.location.reload();
};

this.onClickUserInfo = function(login){
	if($(window).width()>=1366){
		// показываем правый справедливый блок
	}
	else{
		// попап
	}
}

	this.selectDialog = function(login) {
		$('.dialog[data-issearch="true"]').remove();
		$('.dialog[data-issearch!="true"]').animate({left:'0px'}, 50);
$('.dialog[data-issearch!="true"]').show();
		$('.dialog').removeClass('selectedDialog');
		$('.dialog #userName').removeClass('selectedName');
		$('.dialog #textMessage').removeClass('selectedText');



		$('#message' + login).addClass('selectedDialog');


		$('#message' + login + ' #userName').addClass('selectedName');
		$('#message' + login + ' #textMessage').addClass('selectedText');



		if (isMobile) {


			win.closeMobileWindow($('#leftPanelMessages'), $('.rightBlock'));



		}



		// paste messageBlock
		$('.messagesBlock').hide();
		if ($('#block' + login).length != 0) {

			$('#block' + login).show();

		} else {



			socket.getOnline(login).then(function(r) {
				var online = r['msg'];

				console.log(online);
				var text;

				if (online['online'] == 0) {


					var lastOnline = online['lastOnline'];
					var timeNow = Math.floor(Date.now() / 1000);


					var difference = timeNow - lastOnline;

					console.log(difference);



					var days = Math.round(difference / 86400);
					if (lastOnline == 0) {
						text = '<p class="topPanelLastonline offline">Был в сети мамонт лет назад</p>';
					} else if (days <= 0) {

						var hours = Math.round(difference / 3600);

						if (hours <= 0) {


							var minutes = Math.round(difference / 60);
							if (minutes == 0) text = '<p class="topPanelLastonline offline">Был в сети недавно</p>';
							text = '<p class="topPanelLastonline offline">Был в сети ' + minutes + ' минут назад</p>';


						} else {

							text = '<p class="topPanelLastonline offline">Был в сети ' + hours + ' часов назад</p>';
						}

					} else if (days >= 14) {
						text = '<p class="topPanelLastonline offline">Был в сети давно</p>';
					} else {

						text = '<p class="topPanelLastonline offline">Был в сети ' + days + ' дней назад</p>';
					}



				} else text = '<p class="topPanelLastonline online">в сети</p>';



				$(`<div class="messagesBlock" id="block` + login + `">

  <div class="userInfoTopPanel z-depth-2">
  <div class='back z-depth-2'>
<a class="waves-effect waves-light btn whatDoWithMsgButton deleteMessageButton">УДАЛИТЬ</a>
<a class="waves-effect waves-light btn whatDoWithMsgButton editMessageButton" onclick="alert('Сейчас бы нативный алерт юзать =(')">КРЯКАТЬ</a>
  </div>
  	<i class="waves-effect waves-circle material-icons mobileBackButton backDialogs" onclick="client.openWindow.closeMobileWindow($('.rightBlock'), $('#leftPanelMessages'));">arrow_back</i>
    <img src="` + $('#message' + login + ' #profilePhoto').attr('src') + `" id="profilePhotoTopPanel" onclick="$('.photoWatcher').fadeIn(200);
$('.photoWatcher .closeIcon').css('transform', 'rotate(0deg)'); $('.photoWatcher .imageView').attr('src', '` + $('#message' + login + ' #profilePhoto').attr('src') + `');">
  <p id="topPanelName">` + $('#message' + login + ' #userName').text() + `</p>
  <div class='animationDiv'>
 <div class="animationSpan"></div>
 <div class="animationSpan"></div>
 <div class="animationSpan"></div>
  </div>
  ` + text + `

  <i class="material-icons callToUser" onclick='client.callToUser("`+login+`")'>&#xE0CD;</i>
  </div>


<ul class='messagesList'>



</ul>

<div class="messagesSendSection z-depth-1" style="
">

<i class="material-icons sendAttachmentButton" style="" onclick="$('.uploadFileInput').trigger('click'); console.log('Choose file');">attachment</i>


<div class="messageSendBlock" contenteditable="true" style="
"></div>

<i class="material-icons waves-effect z-depth-1 center-align valign-wrapper sendMsgButton" onclick="client.sendMessage($('#block` + login + ` .messageSendBlock').text(), '` + login + `')">send</i>
</div>

</div>`).prependTo('.rightBlock');

				$('#block' + login + ' .messageSendBlock').focus();
			});

		}


		$('#spinnerMessages').show();


		if ($('#block' + login + ' .messageFromMe ').length == 0 && $('#block' + login + ' .messageToMe ').length == 0) {

			socket.getMessages(login).then(function(r) {
				$('#spinnerMessages').hide();
				var messages = r['msg'];


				forEach(messages, function(key, value) {

					console.log(value);
					var whoIsWho = (getCookie('lastLogin') == value['from']) ? value['to'] : value['from'];

					try{
						var text = decryptMessage(value['message'], getKeyForUser(whoIsWho));
					}
					catch(e){

						return false;
					}



					var messageClass = (value['to'] == whoIsWho) ? 'messageFromMe' : 'messageToMe';

					messageParser(text, messageClass, value['id'], '').then(function(messageInfo) {


						$('#block' + whoIsWho + ' .messagesList').prepend(messageInfo['template']);

						console.log(messageClass);



					});



				});

				$('#block' + login).scrollTop(9999999999999999999999999999999999999);
				$('#spinnerMessages').hide();
			})

		} else $('#spinnerMessages').hide();



	};



	this.onUserSearch = function(val) {
		$('.dialog[data-issearch="true"]').remove();
		$('#prealoderDialogs').show();

		socket.searchUser(val).then(function(r) {
			var resp = r['msg'];
			$('#prealoderDialogs').hide();
			forEach(resp, function(key, value) {


				if (!isEmpty(tmpCache['s' + value['image']])) {

					$(`<div data-issearch='true' class="dialog dialogFake waves-effect waves-light" onclick="client.selectDialog('` + value['login'] + `')" id="message` + value['login'] + `">
  <p id="userName">` + value['name'] + " " + value['surname'] + `</p>
  <img style="    top: -48px;
" src="` + tmpCache['s' + value['image']] + `" id="profilePhoto"></img>
</div>`).appendTo('#leftPanelMessages');



				} else {

					getFileSecter(value['image'], 'photo_128').then(function(url) {


						tmpCache['s' + value['image']] = url;


						$(`<div data-issearch='true' class="dialog dialogFake waves-effect waves-light" onclick="client.selectDialog('` + value['login'] + `')" id="message` + value['login'] + `">
  <p id="userName">` + value['name'] + " " + value['surname'] + `</p>
  <img style="    top: -48px;
" src="` + url + `" id="profilePhoto"></img>
</div>`).appendTo('#leftPanelMessages');

					});
				}


				/*    tmpCache[value['image']] = url;
				              $(`<div class="dialog waves-effect waves-light" onclick="client.selectDialog('`+value['with']+`')" id="message`+value['with']+`">
				  <p id="userName">`+value['name']+" " + value['surname'] +`</p>
				   <p id="textMessage" class="truncate" style="
				">`+message+`</p>
				  <img src="`+url+`" id="profilePhoto"></img>
				</div>`).appendTo('#leftPanelMessages');*/



			});

		});



	}


	this.hideMessagesParams = function(){
		setTimeout(function() {
			$('div .userInfoTopPanel .back').hide();
		}, 250);
		$('div .userInfoTopPanel').css('transform', 'rotateX(0deg)');
	}



	this.showMessagesParams = function(id){
		if(isMessageSelected==true){
			isMessageSelected = false;
					setTimeout(function() {
			$('div .userInfoTopPanel .back').hide();
		}, 250);
		$('div .userInfoTopPanel').css('transform', 'rotateX(0deg)');
			return false;
		}
		isMessageSelected = true;
		setTimeout(function() {
			$('div .userInfoTopPanel .back').show();
		}, 250);
		$('div .userInfoTopPanel').css('transform', 'rotateX(180deg)');


		var object = getObjectMessageID(id);

		if(object.hasClass('messageFromMe')){
			$('.deleteMessageButton').show();
			$('.editMessageButton').show();
		}
		else{
			$('.deleteMessageButton').hide();
			$('.editMessageButton').hide();
		}
		$('.deleteMessageButton').attr('onclick', 'client.deleteMessage("'+object.attr('id').replace('messageID', '')+'")');
	}




	this.registration = function(email, login, name, surname) {



		$('#blockAuth #subText').show();
		$('#blockAuth #progressAuth').show();



		socket.registration(email, login, name, surname).then(function(r) {


			$('#blockAuth #subText').hide();
			$('#blockAuth #progressAuth').hide();

			console.log(r);


			if (r['error_code'] == ERROR_PARAMS_EMPTY_CODE) {
				$('#myNameInput').addClass('invalid');
				$('#mySurnameInput').addClass('invalid');
				$('#myEmailInput').addClass('invalid');
				$('#myLoginRegInput').addClass('invalid');
			} else if (r['error_code'] == ERROR_USERS_EXITS) {
				$('#myLoginRegInput').addClass('invalid');

				win.openWindowText('', {
					title: 'Логин занят',
					text: 'Данный логин занят.'
				});

			} else if (r['code'] == SUCCESSFUL_REGISTER) {
				$('#registrationS').hide();
				$('#needRegcodeSection').fadeIn(300);
			}


		})


	};


	this.enterCode = function(login, code) {

		$('#blockAuth #subText').show();
		$('#blockAuth #progressAuth').show();


		socket.enterCode(login, code).then(function(r) {


			$('#blockAuth #subText').hide();
			$('#blockAuth #progressAuth').hide();

			console.log(r);


			if (r['error_code'] == ERROR_PARAMS_EMPTY_CODE) {
				$('#myRegcodeInput').addClass('invalid');
			} else if (r['error_code'] == ERROR_AUTHCODE_ISNT_VALID) {
				$('#myRegcodeInput').addClass('invalid');
				win.openWindowText('', {
					title: 'Неверный код',
					text: 'Данный код авторизации неверен.'
				});

			} else if (r['code'] == SUCCESSFUL_AUTH) {
				// auth!
				onAuth(login, r['msg']['crt'])
			}


		})


	}

	this.authAccount = function(login) {

		$('#blockAuth #subText').show();
		$('#blockAuth #progressAuth').show();



		socket.authAccount(login).then(function(r) {


			$('#blockAuth #subText').hide();
			$('#blockAuth #progressAuth').hide();

			console.log(r);


			if (r['error_code'] == ERROR_PARAMS_EMPTY_CODE) {
				$('#myLoginInput').addClass('invalid');
			} else if (r['error_code'] == ERROR_FAILDED_AUTH) {


				$('#firstAuthSection').hide();
				$('#registrationS').fadeIn(300);
				$('#myLoginRegInput').focus();
				$('#myLoginRegInput').val(login);
			} else if (r['code'] == SUCCESSFUL_AUTH_BUT_NEED_VALIDATION) {
				$('#firstAuthSection').hide();
				$('#needAuthcodeSection').fadeIn(300);
			}


		})
	}


	this.authByCrt = function(login, crt) {


		socket.authByCrt(login, crt).then(function(r) {



			console.log(r);



			if (r['code'] == 10) {
			onAuth(login, r['msg']['crt']);
			}


		});


	};

	this.onResize = function() {

		isMobile = $(window).width() <= 480;
		if ($(window).width() > 480) {
			var widthBlock = $(window).width() - 265;


			$('#leftPanelMessages').css('left', '0px');

			$('.rightBlock').width(widthBlock);
			$('.rightBlock').css('left', '265px');

		} else {
			$('.rightBlock').width($(window).width());

			$('.rightBlock').css('left', '0px');

		}
	};


	this.callToUser = function(login){

		$('.animationCalling').show();
		$('#mask').show();
		isCalling=true;
		$('#meCallToFriend').show();
		$('#friendCallToMe').hide();
		$('.callingProcessBlock').removeClass('scale-out');

		$('.callingProcessBlock').addClass('scale-in');


		$('#callingEnd').attr('onclick', "client.callEnd('"+login+"', true);");


		if(!isEmpty($('#message' + login + ' #userName').text())) $('.callingProcessBlock .userInfoCall').text($('#message' + login + ' #userName').text());




		if(!isEmpty($('#message' + login + ' #profilePhoto').attr('src'))) $('.callingProcessBlock #userImageCalling').attr('src', $('#message' + login + ' #profilePhoto').attr('src'));
		else{

			$('.cirleLoadUserImageCall').show();

			socket.fastInfo(login).then(function(z){

				$('.callingProcessBlock .userInfoCall').text(z['msg']['name'] + ' ' + z['msg']['surname']);

				getFileSecter(z['msg']['image'], 'photo_450').then(function(photo) { // load photo

					$('.cirleLoadUserImageCall').hide();

					$('.cirleLoadUserImageCall').circleProgress('value', 50);


						if (photo == false) photo = '/images/defaultprofileimage.jpg';
						if(photo=='defaultImage') photo = '/images/defaultprofileimage.jpg';



						$('.callingProcessBlock #userImageCalling').attr('src', photo);

						tmpCache['m' + z['msg']['image']] = photo;

					});




			});
			/**/
		}

		$('#userImageCalling').attr('src', $('#message' + login + ' #profilePhoto').attr('src'));
		$('.callingProcessBlock .userInfoCall').text($('#message' + login + ' #userName').text());


			socket.callUser(login).then(function(r){

				if(r['error_code']==502){
					win.openWindowText('', {
					title: login + ' не в сети',
					text: "Пользователь " + login + ' сейчас не в сети'
				});
					endCall(login);
				}
				if(r['error_code']==403){
					win.openWindowText('', {
					title: 'Вы не можете позвонить самому себе',
					text: "К сожалению, вы не можете позвонить себе."
				});
					endCall(login);
				}
				if(r['error_code']==500){
					win.openWindowText('', {
					title: login + ' сейчас разговаривает',
					text: "Пользователь " + login + ' сейчас разговаривает с другим'
				});
					endCall(login);
				}
			});



			$('.callingProcessBlock #callingEnd').removeClass('scale-out');
			$('.callingProcessBlock #callingEnd').addClass('scale-in');
			$('.callingProcessBlock #callingEnd').css('animation', 'shake 300ms infinite');






	}


	var endCall = function(login, sendRequest){

		blobsCalling = [];
		callingMs=0;
		if(typeof voice=='object') voice.stop();

		$('.animationCalling').hide();

		$('.callingProcessBlock #callingEnd').removeClass('scale-in');
			$('.callingProcessBlock #callingEnd').addClass('scale-out');
				$('.callingProcessBlock').show();
	$('#mask').hide();
	$('.callingProcessBlock').removeClass('scale-in');
		$('.callingProcessBlock').addClass('scale-out');


		$('.callingTime').removeClass('scale-in');
			$('.callingTime').addClass('scale-out');


		if(sendRequest){
			// send reqeust
			//
			socket.callEnd(login);
		}


	}

	this.callEnd = endCall;

	this.acceptCall = function(login){
		console.log('accept call');

		socket.callAccept(login).then(function(r){

			startRecord(function(result){
				socket.callSay(login, result);
			});

			// for callAccept
			$('#meCallToFriend').show();
			$('#friendCallToMe').hide();
			$('.callingProcessBlock #callingEnd').removeClass('scale-out');
			$('.callingProcessBlock #callingEnd').addClass('scale-in');
			$('.callingProcessBlock #callingEnd').css('animation', null);
			$('.animationCalling').hide();



			callingStartTimestamp = Math.floor(Date.now()/1000);


			clearInterval(callingInterval);

		callingInterval = setInterval(function() {

			console.log(Math.floor(Date.now()/1000)-callingStartTimestamp);

			var callingTime = new Date(Math.floor(Date.now()/1000)-callingStartTimestamp);

			$('.callingTime').text(callingTime.getMinutes() + ':' + callingTime.getSeconds());

		}, 1000);
			$('.callingTime').removeClass('scale-out');
			$('.callingTime').addClass('scale-in');
			console.log(r);
		});
	}
	var encryptMessage = function(text, key) {
		var textBytes = aesjs.utils.utf8.toBytes(text);
		key = aesjs.utils.hex.toBytes(key);
		var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
		var encryptedBytes = aesCtr.encrypt(textBytes);
		var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
		return encryptedHex;


	};

	var decryptMessage = function(text, key) {
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




	var startRecord = function(cb){
navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false
  }).then(function(stream) {
     var audioContext = new window.AudioContext()
    var mediaStreamSource = audioContext.createMediaStreamSource(stream)
    var mediaStreamDestination = audioContext.createMediaStreamDestination()
    mediaStreamSource.connect(mediaStreamDestination)










  });

	}

	this.startRecordP=startRecord;

	this.onContactsAdding = function(mail, howWrite) {

		if (isEmpty(howWrite)) {

			$('#nameContacts').addClass('invalid');
			return false;
		} else if (isEmpty(mail)) {
			$('#emailContacts').addClass('invalid');

			return false;
		}


		socket.contactsAdd(mail, howWrite).then(function(r) {
			console.log(r);
			if (r['error_code'] == 401) {
				win.openWindowText('', {
					title: 'Ошибка',
					text: 'Данный пользователь еще не зарегестрирован или почта неверна.'
				});
			} else if (r['error_code'] == 400) {
				win.openWindowText('', {
					title: 'Ошибка',
					text: 'Контакт уже в вашем контакт-листе'
				});
			} else if (r['error_code'] == 403) {
				win.openWindowText('', {
					title: 'Ошибка',
					text: 'Вы не можете добавить самого себя в конакты'
				});
			} else {

				$('.addContact').fadeOut(25);
				$('#mask').css('z-index', '');
				$('#emailContacts').addClass('valid');
				$('#nameContacts').addClass('valid');

				$('#emailContacts').val('');
				$('#nameContacts').val('');
				$('#contactsEmpty').hide();
				var date = new Date(Math.floor(Date.now() / 10000));
				if (!isEmpty(tmpCache['s' + r['msg']['image']])) {

					console.log('from cache');
					$(` <div class="userBlock waves-effect" data-login="` + r['msg']['login'] + `">
    <img src="` + tmpCache['s' + r['msg']['image']] + `" class="userImage">
    <p class="userName truncate">` + howWrite + `</p>
    <p class="whenWasAdded truncate">`+r['msg']['mail']+`</p>
  </div>`).prependTo('.contentContacts');
				} else {
					getFileSecter(r['msg']['image'], 'photo_128').then(function(url) {

						if (url == false) url = '/images/defaultprofileimage.jpg';


						$(` <div class="userBlock waves-effect" data-login="` + r['msg']['login'] + `">
    <img src="` + url + `" class="userImage">
    <p class="userName truncate">` + howWrite + `</p>
    <p class="whenWasAdded truncate">`+r['msg']['mail']+`</p>
  </div>`).prependTo('.contentContacts');

					});

				}


			}

		});
	};
	var sendMessageProtected = function(message, to, fileInfo) {

		$('#block' + to + ' .messageSendBlock').text('');



		var key = getKeyForUser(to);
		if (key == undefined) {
			key = generateEncryptKey();
			setKeyForUser(to, key);



			setKey(to, key);

		}
		var messageRaw = message;


		message = encryptMessage(message, key);
		var randomID = generateEncryptKey();
		// NOTE
		messageParser(messageRaw, 'messageFromMe', randomID, `<i class="material-icons statusSendMessage">access_time</i>`).then(function(messageInfo) {
			console.log(messageInfo);


			if (to != getCookie('lastLogin')) {






				$('#block' + to + ' .messagesList').append(messageInfo['template']);

				$('#message' + to).prependTo('#leftPanelMessages');



				$('#message' + to + ' #textMessage').text(messageInfo['dialogsText']);

				$('#block' + to).scrollTop(9999999999999999999999999999999999999);



			}
			socket.sendMessage(message, to).then(function(r) {

				if ($('#message' + to).length == 0) {



					dialogCreate(r.msg, messageInfo['dialogsText']);
				}

				console.log(r);
				$('#messageID' + randomID + ' .statusSendMessage').text('check');
				$('#messageID' + randomID).attr('oldid', randomID);
				$('#messageID' + randomID).attr('id', 'messageID' + r['msg']['id']);
				console.log('set ID' + 'messageID' + r['msg']['id']);

			});



		});



	};


	this.sendMessage = function(message, to) {
		if(isEmpty(message) || message == '') return false;

		$('#block' + to + ' .messageSendBlock').text('');
		var key = getKeyForUser(to);
		if (key == undefined) {
			key = generateEncryptKey();
			setKeyForUser(to, key);



			setKey(to, key);

		}
		var messageRaw = message;


		message = encryptMessage(message, key);
		var randomID = generateEncryptKey();
		// NOTE
		messageParser(messageRaw, 'messageFromMe', randomID, `<i class="material-icons statusSendMessage">access_time</i>`).then(function(messageInfo) {
			console.log(messageInfo);


			if (to != getCookie('lastLogin')) {





				$('#block' + to + ' .messagesList').append(messageInfo['template']);

				$('#message' + to).prependTo('#leftPanelMessages');



				$('#message' + to + ' #textMessage').text(messageInfo['dialogsText']);

				$('#block' + to).scrollTop(9999999999999999999999999999999999999);


			}
			socket.sendMessage(message, to).then(function(r) {
				console.log(r);
				if ($('#message' + to).length == 0) {



					dialogCreate(r.msg, messageInfo['dialogsText']);
				}
				$('#messageID' + randomID + ' .statusSendMessage').text('check');
				$('#messageID' + randomID).attr('oldID', randomID);
				$('#messageID' + randomID).attr('id', 'messageID'+r['msg']['id']);


			});



		});
	};


	function toHexString(byteArray) {
		return Array.from(byteArray, function(byte) {
			return ('0' + (byte & 0xFF).toString(16)).slice(-2);
		}).join('')
	}


	var getKeyForUser = function(id) {
		var keys = localStorage.getItem('keys');


		if (keys == undefined || keys == "null") return undefined;


		keys = JSON.parse(keys);


		return keys[id];
	};

	var setKeyForUser = function(id, key) {

		var keys = localStorage.getItem('keys');
		if (keys == undefined || keys == "null") keys = {};
		else keys = JSON.parse(keys);


		keys[id] = key;

		localStorage.setItem('keys', JSON.stringify(keys));


	}



	var generateEncryptKey = function() {
		var key = Array();

		for (var i = 0; i < 33; i++) {
			if (key.length == 32) {
				return toHexString(new Uint8Array(key));

			}


			key.push(Math.floor(Math.random() * 256));
		}


	}



	this.validateAccount = function(login, code) {

		$('#blockAuth #subText').show();
		$('#blockAuth #progressAuth').show();



		socket.validateAccount(login, code).then(function(r) {

			$('#blockAuth #subText').hide();
			$('#blockAuth #progressAuthCode').hide();


			console.log(r);


			if (r['error_code'] == ERROR_PARAMS_EMPTY_CODE) {
				$('#myAuthcodeInput').addClass('invalid');
			} else if (r['code'] == 6) {
				// auth!!
				onAuth(login, r['msg']['crt']);

			} else if (r['error_code'] == 4) {

				win.openWindowText('', {
					title: 'Неверный код',
					text: 'Данный код регистрации неверен.'
				});



			}

		});
	};



	$('#cancelButton').on('click', function() {
		console.log('closeWindow');
		win.closeWindows();
	});


	$('#agreeButton').on('click', function() {
		console.log('closeWindow');
		win.closeWindows();
	});



	var getObjectMessageID = function(id){

		console.log('ID :  '+ id);
		var objectID = $('#messageID'+id);
					if ($("li[oldid='" + id + "']").length != 0) {
						console.log('&c OLD ID IS DELEETE');
						objectID = $("li[oldid='" + id + "']").attr('id');


					}

					return objectID;
	};

	this.GetObjectMessageID=getObjectMessageID;

	function createBlobFromSource(b64Data, contentType, sliceSize) {
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

		var blob = new Blob(byteArrays, {
			type: contentType
		});

		var blobUrl = URL.createObjectURL(blob);

		return blobUrl;
	}



	var getFileSecter = function(id, field, cb) {
		return new Promise(function(resolve, reject) {



			var xhr = new XMLHttpRequest();
		xhr.open("get", '/getAttachment/' + id + '/' + field, true);
		xhr.send();



		xhr.upload.onprogress = function(event) {

			var percentComplete = event.loaded / event.total;


			cb(percentComplete);
		}



			xhr.onload = xhr.onerror = function() {
			if (this.status == 200) {
				// this.responseText
				var r = this.responseText;

					try {
					r = JSON.parse(r);



				} catch (e) {

					resolve(false);
					return false;

				}
				try {
					var blob = createBlobFromSource(r['data'], r['mime']);
				} catch (e) {
					resolve(false);
					return false;
				}
				resolve(blob);

			} else {
				console.log("error " + this.status);
			}
		};











		});



	}


	this.getFile = function(id, field, cb) {
		return new Promise(function(resolve, reject) {



			var xhr = new XMLHttpRequest();
		xhr.open("get", '/getAttachment/' + id + '/' + field, true);
		xhr.send();



		xhr.upload.onprogress = function(event) {

			var percentComplete = event.loaded / event.total;


			cb(percentComplete);
		}



			xhr.onload = xhr.onerror = function() {
			if (this.status == 200) {
				// this.responseText
				var r = this.responseText;

					try {
					r = JSON.parse(r);



				} catch (e) {

					resolve(false);
					return false;

				}
				try {
					var blob = createBlobFromSource(r['data'], r['mime']);
				} catch (e) {
					resolve(false);
					return false;
				}
				resolve(blob);

			} else {
				console.log("error " + this.status);
			}
		};











		});



	}

	// Helpers Function //



	async function dialogCreate (msg, dialogText){
			getFileSecter(msg['image'], 'photo_128').then(function(url) {


						tmpCache['s' + msg['image']] = url;
						if (url == false) url = '/images/defaultprofileimage.jpg';









						$(`<div class="dialog waves-effect waves-light" onclick="client.selectDialog('` + msg['from'] + `')" id="message` + msg['from'] + `">
  <p id="userName">` + msg['name'] + " " + msg['surname'] + `</p>
   <p id="textMessage" class="truncate" style="
">` + dialogText + `</p>
  <img src="` + url + `" id="profilePhoto"></img>
</div>`).prependTo('#leftPanelMessages');


					});
	}

this.puDialogCreate = dialogCreate;


	// END
	var uploadFile = function(file, isProfileImage, token, to, fileInfo, cb) {



		var fd = new FormData();
		fd.append('file', file);
		var xhr = new XMLHttpRequest();
		$('#mask').show(50);
		$('.fileUploadingInfo').show();


		$('.fileUploadingInfo .filePreview').attr('src', fileInfo['blob']);
		$('.fileUploadingInfo .fileName').text(fileInfo['name']);



		// обработчик для закачки
		xhr.upload.onprogress = function(event) {

			var percentComplete = event.loaded / event.total;

			$('.fileUploadingInfo .bytesLoading #loading').text((event.loaded / 1024 / 1024).toString().substr(0, 4) + 'мб');
			$('.fileUploadingInfo .bytesLoading #total').text((event.total / 1024 / 1024).toString().substr(0, 4) + 'мб');
			$('.fileUploadingInfo .loadProgress .determinate').css('width', percentComplete * 100 + '%');
			console.log(percentComplete);
		}

		// обработчики успеха и ошибки
		// если status == 200, то это успех, иначе ошибка
		xhr.onload = xhr.onerror = function() {
			if (this.status == 200) {

				$('.fileUploadingInfo .loadProgress .determinate').css('width', '100%');
				$('.fileUploadingInfo').fadeOut(250);
				$('#mask').hide();
				var info = JSON.parse(this.responseText);

				console.log(info);

				cb(info, to, fileInfo);
			} else {
				console.log("error " + this.status);
			}
		};

		xhr.open("POST", "/uploadImage/" + token + "/" + isProfileImage, true);
		xhr.send(fd);



	}

	var uploadImageProfile = function(file, token, cb) {

		$('.cirleLoadImage').show();

		var fd = new FormData();
		fd.append('file', file);
		var xhr = new XMLHttpRequest();

		var blob = URL.createObjectURL(file);
		$('#infoPanelImage').attr('src', blob);
		$('#myProfilePhoto').attr('src', blob);

		$('#myProfilePhoto').css('-webkit-filter', 'blur(1px) brightness(0.5)');
		$('#myProfilePhoto').css('-moz-filter', 'blur(1px) brightness(0.5)');

		// обработчик для закачки
		xhr.upload.onprogress = function(event) {

			var percentComplete = event.loaded / event.total;

			$('.cirleLoadImage').circleProgress('value', percentComplete);
			console.log(percentComplete);
		}

		// обработчики успеха и ошибки
		// если status == 200, то это успех, иначе ошибка
		xhr.onload = xhr.onerror = function() {
			if (this.status == 200) {



				cb(blob);
			} else {
				console.log("error " + this.status);
			}
		};

		xhr.open("POST", "/uploadImage/" + token + "/1", true);
		xhr.send(fd);


	};
	this.onClickContacts = function() {

		$('.contentContacts').html(null);
		socket.contactsGet().then((r) => {

			$('#prealoderContacts').hide();
			$('#contactsEmpty').hide();
			if(typeof r['msg'][0] =='undefined') $('#contactsEmpty').show();
			forEach(r['msg'], function(key, value) {
				console.log(value);
				var date = new Date(Math.floor(value['date'] * 1000));


				if (!isEmpty(tmpCache['s' + value['image']])) {

					console.log('from cache');
					$(` <div class="userBlock waves-effect" data-login="` + value['loginUser'] + `">
    <img src="` + tmpCache['s' + value['image']] + `" class="userImage">
    <p class="userName truncate">` + value['name'] + ' ' + value['surname'] + `</p>
    <p class="whenWasAdded truncate">`+value['mail']+`</p>
  </div>`).prependTo('.contentContacts');
				} else {
					getFileSecter(value['image'], 'photo_128').then(function(url) {
						if (url == false) url = '/images/defaultprofileimage.jpg';
						$(` <div class="userBlock waves-effect" data-login="` + value['loginUser'] + `">
    <img src="` + url + `" class="userImage">
    <p class="userName truncate">` + value['name'] + ' ' + value['surname'] + `</p>
    <p class="whenWasAdded truncate">`+value['mail']+`</p>
  </div>`).prependTo('.contentContacts');

					});

				}


			});
		});
	}
	this.onLoadProfilePhoto = function(files) {

		console.log('call');
		var file = files[0];

		socket.getLinkAttachments().then(function(r) {
			var link = r['msg'];

			console.log('link : ' + link);


			uploadImageProfile(file, link, function(blob) {
				$('.cirleLoadImage').hide();

				$('#myProfilePhoto').css('-webkit-filter', '');
				$('#myProfilePhoto').css('-moz-filter', '');
			})



		});


	};
	this.onLoadAttachment = function(files) {
		if(isEmpty($('.selectedDialog').attr('id'))) return false;
		var to = $('.selectedDialog').attr('id').replace('message', '');


		$.each(files, function(key, value) {

			var fileInfo = {};

			var loadBlob = URL.createObjectURL(value);

			fileInfo['blob'] = loadBlob;
			fileInfo['name'] = value.name;
			fileInfo['type'] = value.type.split('/')[0];



			if (fileInfo['type'] != 'video' && fileInfo['type'] != 'image' && fileInfo['type'] != 'audio') fileInfo['type'] = 'document';



			console.log(fileInfo);
			console.log('Load file...');



			socket.getLinkAttachments().then(function(r) {
				var link = r['msg'];

				console.log('link : ' + link);



				uploadFile(value, 0, link, to, fileInfo, function(info, to, fileInfo) {
					tmpCache['b'+info['id']] = fileInfo['blob'];
					tmpCache[info['id']] = fileInfo['blob'];
					sendMessageProtected(info['type'] + '_' + info['id'] + '_' + info['name'], to, fileInfo);
				});



			});


		});



	}

	this.deleteMessage = function(id){


	var objectID = getObjectMessageID(id);



	objectID.hide();
		socket.deleteMessage(id).then(function(r){
			console.log(r);
			if(r['code']!=702){
					objectID.show();
					win.openWindowText('', {
					title: 'Срок удаления истек',
					text: 'Вы не можете удалить сообщение, так как его срок удаления истек'
				});
			}
			else objectID.remove();

		});

		$('div .userInfoTopPanel .back').hide();
		isMessageSelected=false;
		$('div .userInfoTopPanel').css('transform', 'rotateX(0deg)');
	};


	var messageParser = function(text, messageClass, id, att) {
		/*	var obj = {text:text, is_attachment:0, attachment:['document', 'ducks.jpg', 'id']};
			return obj;*/

		text = replaceURLWithHTMLLinks(escapeHtml(text));

		return new Promise(function(resolve, reject) {

			var template;
			var infoText = text.split('_');
			var dialogsText;


			if (typeof infoText[2] == 'undefined') {
				template = `<li class='` + messageClass + `' ondblclick='client.showMessagesParams("`+id+`");' id='messageID` + id + `'>` + text + att + `</li>`;
				dialogsText = text;

				resolve({
					template: template,
					dialogsText: dialogsText
				});
			} else {



				switch (infoText[0]) {
					case 'image':
						template = `<li ondblclick='client.showMessagesParams("`+id+`");' class='` + messageClass + `' id='messageID` + id + `'><div class="cirleLoadImageMsg"></div> <img src='/images/photoPreview.png' width='320px' height='320px' class='dialogsImageSend'>` + att + `</li>`;

						$('#messageID' +id+ ' .cirleLoadImageMsg').circleProgress({
    value: 0.0,
    size: 60,
    emptyFill: "rgba(0, 0, 0, 0)",
    fill: {
      color: "#b7b7b7"
    }
  });

						$('#messageID' +id+ ' .cirleLoadImageMsg').show();


						dialogsText = 'фотография';
						break;
					case 'video':
						dialogsText = 'видео';
						break;
					case 'audio':
						dialogsText = 'аудио';



						template = `<li ondblclick='client.showMessagesParams("`+id+`");' class='` + messageClass + `' id='messageID` + id + `'>			<div class="audioMessage" style="
    width: 280px;
    height: 42px;
">


<div class="playOrStopButton" onclick="
if($(this).children().text() == 'play_arrow'){
$(this).children().text('pause');
console.log(window.audio);
window.audio.playAudio();
}

else{
	window.audio.stopAudio();
$(this).children().text('play_arrow');
}
"><i class="material-icons" style="
    color: #757575;
    font-size: 41px;
    position: relative;
    margin-top: 0px;
    margin-left: -0.5px;
">play_arrow</i>
</div>

    <p class="audioName truncate">`+infoText[2]+`</p>
<div class="audioTime">
    <div class="audioFullTime" style="
    width: 50%;
    height: 3px;
    background: #e4e4e4;
    transition: 300ms;
"></div>
</div>
</div>` + att + `</li>`;


						break;

					case 'document':
						dialogsText = 'документ';
						break;

				}


					var objectID = '#'+ getObjectMessageID(id).attr('id');

					console.log('ID : ' + objectID)


				getFileSecter(infoText[1], 'photo_450', function(percent){
					console.log('PERCENT : ' + percent);
					if(infoText[0] == 'image'){

						$(objectID + ' .cirleLoadImageMsg').circleProgress('value', percent);

					}

				}).then(function(url) {

					console.log('ID : ' + objectID);
					console.log('LOAD!!!');
					tmpCache['m'+infoText[1]] = url;
					tmpCache[infoText[1]] = url;
					console.log(url);


					/*"$('.photoWatcher').fadeIn(200);
$('.photoWatcher .closeIcon').css('transform', 'rotate(0deg)'); $('.photoWatcher .imageView').attr('src', '`+url+`');"*/





					if (infoText[0] == 'image') {

						$( objectID + ' .cirleLoadImageMsg').hide();


						console.log('Image : ');
						objectID = '#' + getObjectMessageID(id).attr('id');
						console.log(objectID)
						$(objectID + ' img').attr('src', url);
						$(objectID + ' img').attr('width', undefined);
						$(objectID + ' img').attr('height', undefined);
						$(objectID + ' img').attr('onclick', "client.openPhotoShower('" + infoText[1] + "')");
					} else if (infoText[0] == 'audio') {
						window.audio = new AudioPlayer(url);
					}

				});

				resolve({
					template: template,
					dialogsText: dialogsText
				});



			}



		});



	}

$('.callReturnButton').on('click', function(){
	$('.callingProcessBlock').show();
	$('#mask').show();
	$('.callingProcessBlock').removeClass('scale-out');
		$('.callingProcessBlock').addClass('scale-in');

		$('.callReturnButton').addClass('scale-out');
		$('.callReturnButton').removeClass('scale-in');



$('.callingProcessBlock').animate({width:'270px', height:'400px', borderRadius:'15px', margin:'-200px 0 0 -135px'}, function(){

});
});

$('#mask').on('click', function(){
	console.log('has class : ' + $('.callingProcessBlock').hasClass('scale-in'));
		if ($('.callingProcessBlock').hasClass('scale-in')) {
			console.log('call');
			$('.callingProcessBlock').addClass('scale-out');
			$('.callingProcessBlock').removeClass('scale-in');
				$('.callingProcessBlock').hide();
					console.log(" SHOW BLOCK?!");
				$('.callReturnButton').removeClass('scale-out');
		$('.callReturnButton').addClass('scale-in');

		$('.callReturnButton').addClass('pulse');


		} else $('.popUpDialog').hide();


  $('#mask').css('z-index', '')
  $('#mask').hide();
   $('.btn-floating').removeClass('scale-in');
  $('.btn-floating').addClass('scale-out');





  			$('.callingProcessBlock #callingEnd').removeClass('scale-out');
			$('.callingProcessBlock #callingEnd').addClass('scale-in');



    $('.popUpDialogInfo').hide();



});

// utils function


	var generateRandomBackground = function() {
		return 'rgb(' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ', ' + Math.round(Math.random() * 255) + ')';
	}












	// admin function


	// end

	this.openPhotoShower = function(id) {

		$('.photoWatcher').fadeIn(50);
		$('.photoWatcher .imageView').hide();
		$('.photoWatcher .imageView').attr('src', '');
		$('.photoWatcher .progress').show();

		$('.photoWatcher .closeIcon').css('transform', 'rotate(0deg)');

		if (!isEmpty(tmpCache['b' + id])) {
			$('.photoWatcher .imageView').fadeIn(400);
			$('.photoWatcher .progress').hide();
			$('.photoWatcher .imageView').attr('src', tmpCache['b' + id]);
		} else {

			getFileSecter(id, 'photo_original').then(function(url) {



				tmpCache['b' + id] = url;


				$('.photoWatcher .imageView').fadeIn(400);
				$('.photoWatcher .progress').hide();
				$('.photoWatcher .imageView').attr('src', url);
			});



		}



	}

	// Loops...

	setInterval(function() {
		// get online loop

		if (document.hidden == true) return false; // quack?
		if ($('.selectedDialog').attr('id') != undefined) {
			console.log('Is online?');



			var login = $('.selectedDialog').attr('id').replace('message', ''); // selected dialog



			socket.getOnline(login).then(function(r) {
				var online = r['msg'];

				console.log(online);
				var text;

				if (online['online'] == 0) {


					var lastOnline = online['lastOnline'];
					var timeNow = Math.floor(Date.now() / 1000);


					var difference = timeNow - lastOnline;

					console.log(difference);



					var days = Math.round(difference / 86400);
					if (lastOnline == 0) {
						text = 'Был в сети мамонт лет назад';
					} else if (days <= 0) {

						var hours = Math.round(difference / 3600);

						if (hours <= 0) {


							var minutes = Math.round(difference / 60);
							if (minutes == 0) text = 'Был в сети недавно';
							text = 'Был в сети ' + minutes + ' минут назад';


						} else {

							text = 'Был в сети ' + hours + ' часов назад';
						}

					} else if (days >= 14) {
						text = 'Был в сети давно';
					} else {

						text = 'Был в сети ' + days + ' дней назад';
					}



					$('#block' + login + ' .topPanelLastonline').addClass('offline');
					$('#block' + login + ' .topPanelLastonline').removeClass('online');



				} else {
					$('#block' + login + ' .topPanelLastonline').removeClass('offline');
					$('#block' + login + ' .topPanelLastonline').addClass('online');
					text = 'в сети';


				}

				$('#block' + login + ' .topPanelLastonline').text(text);



			});
			if (!$('#block' + login + ' .animationDiv').is(':hidden')) return false;



			$('#block' + login + ' .topPanelLastonline').show();

		}



	}, 4000);



	setInterval(function() {
		if (document.hidden == true || getCookie('lastLogin') == undefined) return false; // quack?
		console.log('Set online');
		socket.setOnline();


	}, 10000);




	document.addEventListener('click', function(e){
		var obj = $(e.toElement);
		if(obj.attr('id')=='actionMenuMessages' || obj.parent().attr('id')=='actionMenuMessages') return false;
		$('#actionMenuMessages').hide();
	});

	 document.addEventListener( "contextmenu", function(e) {
	 	  var obj = $(e.toElement);
   try{
   	var id = parseInt(obj.attr('id').replace('messageID', ''));
   }
   catch(e){

   }



	 	$('#actionMenuMessages').hide();
	 	$('#actionMenuMessages').css({width:'130px', height:'140px'});





   if(isNaN(id)){

   	$('#actionMenuMessages').hide();
   	return false;
   }
   $('#actionMenuMessages').fadeIn(200);
   	 	$('#actionMenuMessages').css({width:'210px', height:'220px'});

   $('#actionMenuMessages').css({left:e.clientX, top:e.clientY});
   console.log(e);

   e.preventDefault();

  });


 function onAuth (login, crt){
	$('.bottomGrayColor').hide();
				$('#blockAuth').remove();
				getDialogs()
				$('.row').fadeIn(250);


				$('#infoPanelLogin').text(login);

				socket.fastInfo(login).then(function(info) {
					$('#infoPanelName').text(info['msg']['name'] + ' ' + info['msg']['surname']);


					getFileSecter(info['msg']['image'], 'photo_128').then(function(photo) { // load photo
						if (photo == false) url = '/images/defaultprofileimage.jpg';
						$('#infoPanelImage').attr('src', photo);

					});

				});


				$('#blockAuth').fadeOut(200);

				setCookie('lastLogin', login);
				setCookie('lastCrt', crt);
}


}



function AudioPlayer(tAudio) {
	// У тебя у курносой
	var audio = new Audio(tAudio);
	this.duration = audio.duration;

	var interval;
	// Маршрут один

	this.stopAudio = function() {
		audio.pause();
	}; // stop auto!

	this.playAudio = function() {
		audio.play();
	};



	this.subsribeToUpdate = function(cb) {
		// cb is callback
		clearInterval(interval);


		interval = setInterval(function() {
			cb(audio.currentTime);
		}, 1000);


	};

};
