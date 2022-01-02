const Weapon = require('../../Classes/Weapon.js');

module.exports = new Weapon("Spell: Charging Blood Aegis", 2, "*Pay @{hpCost} hp to grant an ally @{block} block, then gain @{mod1Stacks} @{mod1}*\nCritical Hit: Block x@{critMultiplier}", "Darkness", effect, ["Spell: Heavy Blood Aegis", "Spell: Sweeping Blood Aegis"])
	.setTargetingTags({ target: "single", team: "ally" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "powerup", stacks: 25 }])
	.setCost(350)
	.setUses(10)
	.setHpCost(25)
	.setBlock(125);

function effect(target, user, isCrit, adventure) {
	let { element: weaponElement, modifiers: [elementStagger, powerUp], block, critMultiplier, hpCost } = module.exports;
	if (user.element === weaponElement) {
		removeModifier(target, elementStagger);
	}
	if (isCrit) {
		block *= critMultiplier;
	}
	addBlock(target, block);
	addModifier(user, powerUp);
	return dealDamage(user, null, hpCost, "untyped", adventure); // user pays health
}
