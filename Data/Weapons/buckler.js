const Weapon = require('../../Classes/Weapon.js');

module.exports = new Weapon("buckler", "Reduce damage a character takes next round (crit: more shield)", "earth", effect)
	.setTargetingTags({ target: "single", team: "ally" })
	.setUses(10);

function effect(target, user, isCrit, element, adventure) {
	let block = 75;
	if (user.element === element) {
		block = Math.ceil(block * 1.5);
	}
	if (isCrit) {
		block *= 2;
	}
	target.addBlock(block);
	return "";
}
