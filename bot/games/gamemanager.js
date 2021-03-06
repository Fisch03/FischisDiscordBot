const labyrinth = require('./labyrinth.js')

let gameID = 0;
const gamesTable = ["none", "labyrinth"]
/**
0 = No Game
1 = Labyrinth
**/

module.exports.init = function(args, channel) {
  let game = args[0];
  switch(game.toLowerCase()) {
    case "labyrinth":
      gameID = 1;
      labyrinth.init(channel, args[1]);
    break;
  }
}

module.exports.kill = function() {
  gameID = 0;
  labyrinth.kill();
}

module.exports.handlereact = function(reaction) {
  if(gameID != 0) {
    eval(gamesTable[gameID] + ".react(reaction)");
  }
}
