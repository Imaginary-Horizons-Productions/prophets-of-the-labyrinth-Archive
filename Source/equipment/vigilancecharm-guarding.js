const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addModifier, removeModifier, addBlock } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Guarding Vigilance Charm", "Gain @{mod1Stacks} @{mod1} and @{block} block", "@{mod1} +@{bonus} and block x@{critBonus}", "Earth", effect, ["Long Vigilance Charm", "Guarding Vigilance Charm"])
	.setCategory("Trinket")
	.setTargetingTags({ target: "self", team: "self" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Vigilance", stacks: 3 }])
	.setBonus(2) // Vigilance stacks
	.setCost(350)
	.setBlock(60)
	.setUses(5);

function effect(targets, user, isCrit, adventure) {
	let { element, modifiers: [elementStagger, vigilance], bonus, block, critBonus } = module.exports;
	const pendingVigilance = { ...vigilance, stacks: vigilance.stacks + (isCrit ? bonus : 0) };
	if (user.element === element) {
		removeModifier(user, elementStagger);
	}
	addModifier(user, pendingVigilance);
	addBlock(user, block * (isCrit ? critBonus : 1))
	return `${user.getName(adventure.room.enemyIdMap)} gains Vigilance and prepares to Block.`;
}
