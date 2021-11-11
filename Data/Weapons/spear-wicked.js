const Weapon = require('../../Classes/Weapon.js');
const { dealDamage, addModifier } = require("../combatantDAO.js");

module.exports = new Weapon("Wicked Spear", "An attack that inflicts stagger and increased damage on a crit (crit: Stagger and more damage)", "Light", effect, [])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setUses(10);

function effect(target, user, isCrit, element, adventure) {
	let damage = 100;
	if (user.element === element) {
		addModifier(target, "Stagger", 1);
	}
	if (isCrit) {
		damage *= 2;
		addModifier(target, "Stagger", 1);
	}
	return dealDamage(target, user, damage, element, adventure);
}
