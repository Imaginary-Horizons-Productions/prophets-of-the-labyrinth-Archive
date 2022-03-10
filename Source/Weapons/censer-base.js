const Weapon = require('../../Classes/Weapon.js');
const { dealDamage, addModifier } = require('../combatantDAO.js');

module.exports = new Weapon("Censer", 1, "Burn a foe for @{damage} (+@{bonusDamage} if target has 0 block) @{element} damage*\nCritical Hit: Also apply @{mod1Stacks} @{mod1}", "Fire", effect, [])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Slow", stacks: 2 }])
	.setDamage(50)
	.setBonusDamage(75)
	.setCost(200)
	.setUses(10);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, modifiers: [elementStagger, slow], damage, bonusDamage } = module.exports;
	if (user.element === weaponElement) {
		addModifier(target, elementStagger);
	}
	if (target.block === 0) {
		damage += bonusDamage;
	}
	if (isCrit) {
		addModifier(target, slow);
	}
	return dealDamage(target, user, damage, false, weaponElement, adventure); // result text
}
