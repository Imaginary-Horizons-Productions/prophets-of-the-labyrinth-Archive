const Weapon = require('../../Classes/Weapon.js');
const { takeDamage } = require("../combatantDAO.js");

module.exports = new Weapon("icespear", "A high damage attack with low durability (crit: more damage)", "water", effect)
	.setUses(3);

function effect(target, user, isCrit, element, adventure) {
	let damage = 200;
	if (isCrit) {
		damage *= 2;
	}
	return takeDamage(target, damage, element, adventure);
}
