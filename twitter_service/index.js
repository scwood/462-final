var express = require('express')
var app = express();
var http = require('http').Server(app);
var path = require('path');
var socket = require('socket.io'); var Twitter = require('node-tweet-stream');
var io = socket(http)
var axios = require('axios');

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
  var language = null;
  var paused = false;
  var twitter = new Twitter(twitterConfig);

  twitter.on('tweet', function(tweet) {
    // TODO translate
    if (language) {
      translate(tweet.text, language)
        .then(function(translatedText) {
          tweet.text = translatedText;
          socket.emit('tweet', tweet);
        })
        .catch(function(error) {
          console.log(error);
        })
    } else {
      socket.emit('tweet', tweet);
    }
  });

  socket.on('keyword', function(request) {
    if (keyword) {
      twitter.untrack(keyword);
    }
    keyword = request.keyword;
    language = request.language;
    paused = false;
    twitter.track(keyword);
  });

  socket.on('pause', function() {
    console.log('PAUSING')
    paused = !paused;
    if (paused) {
      twitter.untrack(keyword);
    } else {
      twitter.track(keyword);
    }
  });

  socket.on('disconnect', function(){
    if (keyword) {
      twitter.untrack(keyword)
    }
    console.log('user disconnected');
  });
});

function translate(text, language) {
  if (process.env.NODE_ENV === 'production') {
    var translateUrl = 'https://translate.462.spncrwd.com/translations';
  } else {
    var translateUrl = 'http://localhost:3001/translations';
  }
  return axios.post(translateUrl, {
    text: text,
    language: language,
  })
    .then(function(response) {
      return response.data.translatedText;
    });
}

var port = process.env.PORT || 3000;
http.listen(port, function() {
  console.log('listening on port ' + port);
});
