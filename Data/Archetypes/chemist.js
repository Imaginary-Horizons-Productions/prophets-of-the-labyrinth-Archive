const Archetype = require("../../Classes/Archetype.js");

module.exports = new Archetype("Chemist")
	.setElement("Water")
	.setPredictType("Health")
	.setSignatureWeapons(["Hunter's Sickle", "Unfinished Potion"]);
