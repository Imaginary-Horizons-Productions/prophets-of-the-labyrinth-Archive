const Weapon = require('../../Classes/Weapon.js');

module.exports = new Weapon("buckler", "Reduce damage a character takes next round", "earth", effect)
	.setUses(10);

function effect(target, user, isCrit, element, adventure) {
	target.addBlock(10);
	return "";
}
