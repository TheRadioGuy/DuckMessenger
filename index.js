// Setup basic express server
var express = require('express');
var compression = require('compression');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var core = require('./core/core.js');
var LZString = require('lz-string');
var port = process.env.PORT || 443;
var fs = require('fs');
var parseUrl = require('url');
var sanitizer = require('sanitizer');
var bodyParser = require('body-parser'); // include module
server.listen(port, function () {
  console.log('Server listening at port %d', port);
});



// Routing
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(compression());
app.use(express.static(__dirname + '/frontend' ));






var clients = {}, waitingSend = {};
io.on('connection', function (socket) {





var login, authcode;



socket.on('request', function(data, fn){


console.log(data);
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
  if(value > 5000){
    console.log('Big request');
  socket.disconnect();
 return false;
  }
  try{

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

case 'auth.validateAccount':
core.validateAccount(data['login'], data['code'], authcode).then(function(r){

  if(JSON.parse(LZString.decompressFromUTF16(r))['code']==6){

    authcode = '';
  }

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
