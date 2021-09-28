const Weapon = require('../../Classes/Weapon.js');
const { takeDamage } = require("../combatantDAO.js");

module.exports = new Weapon("dagger", "An attack that deals extra damage on a critical hit", "wind", effect)
	.setUses(10);

function effect(target, user, isCrit, adventure) {
	let damage = 10;
	if (isCrit) {
		damage *= 3;
	}
	return takeDamage(target, damage, adventure);
}
