const Character = require("../../Classes/Character.js");

module.exports = new Character("name")
	.setElement("") // enum: "fire", "water", "earth", "wind", "light", "dark"
	.setReadType("") // enum: "targets", "weaknesses", "health", "speed", "stagger"
	.setSignatureWeapons([]); // keys in weaponDictionary
