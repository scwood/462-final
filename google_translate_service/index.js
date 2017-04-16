var express = require('express');
var googleTranslate = require('./googleTranslate');
var cors = require('cors');
var bodyParser = require('body-parser');
var app = express();

app.use(cors())
app.use(bodyParser.json());
app.route('/languages')
  .get(function(req, res, next) {
    googleTranslate.getLanguages()
      .then(function(languages) {
        res.send({languages: languages})
      })
      .catch(next);
  });

app.route('/translations')
  .post(function(req, res, next) {
    googleTranslate.translateText(req.body.text, req.body.language)
      .then(function(translatedText) {
        res.send({translatedText: translatedText})
      })
      .catch(next);
  });

var port = process.env.PORT || 3001;
app.listen(port, function() {
  console.log('listening on port ' + port);
});
