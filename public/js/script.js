$(function() {
  var socket = io();
  var submitButton = $('#submit-button');
  var pauseButton = $('#pause-button');
  var keyword = $('#keyword');
  var tweets = $('#tweets');

  socket.on('tweet', function(tweet){
    console.log(tweet)
    tweets.html(generateTweetHtml(tweet) + tweets.html()); });

  $('#submit-button').on('click', function() {
    socket.emit('keyword', keyword.val());
  })
});

function generateTweetHtml(tweet) {
  return `<div class="media">
    <div class="media-left">
      <img class="media-object" src="${tweet.user.profile_image_url}">
    </div>
    <div class="media-body">
      <h4 class="media-heading">
        ${tweet.user.name} <small>@${tweet.user.screen_name}</small>
      </h4>
      ${tweet.text}
    </div>
  </div>`;
}
