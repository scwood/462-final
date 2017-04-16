if (location.hostname === "localhost") {
  var translationBaseUrl = 'http://localhost:3001';
} else {
  var translationBaseUrl = 'https://translation.462.spncrwd.com';
} 

$(function() {
  getLanguages();

  var socket = io();
  var paused = false;
  var submitButton = $('#submit-button');
  var pauseButton = $('#pause-button');
  var keyword = $('#keyword');
  var language = $('#language');
  var tweets = $('#tweets');

  socket.on('tweet', function(tweet){
    tweets.html(generateTweetHtml(tweet) + tweets.html());
  });

  $('#submit-button').on('click', function() {
    socket.emit('keyword', {keyword: keyword.val(), language: language.val()});
    pauseButton.prop('disabled', false);
    paused = false;
    pauseButton.text('Pause')
  });
  
  $('#pause-button').on('click', function() {
    paused = !paused;
    if (paused) {
      pauseButton.text('Resume')
    } else {
      pauseButton.text('Pause')
    }
    socket.emit('pause');
  });
});

function generateTweetHtml(tweet) {
  return `<div class="media">
    <div class="media-left">
      <img class="media-object" src="${tweet.user.profile_image_url}"> </div>
    <div class="media-body">
      <h4 class="media-heading">
        ${tweet.user.name} <small>@${tweet.user.screen_name}</small>
      </h4>
      ${tweet.text}
    </div>
  </div>`;
}


function getLanguages() {
  $.get(translationBaseUrl + '/languages')
    .then(function(response) {
      response.languages.forEach(function(language) {
        var newLanguage = {
          value: language.language,
          text: language.name ? language.name : language.language
        }
        if (language.language === 'en') {
          newLanguage.selected = 'selected';
        }
        $('#language').append($('<option>', newLanguage));
      });
    });
}
