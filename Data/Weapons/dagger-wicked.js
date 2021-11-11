const Weapon = require('../../Classes/Weapon.js');
const { dealDamage, addModifier } = require("../combatantDAO.js");

module.exports = new Weapon("Wicked Dagger", "An attack that deals extra damage on a critical hit and against enemies that aren't blocking (crit: even more damage)", "Wind", effect, [])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setUses(10);

function effect(target, user, isCrit, element, adventure) {
	let damage = 100;
	if (user.element === element) {
		addModifier(target, "Stagger", 1);
	}
	if (isCrit) {
		damage *= 3;
	}
	return dealDamage(target, user, damage, element, adventure);
}
