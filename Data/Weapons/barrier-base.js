const Weapon = require('../../Classes/Weapon.js');
const { addBlock, removeModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Barrier", "Block an immense amount of damage once (crit: more block)", "Light", effect, ["Purifiying Barrier", "Thick Barrier"])
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
	return ""; // result as text
}
