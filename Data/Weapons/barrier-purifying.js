const Weapon = require('../../Classes/Weapon.js');
const { addBlock, removeModifier, getFullName } = require('../combatantDAO.js');
const { isDebuff } = require('../Modifiers/_modifierDictionary.js');

module.exports = new Weapon("Purifying Barrier", "*Grant an ally @{block} block and cure them of all debuffs*\nCritical Hit: Block x@{critMultiplier}", "Light", effect, [])
	.setTargetingTags({ target: "single", team: "ally" })
	.setUses(1);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, block, critMultiplier } = module.exports;
	if (user.element === weaponElement) {
		removeModifier(user, "Stagger", 1);
	}
	if (isCrit) {
		block *= critMultiplier;
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
