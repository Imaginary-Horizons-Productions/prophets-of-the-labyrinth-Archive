module.exports = class Weapon {
	constructor(nameInput, descriptionInput, elementInput, effectInput, upgradeNames) {
		this.name = nameInput;
		this.description = descriptionInput;
		this.element = elementInput;
		this.effect = effectInput;
		this.upgrades = upgradeNames;
	}
	targetingTags = {};
	uses = 10;
	maxUses = 10;
	critMultiplier = 2;
	damage = 0;
	bonusDamage = 0;
	block = 0;
	hpCost = 0;

	setTargetingTags(tagObject) {  // tagObject {target: ["single", "all", "random", "self"], team: ["ally", "enemy", "any"]}
		this.targetingTags = tagObject;
		return this;
	}

	setUses(integer) {
		this.uses = integer;
		this.maxUses = integer;
		return this;
	}

	setDamage(integer) {
		this.damage = integer;
		return this;
	}

	setBonusDamage(integer) {
		this.bonusDamage = integer;
		return this;
	}

	setCritMultiplier(numberInput) {
		this.critMultiplier = numberInput;
		return this;
	}

	setBlock(integer) {
		this.block = integer;
		return this;
	}

	setHpCost(integer) {
		this.hpCost = integer;
		return this;
	}
}
