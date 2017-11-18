// Setup basic express server
var express = require('express');
var compression = require('compression');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var core = require('./core/core.js');
var dialogs = require('./core/classes/dialogs.js');
var contacts = require('./core/classes/contacts.js');

var LZString = require('lz-string');
var port = process.env.PORT || 443;
var fs = require('fs');
var aesjs = require('aes-js');
var parseUrl = require('url');
const fileUpload = require('express-fileupload');
var sanitizer = require('sanitizer');
var bodyParser = require('body-parser'); // include module
server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

var async = require('async');

const accessFilesForImages = ['png', 'jpg', 'jpeg'];

// Routing
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(compression());
app.use(express.static(__dirname + '/frontend' ));
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}));

app.get('/getAttachment/:id', function(req, res){
var id = req.params.id;
console.log(id);
var response = core.attachments.getAttachment(id);
res.send(JSON.stringify(response));
});


app.post('/uploadImage/:token/:isProfilePhoto', function(req, res) {

  var login = core.attachments.isTokenValide(req.params.token, tokens);
   var isProfilePhoto = req.params.isProfilePhoto;

   console.log('Login: ' + login)

if(login == false || isProfilePhoto==undefined || isProfilePhoto=='') {


  res.status(500).send('This is error!');

  return false;
}



delete tokens[req.params.token];



  if (!req.files)
    return res.status(400).send('Your files is empty.');
 
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.file;

  let fileName = sampleFile.name.replace('_', ''), fileData =  sampleFile.data.toString('base64'), fileType = sampleFile.name.split('.').pop(), fileMime = sampleFile.mimetype;
  

  let Attachment = {login:login, is_profile:0, data:fileData, mime:fileMime, name:fileName};
  console.log(sampleFile);


  console.log(accessFilesForImages);
    if(isProfilePhoto == 1 && fileMime.split('/')[0] != 'image'){
      res.status(500).send('This files is denied for profileImages!');

      return false;

    }

    if(isProfilePhoto==1){

      Attachment['is_profile'] = 1;
    }


    var response = core.attachments.addAttachments(Attachment);


    res.send(response);
    if(Attachment['is_profile']==1) core.changeProfilePhoto(login, JSON.parse(response)['id']);
    

  


  
});

