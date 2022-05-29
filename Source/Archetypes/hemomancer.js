const Archetype = require("../../Classes/Archetype.js");

module.exports = new Archetype("Hemomancer")
	.setElement("Water")
	.setPredictType("Movements")
	.setDescription("Able to predict the order combatants will act and their Stun thresholds, the Hemomancer excels at getting the last word.")
	.setSignatureEquipment(["Life Drain", "Blood Aegis"]);
