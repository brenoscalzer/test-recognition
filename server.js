var express = require('express');
var path 	= require('path');
var open 	= require('open');
var app 	= express();

app.set('port', 3000);

app.use(express.static(path.join(__dirname, 'public')));

// Listen for requests
var server = app.listen(app.get('port'), function() {
  var port = server.address().port;
  console.log('Server started on port ' + port);
  open('http://127.0.0.1:3000');
});