const Weapon = require('../../Classes/Weapon.js');
const { takeDamage } = require('../combatantDAO.js');

module.exports = new Weapon("fanofknives", "description", "wind", effect)
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
	return takeDamage(target, damage, element, adventure);
}
