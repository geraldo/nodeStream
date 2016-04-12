# nodeStream
Streaming from ffmpeg to HTML5 canvas.

## Setup in 3 steps

1. Set up ffmpeg and make a test stream, for example using the webcam:

`ffmpeg -f video4linux2 -i /dev/video0 -f h264 -vcodec libx264 -r 10 -s 160x144 -g 0 -b 800000 udp://127.0.0.1:1234`

2. Adapt directory, server IP and port in `streamserver.js` and run node server program from server directory by typing:

`node streamserver.js`

3. Open browser, type your IP and port like http://localhost:8080/client/ and you should see your video stream embedded into the website.

## more info

http://go.yuri.at/streaming-ffmpeg-with-nodejs-on-web-sockets-to-html/
