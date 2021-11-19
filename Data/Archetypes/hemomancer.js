const Archetype = require("../../Classes/Archetype.js");

module.exports = new Archetype("Hemomancer")
	.setElement("Darkness") // enum: "Fire", "Water", "Earth", "Wind", "Light", "Darkness"
	.setPredictType("Move Order") // enum: "Targets", "Critical Hits", "Health", "Move Order", "Modifiers"
	.setSignatureWeapons(["Spell: Life Drain", "Spell: Blood Aegis"]); // keys in weaponDictionary
