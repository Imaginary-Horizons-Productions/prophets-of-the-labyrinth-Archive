const Weapon = require('../../Classes/Weapon.js');
const { dealDamage, addModifier, calculateTotalSpeed } = require("../combatantDAO.js");

module.exports = new Weapon("Reactive Spear", "An attack that deals more damage against faster foes (crit: inflict Stagger)", "light", effect, [])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setUses(10);

function effect(target, user, isCrit, element, adventure) {
	let damage = 100;
	if (calculateTotalSpeed(target) > calculateTotalSpeed(user)) {
		damage += 75;
	}
	if (user.element === element) {
		addModifier(target, "Stagger", 1);
	}
	if (isCrit) {
		addModifier(target, "Stagger", 1);
	}
	return dealDamage(target, user, damage, element, adventure);
}
