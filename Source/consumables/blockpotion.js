const ConsumableTemplate = require("../../Classes/ConsumableTemplate.js");
const { addBlock } = require("../combatantDAO.js");
const { needsLivingTargets } = require("../enemyDAO.js");
const { selectAllAllies } = require("./selectors/selectAllAllies.js");

module.exports = new ConsumableTemplate("Block Potion", "Adds 50 block to all allies", selectAllAllies, needsLivingTargets(effect))
	.setElement("Untyped")
	.setCost(30)
	.setTargetTags("all", "delver")
	.setFlavorText([]);

function effect([target], user, isCrit, adventure) {
	// +50 block
	addBlock(target, 50);
	return `${user.getName(adventure.room.enemyIdMap)} prepares to Block.`;
}
