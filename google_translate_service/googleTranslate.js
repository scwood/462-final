var fetch = require('isomorphic-fetch');
var querystring = require('querystring');
var languages = require('./languages');

var apiKey = 'AIzaSyCEMgBPhvQkqk5j9oIJIfQ4hxk019RFcb0';
var baseUrl = 'https://translation.googleapis.com/language/translate/v2';

module.exports.getLanguages = function() {
  return fetch(baseUrl + '/languages?' + querystring.stringify({key: apiKey}))
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      return json.data.languages.map(function(obj) {
        obj.name = languages[obj.language];
        return obj;
      });
    })
};

module.exports.translateText = function(text, target) {
  return fetch(baseUrl + '?' + querystring.stringify({
    q: text,
    target: target,
    key: apiKey,
  }), { method: 'POST' })
    .then(function(response) {
      console.log(response)
      return response.json();
    })
    .then(function(json) {
      return json.data.translations[0].translatedText;
    })
};
