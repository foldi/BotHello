var connect = require('connect'),
    io = require('socket.io').listen(1337),
    Twit = require('twit'),
    restclient = require('node-restclient'),
    sys = require("sys");

connect(connect.static(__dirname + '/public')).listen(8000);

// insert your Wordnik API info below
var getNounsURL = "http://api.wordnik.com/v4/words.json/randomWords?" +
                  "minCorpusCount=1000&minDictionaryCount=10&" +
                  "excludePartOfSpeech=proper-noun,proper-noun-plural,proper-noun-posessive,suffix,family-name,idiom,affix&" +
                  "hasDictionaryDef=true&includePartOfSpeech=noun&limit=2&maxLength=12&" +
                  "api_key=";

var T = new Twit({
    consumer_key:         '...'
  , consumer_secret:      '...'
  , access_token:         '...'
  , access_token_secret:  '...'
})

io.sockets.on('connection', function(socket) {
  socket.on('searchTweets', function(data) {

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
