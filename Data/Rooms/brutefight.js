const Room = require("../../Classes/Room.js");

module.exports = new Room("battle", "Combat", "These brutes are looking for a fight.")
    .addEnemy("brute", 2);
