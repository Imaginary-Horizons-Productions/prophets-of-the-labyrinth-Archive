const Archetype = require("../../Classes/Archetype.js");

module.exports = new Archetype("Martial Artist")
	.setElement("Wind")
	.setPredictType("Movements")
	.setDescription("Able to assess combatant Stun thresholds and speed, the Martial Artist excels at stunning foes.")
	.setSignatureEquipment(["Spear", "Sun Flare"]);
