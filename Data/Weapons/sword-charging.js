const Weapon = require('../../Classes/Weapon.js');
const { dealDamage, addModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Charging Sword", "Deal additional damage to a target if not blocking, then gain power (crit: more damage)", "earth", effect, [])
	.setTargetingTags({ target: "single", team: "enemy" }) // tagObject {target: ["single", "all", "random", "self"], team: ["ally", "enemy", "any", "self"]}
	.setUses(5);

function effect(target, user, isCrit, element, adventure) {
	let damage = 75;
	if (user.block === 0) {
		damage = 150;
	}
	if (user.element === element) {
		addModifier(target, "Stagger", 1);
	}
	if (isCrit) {
		damage *= 2;
	}
	addModifier(user, "powerup", 25);
	return dealDamage(target, user, damage, element, adventure); // result text
}
