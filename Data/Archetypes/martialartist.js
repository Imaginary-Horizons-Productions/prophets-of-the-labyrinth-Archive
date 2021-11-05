const Archetype = require("../../Classes/Archetype.js");

module.exports = new Archetype("Martial Artist")
	.setElement("light") // enum: "fire", "water", "earth", "wind", "light", "dark"
	.setReadType("stagger") // enum: "targets", "weaknesses", "health", "speed", "stagger"
	.setSignatureWeapons(["Spear", "Barrier"]); // keys in weaponDictionary
