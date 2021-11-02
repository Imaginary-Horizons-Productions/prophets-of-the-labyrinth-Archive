const Weapon = require('../../Classes/Weapon.js');
const { dealDamage } = require("../combatantDAO.js");

module.exports = new Weapon("Dagger", "An attack that deals extra damage on a critical hit (crit: even more damage)", "wind", effect, ["Wicked Dagger", "Sharpened Dagger"])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setUses(10);

function effect(target, user, isCrit, element, adventure) {
	let damage = 100;
	if (user.element === element) {
		damage *= 1.5;
	}
	if (isCrit) {
		damage *= 3;
	}
	return dealDamage(target, user, damage, element, adventure);
}
