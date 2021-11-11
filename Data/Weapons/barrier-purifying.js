const Weapon = require('../../Classes/Weapon.js');
const { addBlock, removeModifier, getFullName } = require('../combatantDAO.js');
const { isDebuff } = require('../Modifiers/_modifierDictionary.js');

module.exports = new Weapon("Purifying Barrier", "Block an immense amount of damage and remove all debuffs once (crit: more block)", "Light", effect, [])
	.setTargetingTags({ target: "single", team: "ally" })
	.setUses(1);

function effect(target, user, isCrit, element, adventure) {
	let block = 1000;
	if (user.element === element) {
		removeModifier(user, "Stagger", 1);
	}
	if (isCrit) {
		block *= 2;
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
