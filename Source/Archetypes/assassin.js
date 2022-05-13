const Archetype = require("../../Classes/Archetype.js");

module.exports = new Archetype("Assassin")
	.setElement("Wind")
	.setPredictType("Vulnerabilities")
	.setDescription("Able to predict which combatants will critically hit, and assess combatant elemental weaknesses, the Assassin excels at dealing great amounts of damage.")
	.setSignatureEquipment(["Daggers", "Cloak"]);
