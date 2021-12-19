const Archetype = require("../../Classes/Archetype.js");

module.exports = new Archetype("Hemomancer")
	.setElement("Darkness")
	.setPredictType("Move Order")
	.setDescription("Able to predict the order combatants will act, the Hemomancer excels at getting the last word.")
	.setSignatureWeapons(["Spell: Life Drain", "Spell: Blood Aegis"]);
