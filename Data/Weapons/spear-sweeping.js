const Weapon = require('../../Classes/Weapon.js');
const { dealDamage, addModifier } = require("../combatantDAO.js");

module.exports = new Weapon("Sweeping Spear", "Attack all enemies and inflict stagger on a crit (crit: inflict Stagger)", "Light", effect, [])
	.setTargetingTags({ target: "all", team: "enemy" })
	.setUses(10);

function effect(target, user, isCrit, element, adventure) {
	let damage = 75;
	if (user.element === element) {
		addModifier(target, "Stagger", 1);
	}
	if (isCrit) {
		addModifier(target, "Stagger", 1);
	}
	return dealDamage(target, user, damage, element, adventure).then(damageText => {
		return damageText;
	});
}
