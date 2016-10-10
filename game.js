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
  var cellValue = player === this.playerX ? -1 : 1;
  var win = false;
  for (var i = 0; i < DIMENSION; i++) {
    // Check horizontal row i.
    win = win || this.isInARow([i, 0], [0, 1], cellValue);

    // Check vertical column i.
    win = win || this.isInARow([0, i], [1, 0], cellValue);
  }
  // Check diagonals.
  win = win || this.isInARow([0, 0], [1, 1], cellValue);
  win = win || this.isInARow([2, 0], [-1, 1], cellValue);
  return win;
}

// Check a given direction for a win.
Game.prototype.isInARow = function(start, vector, cellValue) {
  for (var i = 0; i < DIMENSION; i++) {
    var row = start[0] + i * vector[0];
    var col = start[1] + i * vector[1];
    if (this.board[row][col] !== cellValue) {
      return false;
    }
  }
  return true;
}

// Check if the move can be made.
Game.prototype.isValidMove = function(move) {
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
  var row = move[0];
  var col = move[1];
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
  output += '| ' + this.cell(0, 0) + ' | ' + this.cell(0, 1) + ' | ' +
    this.cell(0, 2) + ' |\n|---+---+---|\n';
  output += '| ' + this.cell(1, 0) + ' | ' + this.cell(1, 1) + ' | ' +
    this.cell(1, 2) + ' |\n|---+---+---|\n';
  output += '| ' + this.cell(2, 0) + ' | ' + this.cell(2, 1) + ' | ' +
    this.cell(2, 2) + ' |\n';
  if (this.over) {
    output += 'Game over! Winner: ' + this.winner;
  } else {
    output += (this.xTurn ? this.playerX : this.playerO) + '\'s turn';
  }
  output += '```';
  return output;
}

Game.prototype.cell = function(row, col) {
  switch (this.board[row][col]) {
    case -1:
      return 'X';
    case 0:
      return '-';
    case 1:
      return 'O';
    default:
      throw err;
  }

}

// Update game state to reflect player's forfeit.
Game.prototype.forfeit = function(player) {
  this.over = true;
  this.winner = player === this.playerX ? this.playerO : this.playerX;
  return this.toString();
}

module.exports = Game;