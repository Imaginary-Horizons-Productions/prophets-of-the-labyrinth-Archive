const Archetype = require("../../Classes/Archetype.js");

module.exports = new Archetype("name")
	.setElement("") // enum: "Fire", "Water", "Earth", "Wind"
	.setPredictType("") // enum: "Movements", "Vulnerabilities", "Intents", "Health"
	.setDescription("")
	.setSignatureEquipment([]); // keys in equipmentDictionary
