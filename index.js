var express = require('express')
var app = express();
var http = require('http').Server(app);
var path = require('path');
var socket = require('socket.io');
var Twitter = require('node-tweet-stream');
var io = socket(http)

var twitterConfig = {
  consumer_key: 'xyciIyxhDnKNEsWP9kw6CZjDN',
  consumer_secret: 'gKCQHIB8VOWKzISiM9pqKHuxVOi2Bbt4m6XTYV5xPPvSuF5hq0',
  token: '774062884972265472-M1H72y9eO6wAUztN8llTkFUVDa1xuug',
  token_secret: 'eAWxnsVd5QHBYAYnHuKhehApJ0Od6LYTbzTQDhElYKw2g'
}

app.use(express.static(path.join(__dirname, 'public')))

io.on('connection', function(socket) {
  console.log('user connected')
  var keyword = null;
  var twitter = new Twitter(twitterConfig);

  twitter.on('tweet', function(tweet) {
    console.log('emitting tweet');
    socket.emit('tweet', tweet);
  });

  socket.on('keyword', function(newKeyword) {
    if (keyword) {
      twitter.untrack(keyword);
    }
    keyword = newKeyword;
    twitter.track(keyword);
  });

  socket.on('disconnect', function(){
    if (keyword) {
      twitter.untrack(keyword)
    }
    console.log('user disconnected');
  });
});

var port = process.env.PORT || 3000;
http.listen(port, function() {
  console.log('listening on port ' + port);
});
