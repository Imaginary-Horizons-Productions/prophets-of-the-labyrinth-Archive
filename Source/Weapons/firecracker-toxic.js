const Weapon = require('../../Classes/Weapon.js');
const { dealDamage, addModifier } = require('../combatantDAO.js');
const { SAFE_DELIMITER } = require("../../helpers.js");

module.exports = new Weapon("Toxic Firecracker", 2, "*Strike 3 random foes applying @{mod1Stacks} @{mod1} and @{damage} @{element} damage*\nCritical Hit: Damage x@{critBonus}", "Fire", effect, ["Double Firecracker", "Mercurial Firecracker"])
	.setTargetingTags({ target: `random${SAFE_DELIMITER}3`, team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Poison", stacks: 3 }])
	.setCost(350)
	.setUses(5)
	.setCritBonus(2)
	.setDamage(50);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, modifiers: [elementStagger, poison], damage, critBonus } = module.exports;
	if (user.element === weaponElement) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		damage *= critBonus;
	}
	addModifier(target, poison);
	return dealDamage(target, user, damage, false, weaponElement, adventure);
}
