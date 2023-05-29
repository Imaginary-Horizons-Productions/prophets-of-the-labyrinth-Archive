const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addBlock, removeModifier, addModifier } = require('../combatantDAO.js');

module.exports = new EquipmentTemplate("Scutum", "Grant @{block} block to an ally and yourself and gain @{mod1Stacks} @{mod1}", "Block x@{critBonus}", "Fire", effect, ["Heavy Scutum", "Sweeping Scutum"])
	.setCategory("Armor")
	.setTargetingTags({ target: "single", team: "delver" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Vigilant", stacks: 1 }])
	.setCost(200)
	.setUses(10)
	.setBlock(75);

function effect([target], user, isCrit, adventure) {
	let { element, modifiers: [elementStagger, vigilant], block, critBonus } = module.exports;
	if (user.element === element) {
		removeModifier(target, elementStagger);
	}
	if (isCrit) {
		block *= critBonus;
	}
	addBlock(target, block);
	addBlock(user, block);
	addModifier(user, vigilant);
	return "";
}
