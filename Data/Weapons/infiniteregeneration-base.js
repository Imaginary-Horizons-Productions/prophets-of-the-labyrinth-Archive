const Weapon = require('../../Classes/Weapon.js');
const { removeModifier, addModifier, dealDamage } = require('../combatantDAO.js');

module.exports = new Weapon("Pact: Infinite Regeneration", 1, "*Pay @{hpCost} hp to grant an allies @{mod1Stacks} @{mod1}*\nCritical Hit: HP Cost / @{critMultiplier}", "Darkness", effect, [])
	.setTargetingTags({ target: "single", team: "ally" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Regen", stacks: 3 }])
	.setHpCost(50)
	.setCost(200)
	.setUses(5);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, modifiers: [elementStagger, regen], hpCost, critMultiplier } = module.exports;
	if (user.element === weaponElement) {
		removeModifier(target, elementStagger);
	}
	if (isCrit) {
		hpCost /= critMultiplier;
	}
	addModifier(target, regen);
	return dealDamage(user, null, hpCost, true, "untyped", adventure); // result text
}
