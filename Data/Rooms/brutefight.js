const Room = require("../../Classes/Room.js");
const { enemyDictionary } = require("../Enemies/_enemyDictionary.js");

var room = new Room("battle", "Combat", "This brute is looking for a fight.")
    .addEnemy(enemyDictionary["brute"]);

module.exports = room;
