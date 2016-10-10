const DIMENSION = 3;

var Game = function(playerX, playerO) {
	this.playerX = playerX;
	this.playerO = playerO;
	this.board = new Array[DIMENSION][DIMENSION];
  this.sentStartMessage = false;
  this.xTurn = false;
}

Game.prototype.didPlayerWin = function(player, board) {
  var win = false;
  for (var i = 0; i < DIMENSION; i++) {
    // Check horizontal row i.
    win = win || isInARow([i, 0], [1, 0], board, player);

    // Check vertical column i.
    win = win || isInARow([0, i], [0, 1], board, player);
  }
  // Check diagonals.
  win = win || isInARow([0, 0], [1, 1], board, player);
  win = win || isInARow([2, 0], [-1, -1], board, player);
  return win;
}

Game.prototype.isInARow = function(start, vector, board, player) {
  for (var i = 0; i < DIMENSION; i++) {
    var row = start[0] + i * vector[0];
    var col = start[1] + i * vector[1];
    if (board[row][col] != player) {
      return false;
    }
  }
  return true;
}

Game.prototype.toString = function() {
  var output = '```';
  if (!sentStartMessage) {
    output += 'Welcome to Tic Tac Toe!\n';
    sentStartMessage = true;
  }
  output += '| X | O | O |\n|---+---+---|\n| O | X | X |\n|---+---+---|\n' + 
    '| X | O | X |\n';
  output += this.xTurn ? this.playerX : this.playerO + '\'s turn';
  output += '```';
  return output;
}

module.exports = Game;