var clients = {}, waitingSend = {}, tokens = {};
io.on('connection', function (socket) {





var login, authcode, key;

socket.on('setKey', function(key){
key = key;
console.log('New key: ' + key);
});

socket.on('request', function(data, fn){



  try{
    // if user send a bad request
      data = JSON.parse(LZString.decompressFromUTF16(data));
  
  }
  catch(e){

 // TODO : Create error's log

  console.log('bad request, JSON stringify dont!');

 return false;



  }

  console.log(data);

/*if(isEmpty(fn)){
  socket.disconnect();
  console.log('FN is empty');
  return false;


}*/


// request lenght test
try{
  console.log('length: ' + Object.keys(data).length);
}
catch(e){
   console.log('bad request : isnt object');

 return false;
}

if(Object.keys(data).length > 7){
  console.log('Big request');

 return false;
}

if(typeof fn != 'function'){
   console.log('bad request, FN isnt function');

 return false;
}


console.log(data);



forEach(data, function(key, value){





delete data[key];
if(value != undefined && value != null && value != ''){
  if(value.length > 5000){
    console.log('Big request');

 return false;
  }
  try{
    console.log('type: ' + typeof value);
    if(typeof value == 'number') data[key] = value;
    else data[key] = sanitizer.escape(addslashes(value));
  }
  catch(e){
    // nothing
  }
  
}

});


console.log(data);


switch(data['method']){



case 'auth.register':
core.registerAccountPartOne(data['l'], data['e'], data['name'], data['surname']).then(function(r){

  console.log('end call');



  if(JSON.parse(LZString.decompressFromUTF16(r))['code']==3){
    r = JSON.parse(LZString.decompressFromUTF16(r));
    authcode = r['msg'];

    console.log('Auth code: ' + authcode);


    r['msg'] = 'Successful registation';

    r = LZString.compressToUTF16(JSON.stringify(r));
  }




fn(r);
});
break;

case 'auth.auth':


core.authAccount(data['login']).then(function(r){






  if(JSON.parse(LZString.decompressFromUTF16(r))['code']==9){

    r = JSON.parse(LZString.decompressFromUTF16(r));
    authcode = r['msg'];
    console.log('New auth code : ' + authcode);
    r['msg'] = 'Need authcode';

    r = LZString.compressToUTF16(JSON.stringify(r));



  }

  fn(r);
});
break;


case 'auth.enterCode':
core.authCodeEnter(data['login'], data['code'], authcode).then(function(r){



 if(JSON.parse(LZString.decompressFromUTF16(r))['error_code']==8){

    r = JSON.parse(LZString.decompressFromUTF16(r));
    authcode = r['msg'];
    console.log('new auth code : ' + authcode);
    r['msg'] = 'Authcode isnt valid';

    r = LZString.compressToUTF16(JSON.stringify(r));
  }

if(JSON.parse(LZString.decompressFromUTF16(r))['code']==10){
  r = JSON.parse(LZString.decompressFromUTF16(r));









  r['msg'] = {msg:'Successful auth!', crt:r['msg'], login:data['login']};


r = LZString.compressToUTF16(JSON.stringify(r));

  authcode='';
   clients[login] = socket.id;
   login = data['login'];

if(!isEmpty(waitingSend[login])){
  socket.emit('encryptionKey', waitingSend[login]);
  console.log('Send key!');
} 

}



fn(r);


});
break;

case 'key.setKey':
if(isEmpty(data['key']) || isEmpty(data['to'] || isEmpty(login))){
  fn(LZString.compressToUTF16(JSON.stringify({error_code:1, error:1, msg:'Params is empty'})));
  return false;
}
else{


  if(clients[data['to']] == undefined){


    // wait list..

    waitingSend[data['to']] = LZString.compressToUTF16(JSON.stringify({from:login, key:data['key']}));
    console.log('Wait send..')
  }
  else{


    io.to(clients[data['to']]).emit('encryptionKey', LZString.compressToUTF16(JSON.stringify({from:login, key:data['key']}))) ;

  }

}
break;

case 'account.setOnline':
core.setOnline(login).then(function(r){
  fn(r);
});
break;

case 'account.getOnline':
core.getOnline(data['login']).then(function(r){
  fn(r);
});
break;
case 'auth.validateAccount':
core.validateAccount(data['login'], data['code'], authcode).then(function(r){

  if(JSON.parse(LZString.decompressFromUTF16(r))['code']==6){


    authcode = '';
    login = data['login'];
    clients[login] = socket.id;//auth

if(!isEmpty(waitingSend[login])){
  socket.emit('encryptionKey', waitingSend[login]);
  console.log('Send key!');
} 



    r = JSON.parse(LZString.decompressFromUTF16(r));









  r['msg'] = {msg:'Successful validation', crt:r['msg'], login:data['login']};


r = LZString.compressToUTF16(JSON.stringify(r));




    console.log('AUTH');
  }

  if(JSON.parse(LZString.decompressFromUTF16(r))['error_code']==4){

    r = JSON.parse(LZString.decompressFromUTF16(r));
    authcode = r['msg'];
    console.log('new auth code : ' + authcode);
    r['msg'] = 'Authcode isnt valid';

    r = LZString.compressToUTF16(JSON.stringify(r));
  }



   



  fn(r);
});
break;

case 'users.search':
core.searchUsers(data['login']).then((r)=>{fn(r)});
break;
case 'contacts.add':
fn(contacts.addToContacts(login, data['mail'], data['data']));
break;
case 'contacts.get':
var resp = contacts.getMyContacts(login);

var resp = JSON.parse(LZString.decompressFromUTF16(resp));

if(resp['code']==404){

  var response ={code:resp['code'], error:0, msg:[]};








var i =0, length=resp['msg'].length;

 if(length == 0){
    resp = LZString.compressToUTF16(JSON.stringify(resp));

    console.log('end loop');


  fn(resp);

  return false;
  }



  async.forEachOf(resp['msg'], function (value, key, callback) {



core.getFastInfo(value['loginUser']).then(function(z){
i++;
  z = JSON.parse(LZString.decompressFromUTF16(z));


  var msgsInfo = value;
  msgsInfo['image'] = z['msg']['image'];
  msgsInfo['lastOnline'] = z['msg']['lastOnline'];
  msgsInfo['name'] = z['msg']['name'];
  msgsInfo['online'] = z['msg']['online'];
  msgsInfo['surname'] = z['msg']['surname'];
  msgsInfo['userid'] = z['msg']['userid'];

  response['msg'].push(msgsInfo);



  if(length == i){
response = LZString.compressToUTF16(JSON.stringify(response));




  fn(response);
  }



});



  callback();
}, function (err) {
    if (err) console.error(err.message);
   

   

});




}

else{
      resp = LZString.compressToUTF16(JSON.stringify(resp));
  fn(resp)
}



break;
case 'auth.authCrt':
var r = core.authAccountByCrt(data['login'], data['crt']);

r = JSON.parse(LZString.decompressFromUTF16(r));

if(r['code']==10){
// auth




authcode = '';
    login = data['login'];


    clients[login] = socket.id;//auth
if(!isEmpty(waitingSend[login])){
  socket.emit('encryptionKey', waitingSend[login]);
  console.log('Send key!');
} 



 r['msg'] = {msg:'Successful auth!', crt:r['msg'], login:data['login']};
}


r = LZString.compressToUTF16(JSON.stringify(r));

fn(r);

break;



case 'messages.send':

console.log(data['message']);
dialogs.sendMessage(data['message'], data['to'], login).then(function(r){

if(JSON.parse(LZString.decompressFromUTF16(r))['code']==12){
  console.log('client ID : ' + clients[data['to']]);
  io.to(clients[data['to']]).emit('new message', r);
  // send...
}


  fn(r);
});
break;

case 'messages.setTyping':
io.to(clients[data['to']]).emit('typing', LZString.compressToUTF16(JSON.stringify({type:1, who:login}))) ;

setTimeout(function(){
  console.log('end typing');
io.to(clients[data['to']]).emit('typing', LZString.compressToUTF16(JSON.stringify({type:0, who:login}))) ;
}, 5000);
break;

case 'info.getFast':
core.getFastInfo(data['login']).then(function(r){
  fn(r);
});
break;
case 'messages.getDialogs':

console.log('Login : ' + login);
dialogs.getDialogs(login).then(function(r){
r = JSON.parse(LZString.decompressFromUTF16(r));


if(r['code']==14){



var response = {};
response['code'] = 14;
response['error']=0;
response['msg'] = [];
var i = 0;

var length = r['msg'].length;

if(length==0){
r = LZString.compressToUTF16(JSON.stringify(r));




  fn(r);
  return false;
}
async.forEachOf(r['msg'], function (value, key, callback) {
  


core.getFastInfo(value['with']).then(function(z){
i++;
  z = JSON.parse(LZString.decompressFromUTF16(z));


  var msgsInfo = value;
  msgsInfo['image'] = z['msg']['image'];
  msgsInfo['lastOnline'] = z['msg']['lastOnline'];
  msgsInfo['name'] = z['msg']['name'];
  msgsInfo['online'] = z['msg']['online'];
  msgsInfo['surname'] = z['msg']['surname'];
  msgsInfo['userid'] = z['msg']['userid'];

  response['msg'].push(msgsInfo);

  if(length == i){
    console.log(response);
response = LZString.compressToUTF16(JSON.stringify(response));




  fn(response);
  }

});



  callback();
}, function (err) {
    if (err) console.error(err.message);
   

   

});


}

else{
r = LZString.compressToUTF16(JSON.stringify(r));




  fn(r);

}



});
break;


case 'messages.get':
dialogs.getMessages(data['login'], login).then(function(r){



fn(r);

});
break;
case 'attachments.getLink':
core.generateToken(login).then(function(r){

  r = JSON.parse(LZString.decompressFromUTF16(r));

  if(r['code']==11){

    tokens[r['msg']] = login;


    console.log(tokens);
  }
  r = LZString.compressToUTF16(JSON.stringify(r));
  fn(r);
});
break;
case 'utils.isBusyLogin':
core.isLoginBusy(data['l']).then(function(r){
fn(r)
});
break;

}




});


socket.on('disconnect', function(){
console.log('Disconnect!');


delete clients[login];
});

});











