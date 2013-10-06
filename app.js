var connect = require('connect'),
    io = require('socket.io').listen(1337),
    Twit = require('twit'),
    restclient = require('node-restclient'),
    sys = require("sys"),
    fs = require("fs");

connect(connect.static(__dirname + '/public')).listen(8000);

var config, getNounsURL, T;

io.sockets.on('connection', function(socket) {

  // store credentials in config.json
  var file = __dirname + '/config.json';

  fs.readFile(file, 'utf8', function (err, data) {
    if (err) {
      console.log('Error: ' + err);
      return;
    }
    config = JSON.parse(data);

    getNounsURL = "http://api.wordnik.com/v4/words.json/randomWords?" +
        "minCorpusCount=1000&minDictionaryCount=10&" +
        "excludePartOfSpeech=proper-noun,proper-noun-plural,proper-noun-posessive,suffix,family-name,idiom,affix&" +
        "hasDictionaryDef=true&includePartOfSpeech=noun&limit=2&maxLength=12&" +
        "api_key=" + config.wordnik;

    T = new Twit({
        consumer_key:         config.twitter_consumer_key
      , consumer_secret:      config.twitter_consumer_secret
      , access_token:         config.twitter_access_token
      , access_token_secret:  config.twitter_access_token_secret
    });

  });

  socket.on('searchTweets', function(data) {

    if (!getNounsURL || !T) {
      return;
    }

    restclient.get(getNounsURL, function(reply) {

      socket.emit('nounsReceived', reply);

      if (reply.length) {
        T.get('search/tweets', { q: reply[0].word + ' since:2013-10-01', count: 1 }, function(err, reply) {
          socket.emit('tweetsSearched', reply);
        })
      }

    }, 'json');

  });
});
