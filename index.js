var Game = require('./game.js');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var games = {};

var token = "LL6Jo1Y1Z6KYcGQNMpQpv6n8";
var teamID = "T2GQDU57C";

var userToken = "xoxp-84829957250-84812860336-89507551990-8f567ead26de8d5e4ef8571a50228cef";

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.post('/tictactoe', function(request, response) {
  var body = request.body;
  var channel = body.channel;
  var message = body.text;

  if (!isValid(body)) {
    throw err;
  }
  if (isUser(message)) {
    if (channel in games) {
      response.send("This channel already has a game!");
    } else {
      // Remove '@' symbol.
      var challengedUser = message.slice(1);
      if (challengedUser === body.user_name) {
        response.send("You can't play against yourself!");
      }
      games[channel] = new Game(challengedUser, body.user_name);
      sendChannelResponse(response, games[channel].toString());
    }
  }
  else if (isHelp(message)) {
    response.send('```Welcome to Tic Tac Toe! Here are the available ' + 
      'commands:\n/ttt [@user] - to start a game\n/ttt [0-2] [0-2] - to' +
      ' make a move\n/ttt forfeit - to forfeit the game```');
  }
  else if (!(channel in games)) {
    response.send('This channel does not have a game! Use /ttt [@user] to ' + 
      'start a game.');
  }
  else if (!validUser(games[channel], body.user_name)) {
    response.send('You aren\'t in this game.');
  }
  else if (isMove(message)) {
    var move = parseMove(message);
    updateGame(move, body.user_name, games[channel], channel, response);
  }
  else if (isStatus(message)) {
    sendChannelResponse(response, games[channel].toString());
  }
  else if (isForfeit(message)) {
    sendChannelResponse(response, games[channel].forfeit(body.user_name)); 
    delete games[channel];    
  } else {
    response.send('Unrecognized command. Please type /ttt help for instructions.');
  }
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

var isValid = function(body) {
  return body.command == '/ttt' && body.token === token;
}

var isUser = function(message) {
  return message[0] === '@' && message.split(' ').length === 1;
}

var isHelp = function(message) {
  return message === 'help';
}

var validUser = function(game, user) {
  return game.isValidUser(user);
}

var isMove = function(message) {
  var move = message.split(' ');
  validRow = move[0] === '0' || move[0] === '1' || move[0] === '2';
  validCol = move[1] === '0' || move[1] === '1' || move[1] === '2';
  return move.length == 2 && validRow && validCol;
}

var parseMove = function(message) {
  var move = message.split(' ');
  var row = parseInt(move[0]);
  var col = parseInt(move[1]);
  return [row, col];
}

var isStatus = function(message) {
  return message === 'status';
}

var isForfeit = function(message) {
  return message === 'forfeit';
}

// Update the game state and send response accordingly.
var updateGame = function(move, player, game, channel, response) {
  if (!game.isPlayersTurn(player)) {
    response.send('It\'s not your turn!');
    return;
  }
  if (!game.isValidMove(move)) {
    response.send('Invalid move!');
    return
  }

  game.move(move, player);
  sendChannelResponse(response, game.toString());
  if (game.over) {
    delete games[channel];
  }
}

// Send an in_channel response.
var sendChannelResponse = function(response, string) {
  var message = {
    'text': string,
    'response_type': 'in_channel'
  }
  response.send(message);
}


