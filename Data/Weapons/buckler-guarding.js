const Weapon = require('../../Classes/Weapon.js');
const { addBlock } = require('../combatantDAO.js');

module.exports = new Weapon("Guarding Buckler", "Reduce damage a combatant and the user takes next round (crit: more shield)", "earth", effect, [])
	.setTargetingTags({ target: "single", team: "ally" })
	.setUses(10);

function effect(target, user, isCrit, element, adventure) {
	let block = 75;
	if (user.element === element) {
		block *= 1.5;
	}
	if (isCrit) {
		block *= 2;
	}
	addBlock(target, block);
	addBlock(user, block);
	return "";
}
