const Archetype = require("../../Classes/Archetype.js");

module.exports = new Archetype("Chemist")
	.setElement("Water")
	.setPredictType("Health")
	.setDescription("Able to and assess combatant modifiers and hp levels, the Chemist excels at managing party and enemy health.")
	.setSignatureEquipment(["Sickle", "Unfinished Potion"]);
