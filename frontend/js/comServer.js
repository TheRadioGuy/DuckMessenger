function ServerCommunitation(socketObj){





  var socket = socketObj;


  this.sendRequest = function(params){
    return new Promise(function(resolve, reject){
      socket.emit('request', LZString.compressToUTF16(JSON.stringify(params)), function(data){
        resolve(JSON.parse(LZString.decompressFromUTF16(data)));
      });
    });
    
  };

  


}