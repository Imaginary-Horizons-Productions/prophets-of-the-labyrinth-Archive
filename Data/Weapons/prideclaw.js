const Weapon = require('../../Classes/Weapon.js');
const { takeDamage } = require('../combatantDAO.js');

module.exports = new Weapon("prideclaw", "Deal a large amount of damage that won't strike elemental weakness (crit: more damage)", "element", effect)
	.setUses(10);

function effect(target, user, isCrit, element, adventure) {
	let damage = 150;
	if (isCrit) {
		damage *= 2;
	}
	return takeDamage(target, damage, "untyped", adventure);
}
