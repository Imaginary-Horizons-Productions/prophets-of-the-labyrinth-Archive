const Room = require("../../Classes/Room.js");
const { enemyDictionary } = require("../Enemies/_enemyDictionary.js");

module.exports = new Room("battle", "Combat", "This brute is looking for a fight.")
    .addEnemy(enemyDictionary["brute"]);
