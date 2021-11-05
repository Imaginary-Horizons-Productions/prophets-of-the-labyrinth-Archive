const Archetype = require("../../Classes/Archetype.js");

module.exports = new Archetype("name")
	.setElement("") // enum: "fire", "water", "earth", "wind", "light", "dark"
	.setPredictType("") // enum: "targets", "weaknesses", "health", "speed", "stagger"
	.setSignatureWeapons([]); // keys in weaponDictionary
