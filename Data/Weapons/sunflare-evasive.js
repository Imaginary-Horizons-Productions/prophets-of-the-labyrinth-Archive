const Weapon = require('../../Classes/Weapon.js');
const { addModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Spell: Evasive Sun Flare", 2, "*Inflict 2 Stagger on a foe and gain 1 evade (+@{speedBonus} speed)*\nCritical Hit: Inflict 2 Slow as well\n", "Light", effect, ["Spell: Swift Sun Flare", "Spell: Tormenting Sun Flare"])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setUses(10)
	.setSpeedBonus(5)
	.setBlock(50);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, block } = module.exports;
	if (user.element === weaponElement) {
		addModifier(target, "Stagger", 1);
	}
	if (isCrit) {
		addModifier(target, "Slow", 2);
	}
	addModifier(target, "Stagger", 2);
	addModifier(user, "evade", 1);
	return "";
}
