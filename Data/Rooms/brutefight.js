const Room = require("../../Classes/Room.js");

module.exports = new Room("battle", "Combat", "This brute is looking for a fight.")
    .addEnemy("brute", 1);
