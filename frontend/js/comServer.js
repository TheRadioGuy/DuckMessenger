function ServerCommunitation(socketObj){





  var socket = socketObj;


  this.sendRequest = function(params){
    return new Promise(function(resolve, reject){
      socket.emit('request', LZString.compress(JSON.stringify(params)), function(data){
        resolve(data);
      });
    });
    
  };

  


}