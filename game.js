var DIMENSION = 3;

var Game = function(playerX, playerO) {
	this.playerX = playerX;
	this.playerO = playerO;
	this.board = new Array(DIMENSION);
  for (var i = 0; i < DIMENSION; i++) {
    this.board[i] = new Array(DIMENSION);
    for (var j = 0; j < DIMENSION; j++) {
      this.board[i][j] = 0;
    }
  }
  this.sentStartMessage = false;
  this.xTurn = false;
  this.numMoves = 0;
  this.over = false;
  this.winner;
}

// Check if a player won the game.
Game.prototype.didPlayerWin = function(player) {
  var win = false;
  for (var i = 0; i < DIMENSION; i++) {
    // Check horizontal row i.
    win = win || isInARow([i, 0], [1, 0], player);

    // Check vertical column i.
    win = win || isInARow([0, i], [0, 1], player);
  }
  // Check diagonals.
  win = win || isInARow([0, 0], [1, 1], player);
  win = win || isInARow([2, 0], [-1, -1], player);
  return win;
}

// Check a given direction for a win.
Game.prototype.isInARow = function(start, vector, player) {
  for (var i = 0; i < DIMENSION; i++) {
    var row = start[0] + i * vector[0];
    var col = start[1] + i * vector[1];
    if (this.board[row][col] !== player) {
      return false;
    }
  }
  return true;
}

// Check if the move can be made.
Game.prototype.validMove = function(move) {
  var row = parseInt(move[0]);
  var col = parseInt(move[1]);
  if (row < 0 || row > DIMENSION - 1 || col < 0 || col > DIMENSION - 1) {
    return false;
  }
  return this.board[row][col] === 0;
}

// Check if the user is in the game.
Game.prototype.isValidUser = function(user) {
  return user === this.playerX || user === this.playerO;
}

// Check if it is this player's turn.
Game.prototype.isPlayersTurn = function(player) {
  return this.xTurn ? player === this.playerX : player === this.playerO;
}

// Make a move and check win conditions.
Game.prototype.move = function(move, player) {
  this.numMoves++;
  if (player === this.playerX) {
    this.board[row][col] = -1;
  }
  else if (player === this.playerO) {
    this.board[row][col] = 1;
  }
  if (this.didPlayerWin(player)) {
    this.over = true;
    this.winner = player;
  }
  else if (this.numMoves === DIMENSION * DIMENSION) {
    this.over = true;
    this.winner = 'TIE';
  } else {
    this.xTurn = !this.xTurn;
  }
}

Game.prototype.over = function() {
  return this.over;
}

// Output a string representation of the game state.
Game.prototype.toString = function() {
  var output = '```';
  if (!this.sentStartMessage) {
    output += 'Welcome to Tic Tac Toe!\n';
    this.sentStartMessage = true;
  }
  output += '| X | O | O |\n|---+---+---|\n| O | X | X |\n|---+---+---|\n' + 
    '| X | O | X |\n';
  if (this.over) {
    output += 'Game over! Winner: ' + this.winner;
  } else {
    output += this.xTurn ? this.playerX : this.playerO + '\'s turn';
  }
  output += '```';
  return output;
}

// Update game state to reflect player's forfeit.
Game.prototype.forfeit = function(player) {
  this.over = true;
  this.winner = player === this.playerX ? this.playerO : this.playerX;
  return this.toString();
}

module.exports = Game;