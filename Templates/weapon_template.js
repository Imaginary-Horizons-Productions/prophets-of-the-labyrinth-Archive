const Weapon = require('../../Classes/Weapon.js');

module.exports = new Weapon("name", "description", "element", effect)
	.setUses();

function effect(target, user, isCrit, element, adventure) {
	return ""; // result as text
}
