const Archetype = require("../../Classes/Archetype.js");

module.exports = new Archetype("Legionnaire")
	.setElement("Fire")
	.setPredictType("Intents")
	.setDescription("Able to predict the moves and targets of enemies, the Legionnaire excels at controlling the flow of combat.")
	.setSignatureEquipment(["Shortsword", "Scutum"]);
