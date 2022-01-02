const Weapon = require('../../Classes/Weapon.js');
const { dealDamage, addModifier, addBlock } = require('../combatantDAO.js');

module.exports = new Weapon("Guarding Sword", 2, "*Strike a foe for @{damage} @{element} damage, then gain @{block} block and @{mod1Stacks} @{mod1}*\nCritical Hit: Damage x@{critMultiplier}", "Earth", effect, ["Reckless Sword", "Swift Sword"])
	.setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Power Up", stacks: 25 }])
	.setCost(350)
	.setUses(10)
	.setDamage(75)
	.setBlock(75);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, modifiers: [elementStagger, powerUp], damage, block, critMultiplier } = module.exports;
	if (user.element === weaponElement) {
		addModifier(target, elementStagger);
	}
	if (isCrit) {
		damage *= critMultiplier;
	}
	addBlock(user, block);
	addModifier(user, powerUp);
	return dealDamage(target, user, damage, weaponElement, adventure);
}
