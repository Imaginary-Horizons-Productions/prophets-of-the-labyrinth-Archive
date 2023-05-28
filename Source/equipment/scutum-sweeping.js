const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addBlock, removeModifier } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Sweeping Scutum", "Grant @{block} block to all allies (including yourself)", "Block x@{critBonus}", "Fire", effect, ["Heavy Scutum"])
	.setCategory("Armor")
	.setTargetingTags({ target: "all", team: "delver" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(10)
	.setBlock(75);

function effect(targets, user, isCrit, adventure) {
	let { element, modifiers: [elementStagger], block, critBonus } = module.exports;
	if (isCrit) {
		block *= critBonus;
	}
	addBlock(user, block);
	targets.forEach(target => {
		if (user.element === element) {
			removeModifier(target, elementStagger);
		}
		addBlock(target, block);
	})
	return "";
}
