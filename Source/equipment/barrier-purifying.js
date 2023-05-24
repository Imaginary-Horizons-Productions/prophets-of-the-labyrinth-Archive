const EquipmentTemplate = require('../../Classes/EquipmentTemplate.js');
const { addBlock, removeModifier, getFullName } = require('../combatantDAO.js');
const { isDebuff } = require('../Modifiers/_modifierDictionary.js');

module.exports = new EquipmentTemplate("Purifying Barrier", "Grant an ally @{block} block and cure them of all debuffs", "Block x@{critBonus}", "Fire", effect, ["Thick Barrier", "Urgent Barrier"])
	.setCategory("Spell")
	.setTargetingTags({ target: "single", team: "delver" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(1);

function effect([target], user, isCrit, adventure) {
	let { element, modifiers: [elementStagger], block, critBonus } = module.exports;
	if (user.element === element) {
		removeModifier(user, elementStagger);
	}
	if (isCrit) {
		block *= critBonus;
	}
	addBlock(target, block);
	let debuffs = [];
	for (let modifier in target.modifiers) {
		if (isDebuff(modifier)) {
			delete target.modifiers[modifier];
			debuffs.push(modifier);
		}
	}
	return `${getFullName(target, adventure.room.enemyTitles)} is relieved of ${debuffs.join(", ")}.`; // result as text
}
