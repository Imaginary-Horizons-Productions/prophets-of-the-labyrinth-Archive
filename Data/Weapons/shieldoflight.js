const Weapon = require('../../Classes/Weapon.js');
const { addBlock } = require('../combatantDAO.js');

module.exports = new Weapon("shieldoflight", "Block an immense amount of damage once (crit: more block)", "light", effect)
	.setTargetingTags({ target: "self", team: "ally" })
	.setUses(1);

function effect(target, user, isCrit, element, adventure) {
	let block = 1000;
	if (user.element === element) {
		block *= 1.5;
	}
	if (isCrit) {
		block *= 2;
	}
	addBlock(user, block);
	return ""; // result as text
}
