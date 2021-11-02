const Weapon = require('../../Classes/Weapon.js');
const { addBlock } = require('../combatantDAO.js');

module.exports = new Weapon("buckler", "Reduce damage a combatant takes next round (crit: more shield)", "earth", effect, [])
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
	return "";
}
