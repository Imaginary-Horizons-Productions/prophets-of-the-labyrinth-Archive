const Weapon = require('../../Classes/Weapon.js');
const { dealDamage } = require('../combatantDAO.js');

module.exports = new Weapon("fanofknives", "Throw knives at all enemies (crit: more damage)", "wind", effect)
	.setTargetingTags({ target: "all", team: "enemy" }) // tagObject {target: ["single", "all", "random", "self"], team: ["ally", "enemy", "any"]}
	.setUses(10);

function effect(target, user, isCrit, element, adventure) {
	let damage = 25;
	if (user.element === element) {
		damage *= 1.5;
	}
	if (isCrit) {
		damage *= 2;
	}
	return dealDamage(target, damage, element, adventure);
}
