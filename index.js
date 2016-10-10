var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var index = 0;

var token = "LL6Jo1Y1Z6KYcGQNMpQpv6n8";

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
  extended: true
}));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.post('/tictactoe', function(request, response) {
  index++;
  console.log(index);
  response.send("hello " + index);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


