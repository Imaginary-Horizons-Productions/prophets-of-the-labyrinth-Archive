const Weapon = require('../../Classes/Weapon.js');
const { addBlock, removeModifier, getFullName } = require('../combatantDAO.js');
const { isDebuff } = require('../Modifiers/_modifierDictionary.js');

module.exports = new Weapon("Purifying Barrier", 2, "*Grant an ally @{block} block and cure them of all debuffs*\nCritical Hit: Block x@{critBonus}", "Light", effect, ["Thick Barrier", "Urgent Barrier"])
	.setTargetingTags({ target: "single", team: "delver" })
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setCost(350)
	.setUses(1);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, modifiers: [elementStagger], block, critBonus } = module.exports;
	if (user.element === weaponElement) {
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
