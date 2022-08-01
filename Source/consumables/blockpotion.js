const ConsumableTemplate = require("../../Classes/ConsumableTemplate.js");
const { addBlock } = require("../combatantDAO.js");

module.exports = new ConsumableTemplate("Block Potion", "Adds 50 block to all allies", selectTargets, effect)
	.setElement("Untyped")
	.setTargetTags("all", "delver")
	.setFlavorText([]);

function selectTargets(userIndex, adventure) {
	// all allies
	return adventure.delvers.map((delver, index) => ["delver", index]);
}

function effect(target, user, isCrit, adventure) {
	// +50 block
	return addBlock(target, 50);
}
