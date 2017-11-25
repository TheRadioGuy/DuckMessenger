function Client(serverCommunitation) {



	var blobsCaches = {};
	var win = new modulesWindow();
	var socket = serverCommunitation;



	var audios = {};
	var tmpCache = {};
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
		msg = JSON.parse(LZString.decompressFromUTF16(msg))['msg'];
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
				socket.fastInfo(msg['from']).then(function(z) {

					console.log(z);


					getFileSecter(z['msg']['image'], 'photo_128').then(function(url) {


						tmpCache['s' + z['msg']['image']] = url;
						if (url == false) url = '/images/defaultprofileimage.jpg';


						Notification.requestPermission();



						var mailNotification = new Notification(z['msg']['name'] + " " + z['msg']['surname'], {
							tag: "message",
							body: messageInfo['template'],
							icon: url
						});


						$(`<div class="dialog waves-effect waves-light" onclick="client.selectDialog('` + msg['from'] + `')" id="message` + msg['from'] + `">
  <p id="userName">` + z['msg']['name'] + " " + z['msg']['surname'] + `</p>
   <p id="textMessage" class="truncate" style="
">` + messageInfo['dialogsText'] + `</p>
  <img src="` + url + `" id="profilePhoto"></img>
</div>`).prependTo('#leftPanelMessages');


					});



				});


			}



			if ($('#block' + msg['from']).length != 0) {


				$('#block' + msg['from'] + ' .messagesList').append(messageInfo['template']);

				$('#block' + msg['from']).scrollTop(9999999999999999999999999999999999999);

			}


			console.log(messageInfo);
		});



	});

	socket.socketCopy.on('encryptionKey', function(key) {
		key = JSON.parse(LZString.decompressFromUTF16(key));



		console.log(key);

		setKeyForUser(key['from'], key['key']);
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
			if (isEmpty(r['msg'])) {

				console.log('No dialogs');

				$('#noDialogsText').show();
			}
			forEach(r['msg'], function(key, value) {
				var message;
				try {
					message = decryptMessage(value['message'], getKeyForUser(value['with']));
				} catch (e) {
					message = '<span style="color:#ce4242;">Ошибка</span>';
				}



				console.log(value);

				if (typeof message.split('_')[2] != 'undefined') message = message.split('_')[0];

				getFileSecter(value['image'], 'photo_128').then(function(url) {
					if (url == false) url = '/images/defaultprofileimage.jpg';

					tmpCache['s' + value['image']] = url;

					var styleVerify = '';
					if(value.is_offical==1) styleVerify = `<img src="images/verify_account.svg" class="userVerify">`;

			
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



	this.selectDialog = function(login) {

		$('.dialog').removeClass('selectedDialog');
		$('.dialog #userName').removeClass('selectedName');
		$('.dialog #textMessage').removeClass('selectedText');



		$('#message' + login).addClass('selectedDialog');

		$('#message' + login).attr('data-issearch', 'false');


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
  
  <div id="userInfoTopPanel" class="z-depth-2">
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
  </div>


<ul class='messagesList'>



</ul>

<div class="messagesSendSection" style="
">

<i class="material-icons sendAttachmentButton" style="" onclick="$('.uploadFileInput').trigger('click'); console.log('Choose file');">attachment</i>


<div class="messageSendBlock" contenteditable="true" style="
"></div>

<i class="material-icons sendMsgButton" onclick="client.sendMessage($('#block` + login + ` .messageSendBlock').text(), '` + login + `')">send</i>
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


					var text = decryptMessage(value['message'], getKeyForUser(whoIsWho));


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

				win.openWindowText('infoPopup', {
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
				win.openWindowText('infoPopup', {
					title: 'Неверный код',
					text: 'Данный код авторизации неверен.'
				});

			} else if (r['code'] == SUCCESSFUL_AUTH) {
				// auth!
				$('#blockAuth').remove();
				getDialogs();

				$('#infoPanelLogin').text(login);

				socket.fastInfo(login).then(function(info) {
					$('#infoPanelName').text(info['msg']['name'] + ' ' + info['msg']['surname']);


					getFileSecter(info['msg']['image'], 'photo_128').then(function(photo) { // load photo
						$('#infoPanelImage').attr('src', photo);

					});

				});



				$('.row').fadeIn(250);
				setCookie('lastLogin', r['msg']['login']);
				setCookie('lastCrt', r['msg']['crt']);


				$('#blockAuth').fadeOut(200);
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
				// auth!!
				$('#blockAuth').remove();
				getDialogs()
				$('.row').fadeIn(250);
				$('#blockAuth').fadeOut(200);

				$('#infoPanelLogin').text(login);

				socket.fastInfo(login).then(function(info) {
					$('#infoPanelName').text(info['msg']['name'] + ' ' + info['msg']['surname']);


					getFileSecter(info['msg']['image'], 'photo_128').then(function(photo) { // load photo
						$('#infoPanelImage').attr('src', photo);

					});

				});



				setCookie('lastLogin', r['msg']['login']);
				setCookie('lastCrt', r['msg']['crt']);
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
				win.openWindowText('infoPopup', {
					title: 'Ошибка',
					text: 'Данный пользователь еще не зарегестрирован или почта неверна.'
				});
			} else if (r['error_code'] == 400) {
				win.openWindowText('infoPopup', {
					title: 'Ошибка',
					text: 'Контакт уже в вашем контакт-листе'
				});
			} else if (r['error_code'] == 403) {
				win.openWindowText('infoPopup', {
					title: 'Ошибка',
					text: 'Вы не можете добавить самого себя в конакты'
				});
			} else {

				$('.addContact').fadeOut(25);
				$('#mask').css('z-index', '');
				$('#emailContacts').addClass('valid');
				$('#nameContacts').addClass('valid');

				var date = new Date(Math.floor(Date.now() / 10000));
				if (!isEmpty(tmpCache['s' + r['msg']['image']])) {

					console.log('from cache');
					$(` <div class="userBlock waves-effect" data-login="` + r['msg']['login'] + `">
    <img src="` + tmpCache['s' + r['msg']['image']] + `" class="userImage">
    <p class="userName truncate">` + howWrite + `</p>
    <p class="whenWasAdded truncate">Добавлен ` + date.getFullYear() + '.' + date.getMonth() + "." + date.getDate() + `</p>
  </div>`).prependTo('.contentContacts');
				} else {
					getFileSecter(value['image'], 'photo_128').then(function(url) {

						if (url == false) url = '/images/defaultprofileimage.jpg';


						$(` <div class="userBlock waves-effect" data-login="` + r['msg']['login'] + `">
    <img src="` + url + `" class="userImage">
    <p class="userName truncate">` + howWrite + `</p>
    <p class="whenWasAdded truncate">Добавлен ` + date.getFullYear() + '.' + date.getMonth() + "." + date.getDate() + `</p>
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


				if ($('#message' + to).length == 0) {



					socket.fastInfo(to).then(function(z) {

						console.log(z);


						getFileSecter(z['msg']['image'], 'photo_128').then(function(url) {

							if (url == false) url = '/images/defaultprofileimage.jpg';
							tmpCache['s' + z['msg']['image']] = url;
							$(`<div class="dialog waves-effect waves-light" onclick="client.selectDialog('` + to + `')" id="message` + to + `">
  <p id="userName">` + z['msg']['name'] + " " + z['msg']['surname'] + `</p>
   <p id="textMessage" class="truncate" style="
">` + messageRaw + `</p>
  <img src="` + url + `" id="profilePhoto"></img>
</div>`).prependTo('#leftPanelMessages');



							// wait send msg



						});



					});
				}



				$('#block' + to + ' .messagesList').append(messageInfo['template']);

				$('#message' + to).prependTo('#leftPanelMessages');



				$('#message' + to + ' #textMessage').text(messageInfo['dialogsText']);

				$('#block' + to).scrollTop(9999999999999999999999999999999999999);



			}
			socket.sendMessage(message, to).then(function(r) {
				console.log(r);
				$('#messageID' + randomID + ' .statusSendMessage').text('check');
				$('#messageID' + randomID).attr('oldid', randomID);
				$('#messageID' + randomID).attr('id', 'messageID' + r['msg']['id']);
				console.log('set ID' + 'messageID' + r['msg']['id']);

			});



		});



	};


	this.sendMessage = function(message, to) {

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



				if ($('#message' + to).length == 0) {



					socket.fastInfo(to).then(function(z) {

						console.log(z);


						getFileSecter(z['msg']['image'], 'photo_128').then(function(url) {
							if (url == false) url = '/images/defaultprofileimage.jpg';
							tmpCache['s' + z['msg']['image']] = url;
							$(`<div class="dialog waves-effect waves-light" onclick="client.selectDialog('` + to + `')" id="message` + to + `">
  <p id="userName">` + z['msg']['name'] + " " + z['msg']['surname'] + `</p>
   <p id="textMessage" class="truncate" style="
">` + messageRaw + `</p>
  <img src="` + url + `" id="profilePhoto"></img>
</div>`).prependTo('#leftPanelMessages');



							// wait send msg



						});



					});
				}



				$('#block' + to + ' .messagesList').append(messageInfo['template']);

				$('#message' + to).prependTo('#leftPanelMessages');



				$('#message' + to + ' #textMessage').text(messageInfo['dialogsText']);

				$('#block' + to).scrollTop(9999999999999999999999999999999999999);


			}
			socket.sendMessage(message, to).then(function(r) {
				console.log(r);
				$('#messageID' + randomID + ' .statusSendMessage').text('check');
				$('#messageID' + randomID).attr('oldID', randomID);
				$('#messageID' + randomID).attr('id', r['msg']['id']);


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

				setCookie('lastLogin', r['msg']['login']);
				setCookie('lastCrt', r['msg']['crt']);
			} else if (r['error_code'] == 4) {

				win.openWindowText('infoPopup', {
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



	var getFileSecter = function(id, field) {
		return new Promise(function(resolve, reject) {


			$.get('/getAttachment/' + id + '/' + field, {}, function(r) {



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



			});



		});



	}


	this.getFile = function(id, field) {
		return new Promise(function(resolve, reject) {


			$.get('/getAttachment/' + id + '/' + field, {}, function(r) {



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



			});



		});



	}

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
			forEach(r['msg'], function(key, value) {
				console.log(value);
				var date = new Date(Math.floor(value['date'] * 1000));


				if (!isEmpty(tmpCache['s' + value['image']])) {

					console.log('from cache');
					$(` <div class="userBlock waves-effect" data-login="` + value['loginUser'] + `">
    <img src="` + tmpCache['s' + value['image']] + `" class="userImage">
    <p class="userName truncate">` + value['name'] + ' ' + value['surname'] + `</p>
    <p class="whenWasAdded truncate">Добавлен ` + date.getFullYear() + '.' + date.getMonth() + "." + date.getDate() + `</p>
  </div>`).prependTo('.contentContacts');
				} else {
					getFileSecter(value['image'], 'photo_128').then(function(url) {
						if (url == false) url = '/images/defaultprofileimage.jpg';
						$(` <div class="userBlock waves-effect" data-login="` + value['loginUser'] + `">
    <img src="` + url + `" class="userImage">
    <p class="userName truncate">` + value['name'] + ' ' + value['surname'] + `</p>
    <p class="whenWasAdded truncate">Добавлен ` + date.getFullYear() + '.' + date.getMonth() + "." + date.getDate() + `</p>
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
					sendMessageProtected(info['type'] + '_' + info['id'] + '_' + info['name'], to, fileInfo);
				});



			});


		});



	}

	var messageParser = function(text, messageClass, id, att) {
		/*	var obj = {text:text, is_attachment:0, attachment:['document', 'ducks.jpg', 'id']};
			return obj;*/

		text = escapeHtml(text);

		return new Promise(function(resolve, reject) {

			var template;
			var infoText = text.split('_');
			var dialogsText;


			if (typeof infoText[2] == 'undefined') {
				template = `<li class='` + messageClass + `' id='messageID` + id + `'>` + text + att + `</li>`;
				dialogsText = text;

				resolve({
					template: template,
					dialogsText: dialogsText
				});
			} else {



				switch (infoText[0]) {
					case 'image':
						template = `<li class='` + messageClass + `' id='messageID` + id + `'><img src='/images/photoPreview.png' width='320px' height='320px' class='dialogsImageSend'>` + att + `</li>`;
						dialogsText = 'фотография';
						break;
					case 'video':
						dialogsText = 'видео';
						break;
					case 'audio':
						dialogsText = 'аудио';



						template = `<li class='` + messageClass + `' id='messageID` + id + `'>			<div class="audioMessage" style="
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

    <p class="audioName truncate">DJ LIVE - Работай!</p>
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


				getFileSecter(infoText[1], 'photo_450').then(function(url) {


					console.log('LOAD!!!');

					console.log(url);


					/*"$('.photoWatcher').fadeIn(200);
$('.photoWatcher .closeIcon').css('transform', 'rotate(0deg)'); $('.photoWatcher .imageView').attr('src', '`+url+`');"*/


					var objectID = id;
					if ($("li[oldid='" + id + "']").length != 0) {
						console.log('&c OLD ID IS DELEETE');
						objectID = $("li[oldid='" + id + "']").attr('id');


					}

					if (objectID.indexOf("messageID") == -1) objectID = '#messageID' + objectID;
					else objectID = '#' + objectID;

					console.log('objectID : ' + objectID);


					if (infoText[0] == 'image') {



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



	this.seePhoto = function(url) {

	};

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