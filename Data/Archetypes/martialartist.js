const Archetype = require("../../Classes/Archetype.js");

module.exports = new Archetype("Martial Artist")
	.setElement("Light")
	.setPredictType("Modifiers")
	.setDescription("Able to assess combatant Stun thresholds and modifiers, the Martial Artist excels at stunning foes.")
	.setSignatureWeapons(["Spear", "Spell: Sun Flare"]);
