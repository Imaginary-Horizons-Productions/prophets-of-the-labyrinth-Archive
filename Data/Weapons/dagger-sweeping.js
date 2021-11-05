const Weapon = require('../../Classes/Weapon.js');
const { addModifier, dealDamage } = require('../combatantDAO.js');

module.exports = new Weapon("Sweeping Daggers", "Throw knives at all enemies (crit: more damage)", "wind", effect, [])
	.setTargetingTags({ target: "all", team: "enemy" }) // tagObject {target: ["single", "all", "random", "self"], team: ["ally", "enemy", "any"]}
	.setUses(10);

function effect(target, user, isCrit, element, adventure) {
	let damage = 25;
	if (user.element === element) {
		addModifier(target, "Stagger", 1);
	}
	if (isCrit) {
		damage *= 2;
	}
	return dealDamage(target, user, damage, element, adventure);
}
