const Archetype = require("../../Classes/Archetype.js");

module.exports = new Archetype("Chemist")
	.setElement("Water")
	.setPredictType("Health")
	.setDescription("Able to and assess combatant elemental affinities and hp levels, the Chemist excels at managing party and enemy health.")
	.setSignatureWeapons(["Sickle", "Unfinished Potion"]);
