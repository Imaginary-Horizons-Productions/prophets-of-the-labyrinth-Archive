const ConsumableTemplate = require("../../Classes/ConsumableTemplate.js");
const { addBlock } = require("../combatantDAO.js");
const { selectAllAllies } = require("./selectors/selectAllAllies.js");

module.exports = new ConsumableTemplate("Block Potion", "Adds 50 block to all allies", selectAllAllies, effect)
	.setElement("Untyped")
	.setTargetTags("all", "delver")
	.setFlavorText([]);

function effect([target], user, isCrit, adventure) {
	// +50 block
	addBlock(target, 50);
	return `${user.getName()} prepares to Block.`;
}
