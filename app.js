var connect = require('connect'),
    io = require('socket.io').listen(1337),
    Twit = require('twit');

connect(connect.static(__dirname + '/public')).listen(8000);

var T = new Twit({
    consumer_key:         '...'
  , consumer_secret:      '...'
  , access_token:         '...'
  , access_token_secret:  '...'
})

io.sockets.on('connection', function(socket) {
  socket.on('setData', function(data) {


    socket.emit('dataSet', {id: data.id});
  });
});
