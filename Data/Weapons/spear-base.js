const Weapon = require('../../Classes/Weapon.js');
const { dealDamage, addModifier } = require("../combatantDAO.js");

module.exports = new Weapon("Spear", 1, "*Strike a foe for @{damage} @{element} damage*\nCritical Hit: Inflict @{mod1Stacks} @{mod1}", "Light", effect, ["Lethal Spear", "Reactive Spear", "Sweeping Spear"])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Stagger", stacks: 1 }])
	.setCost(200)
	.setUses(10)
	.setDamage(100);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, modifiers: [elementStagger, critStagger], damage } = module.exports;
	if (user.element === weaponElement) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		addModifier(target, critStagger);
	}
	return dealDamage(target, user, damage, false, weaponElement, adventure);
}
