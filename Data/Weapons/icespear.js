const Weapon = require('../../Classes/Weapon.js');
const { dealDamage, addModifier } = require("../combatantDAO.js");

module.exports = new Weapon("icespear", "A high damage attack with low durability (crit: more damage)", "Water", effect, [])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setUses(3);

function effect(target, user, isCrit, element, adventure) {
	let damage = 200;
	if (user.element === element) {
		addModifier(target, "Stagger", 1);
	}
	if (isCrit) {
		damage *= 2;
	}
	return dealDamage(target, user, damage, element, adventure);
}
