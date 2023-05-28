const Archetype = require("../../Classes/Archetype.js");

module.exports = new Archetype("Knight")
	.setElement("Earth")
	.setPredictType("Intents")
	.setDescription("Able to predict which allies enemies are targeting with which moves, the Knight excels at efficiently mitigating damage.")
	.setSignatureEquipment(["Lance", "Buckler"]);
