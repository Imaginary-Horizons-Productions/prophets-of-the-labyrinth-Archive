const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addBlock, removeModifier } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Barrier", "Grant an ally @{block} block", "Block x@{critBonus}", "Fire", effect)
	.setCategory("Spell")
	.setTargetingTags({ target: "single", team: "delver" })
	.setUpgrades("Purifiying Barrier", "Thick Barrier", "Urgent Barrier")
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(200)
	.setUses(1)
	.setBlock(1000);

function effect([target], user, isCrit, adventure) {
	let { element, modifiers: [elementStagger], block, critBonus } = module.exports;
	if (user.element === element) {
		removeModifier(user, elementStagger);
	}
	if (isCrit) {
		block *= critBonus;
	}
	addBlock(target, block);
	return `Damage will be blocked for ${target.getName(adventure.room.enemyIdMap)}.`;
}
