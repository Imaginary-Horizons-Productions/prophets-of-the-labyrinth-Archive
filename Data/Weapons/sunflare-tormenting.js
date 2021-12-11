const Weapon = require('../../Classes/Weapon.js');
const { addModifier } = require('../combatantDAO.js');
const { isDebuff } = require('../Modifiers/_modifierDictionary.js');

module.exports = new Weapon("Spell: Tormenting Sun Flare", 2, "*Inflict 2 Stagger and 1 of each of a foe's debuffs on that foe (+@{speedBonus} speed)*\nCritical Hit: Inflict 2 Slow as well\n", "Light", effect, ["Spell: Evasive Sun Flare", "Spell: Swift Sun Flare"])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setUses(10)
	.setSpeedBonus(5);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement } = module.exports;
	for (const modifier in target.modifiers) {
		if (isDebuff(modifier)) {
			addModifier(target, modifier, 1);
		}
	}
	if (user.element === weaponElement) {
		addModifier(target, "Stagger", 1);
	}
	if (isCrit) {
		addModifier(target, "Slow", 2);
	}
	addModifier(target, "Stagger", 2);
	return "";
}