app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});

function empty(s){
  if(s==undefined || s==null || s=='') return true;
  else return false;
}

function strstr( haystack, needle, bool ) { // Find first occurrence of a string
  // 
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)

  var pos = 0;

  pos = haystack.indexOf( needle );
  if( pos == -1 ){
    return false;
  } else{
    if( bool ){
      return haystack.substr( 0, pos );
    } else{
      return haystack.slice( pos );
    }
  }
}


function forEach(data, callback){
  for(var key in data){
    if(data.hasOwnProperty(key)){
      callback(key, data[key]);
    }
  }
}



function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== "object") return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}

function addslashes(str) {
  if(typeof str == 'number') return str;
    str=str.replace(/\\/g,'\\\\');
    str=str.replace(/\'/g,'\\\'');
    str=str.replace(/\"/g,'\\"');
    str=str.replace(/\0/g,'\\0');
    return str;
}


 var decryptRequest = function(text, key){
var textBytes = aesjs.utils.utf8.toBytes(text);
var keyBytes = aesjs.utils.hex.toBytes(key);

var aesCtr = new aesjs.ModeOfOperation.ctr(keyBytes, new aesjs.Counter(5));
var decryptedBytes = aesCtr.decrypt(textBytes);
 
// Convert our bytes back into text 
var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
console.log(decryptedText);

return decryptedText;

};