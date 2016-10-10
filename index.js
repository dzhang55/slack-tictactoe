var Game = require('./game.js');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var games = {};

var token = "LL6Jo1Y1Z6KYcGQNMpQpv6n8";

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.post('/tictactoe', function(request, response) {
  var body = request.body;
  var message = body.text;
  console.log(body);
  //console.log(message);
  if (body.token != token) {
    throw err;
  }
  if (isUser(message)) {
    if (body.channel in games) {
      response.send("This channel already has a game!");
    } else {
      // Remove '@' symbol.
      var challengedUser = message.slice(1);
      games[channel] = new Game(challengedUser, body.user_name);
      response.send(games[channel].toString());
      // challenge user to game
    }
  }
  else if (isHelp(message)) {
    // send instructions
  }
  else if (isMove(message)) {
    if (body.channel in games) {
      var move = parseMove(message);
      updateBoard(move, body.user_id, games[channel], response);
    } else {
      response.send('This channel does not have a game!');
    }

    // update boards[body.channel]
  }
  else if (isStatus(message)) {
    //response.send(status);
  } else {
    response.send('Unrecognized command. Please type /ttt help for instructions.');
  }

});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

var isUser = function(message) {
  return false;
}

var getUser = function(username) {
  var payload = {
    'token': token,
    'user': username
  };
  r = requests.get('https://slack.com/api/users.info', params=payload)
}

var isHelp = function(message) {
  return message === 'help';
}

var isMove = function(message) {
  var move = message.split(' ');
  validRow = move[0] === '0' || move[0] === '1' || move[0] === '2';
  validCol = move[1] === '0' || move[1] === '1' || move[1] === '2';
  return move.length == 2 && validRow && validCol;
}

var parseMove = function(message) {
  row, col = message.split(' ');
  return [parseInt(row), parseInt(col)];
}

var isStatus = function(message) {
  return message === 'status';
}

var updateBoard = function(move, player, game, response) {
  if (player !== game.turn) {
    response.send('It\'s not your turn!');
    return;
  }

  game.move(move, player);
  if (game.over()) {
    // send game over
  } else {
    // send board and turn
  }
}


