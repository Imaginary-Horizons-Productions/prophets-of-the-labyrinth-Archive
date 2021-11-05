const Weapon = require('../../Classes/Weapon.js');
const { dealDamage, addModifier } = require('../combatantDAO.js');

module.exports = new Weapon("crystalsword", "Strike a foe while gaining power (crit: gain more power)", "earth", effect, [])
	.setTargetingTags({ target: "single", team: "enemy" }) // tagObject {target: ["single", "all", "random", "self"], team: ["ally", "enemy", "any", "self"]}
	.setUses(5);

function effect(target, user, isCrit, element, adventure) {
	let damage = 25;
	if (user.element === element) {
		addModifier(target, "Stagger", 1);
	}
	if (isCrit) {
		addModifier(user, "powerup", 50);
	} else {
		addModifier(user, "powerup", 25);
	}
	return dealDamage(target, user, damage, element, adventure); // result text
}
