const Weapon = require('../../Classes/Weapon.js');
const { takeDamage } = require("../combatantDAO.js");

module.exports = new Weapon("dagger", "An attack that deals extra damage on a critical hit (crit: even more damage)", "wind", effect)
	.setTargetingTags({ target: "single", team: "enemy" })
	.setUses(10);

function effect(target, user, isCrit, element, adventure) {
	let damage = 100;
	if (isCrit) {
		damage *= 3;
	}
	return takeDamage(target, damage, element, adventure);
}
