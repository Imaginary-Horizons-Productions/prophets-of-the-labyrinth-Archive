const Archetype = require("../../Classes/Archetype.js");

module.exports = new Archetype("name")
	.setElement("") // enum: "fire", "water", "earth", "wind", "light", "dark"
	.setPredictType("") // enum: "Targets", "Weaknesses", "Health", "Speed", "Modifiers"
	.setSignatureWeapons([]); // keys in weaponDictionary
