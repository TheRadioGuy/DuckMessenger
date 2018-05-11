class Server {
	constructor(socket) {
		this._socket = socket;
	}
	_sendReq(method, params) {
		return new Promise((resolve, reject) => {
			this._socket.emit('request', LZString.compressToUTF16(JSON.stringify(params)), data => {
				resolve(JSON.parse(LZString.decompressFromUTF16(data)));
			});
		});
	}
}