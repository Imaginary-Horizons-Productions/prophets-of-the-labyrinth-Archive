// A readonly object containing stats for a delver's weapon
module.exports = class Weapon {
	constructor(nameInput, tierInput, descriptionInput, elementInput, effectInput, upgradeNames) {
		this.name = nameInput;
		this.tier = tierInput;
		this.description = descriptionInput;
		this.element = elementInput;
		this.effect = effectInput;
		this.upgrades = upgradeNames;
	}
	targetingTags = {};
	cost = 100;
	maxUses = 10;
	critMultiplier = 2;
	damage = 0;
	bonusDamage = 0;
	block = 0;
	hpCost = 0;
	healing = 0;
	speedBonus = 0;

	setTargetingTags(tagObject) {  // tagObject {target: ["single", "all", "random", "self"], team: ["ally", "enemy", "any"]}
		this.targetingTags = tagObject;
		return this;
	}

	setCost(integer) {
		this.cost = integer;
		return this;
	}

	setUses(integer) {
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

	setHealing(integer) {
		this.healing = integer;
		return this;
	}

	setSpeedBonus(integer) {
		this.speedBonus = integer;
		return this;
	}
}
