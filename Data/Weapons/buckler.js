const Weapon = require('../../Classes/Weapon.js');

module.exports = new Weapon("buckler", "Reduce damage a character takes next round (crit: more shield)", "earth", effect)
	.setUses(10);

function effect(target, user, isCrit, element, adventure) {
	let block = 75;
	if (isCrit) {
		damage *= 2;
	}
	target.addBlock(block);
	return "";
}
