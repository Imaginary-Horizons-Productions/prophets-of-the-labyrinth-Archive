const Archetype = require("../../Classes/Archetype.js");

module.exports = new Archetype("Martial Artist")
	.setElement("light") // enum: "fire", "water", "earth", "wind", "light", "dark"
	.setPredictType("Modifiers")
	.setSignatureWeapons(["Spear", "Barrier"]); // keys in weaponDictionary
