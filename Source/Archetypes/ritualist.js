const Archetype = require("../../Classes/Archetype.js");

module.exports = new Archetype("Ritualist")
	.setElement("Fire")
	.setPredictType("Health")
	.setDescription("Able to divine the health and state of all combatants, the Ritualist punishes foes that dare play against destiny.")
	.setSignatureEquipment(["Censer", "Corrosion"]);
