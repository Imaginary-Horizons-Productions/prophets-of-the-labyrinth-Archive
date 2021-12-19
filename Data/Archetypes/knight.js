const Archetype = require("../../Classes/Archetype.js");

module.exports = new Archetype("Knight")
	.setElement("Earth")
	.setPredictType("Targets")
	.setDescription("Able to predict which allies enemies are targeting, and assess combatant elemental resistances, the Knight excels at efficiently mitigating damage.")
	.setSignatureWeapons(["Sword", "Buckler"]);
