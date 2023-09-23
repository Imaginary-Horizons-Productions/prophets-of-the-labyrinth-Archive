const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addBlock, removeModifier } = require('../combatantDAO.js');
const { needsLivingTargets } = require('../enemyDAO.js');

module.exports = new EquipmentTemplate("Urgent Barrier", "Grant an ally @{block} block with priority", "Block x@{critBonus}", "Fire", needsLivingTargets(effect))
	.setCategory("Spell")
	.setTargetingTags({ target: "single", team: "delver" })
	.setSidegrades("Purifiying Barrier", "Thick Barrier")
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(5)
	.setBlock(1000)
	.setPriority(1);

function effect([target], user, isCrit, adventure) {
	let { element, modifiers: [elementStagger], block, critBonus } = module.exports;
	if (user.element === element) {
		removeModifier(user, elementStagger);
	}
	if (isCrit) {
		block *= critBonus;
	}
	addBlock(target, block);
	return `Damage will be Blocked for ${target.getName(adventure.room.enemyIdMap)}.`;
}
