const Weapon = require('../../Classes/Weapon.js');

module.exports = new Weapon("name", "description", "element", effect)
	.setUses();

function effect(target, user, isCrit, element, adventure) {
	if (isCrit) {

	}
	return ""; // result as text
}
