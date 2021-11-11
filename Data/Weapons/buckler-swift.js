const Weapon = require('../../Classes/Weapon.js');
const { addBlock, removeModifier, addModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Swift Buckler", "Reduce damage a combatant takes next round, then gain Quicken (crit: more shield)", "Earth", effect, [])
	.setTargetingTags({ target: "single", team: "ally" })
	.setUses(10);

function effect(target, user, isCrit, element, adventure) {
	let block = 75;
	if (user.element === element) {
		removeModifier(target, "Stagger", 1);
	}
	if (isCrit) {
		block *= 2;
	}
	addBlock(target, block);
	addModifier(user, "Quicken", 2);
	return "";
}
