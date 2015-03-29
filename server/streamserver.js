//--
var nxserver = new NXServer('/home/gerald/prog/nodeStream', 8080, '127.0.0.1', 1234);

// --
// start node server
function NXServer(httpUIDir, httpPort, streamIP, streamPort) {

	this.httpUIDir = httpUIDir; // __dirname
	this.httpPort = httpPort;
	this.streamIP = streamIP;
	this.streamPort = streamPort;

	var connect = require('connect'),
		http = require('http'),
		serveStatic = require('serve-static'),
		//app = connect().use(connect(this.httpUIDir)).listen(this.httpPort),   //running from http://
		app = connect().use(serveStatic(this.httpUIDir)).listen(this.httpPort),    //running from file:///
		io = require('socket.io').listen(app);

	console.log("http server on "+this.httpPort);
	console.log("running on "+this.httpUIDir);

	// get stream and send to canvas
	// way for linux
	var ffmpeg = require('child_process').spawn("ffmpeg", [
		"-re", 
		"-y", 
		"-i", 
		"udp://"+this.streamIP+":"+this.streamPort, 
		"-preset", 
		"ultrafast", 
		"-f", 
		"mjpeg", 
		"pipe:1"
		]);

	// way for windows?
	//  var ffmpeg = require('child_process').spawn("ffmpeg", [
	//    "-y", 
	// "-threads",
	// "4",
	//    "-i", 
	//    "udp://"+this.streamIP+":"+this.streamPort, 
	// "-preset", 
	//    "ultrafast", 
	// "-bufsize",
	// "702000k",
	// "-vcodec",
	// "copy",
	//    "-f", 
	//    "mpjpeg", 
	//    "pipe:1"
	//  ]);
	// vcd
	ffmpeg.on('error', function (err) {
		throw err;
	});

	ffmpeg.on('close', function (code) {
		console.log('ffmpeg exited with code ' + code);
	});

	ffmpeg.stderr.on('data', function (data) {
		//console.log('stderr: ' + data);
	});

	ffmpeg.stdout.on('data', function (data) {
		//console.log("stream data");

		// receive data as Motion JPEG frame by frame and sharpen them with ImageMagick
		// var sharpen = new Buffer('','binary');
		// var im = require('child_process').spawn("convert","-sharpen","1x1","-");

		// im.stdout.on('data', function (imdata) {
		// 		sharpen += imdata;
		// });

		// im.on('exit', function (code) { 
		// 		//console.log("send to canvas");
		// 		var frame = new Buffer(sharpen).toString('base64');
		// 		io.sockets.emit('canvas',frame);
		// });

		var frame = new Buffer(data).toString('base64');
		io.sockets.emit('canvas',frame);
	});
}
