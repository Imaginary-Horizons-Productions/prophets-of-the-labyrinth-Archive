const Archetype = require("../../Classes/Archetype.js");

module.exports = new Archetype("Ritualist")
	.setElement("Fire")
	.setPredictType("Enemy Moves")
	.setDescription("Able to divine the moves of foes, the Ritualist punishes foes that dare play against destiny.")
	.setSignatureWeapons(["Censer", "Spell: Sun Flare"]);
