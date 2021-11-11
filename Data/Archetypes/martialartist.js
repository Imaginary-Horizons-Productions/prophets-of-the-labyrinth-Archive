const Archetype = require("../../Classes/Archetype.js");

module.exports = new Archetype("Martial Artist")
	.setElement("Light")
	.setPredictType("Modifiers")
	.setSignatureWeapons(["Spear", "Barrier"]); // keys in weaponDictionary
