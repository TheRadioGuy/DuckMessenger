var P2P = window.P2P;


var startRecord = function(cb) {
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

