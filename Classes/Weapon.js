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

	setTargetingTags(tagObject) {  // tagObject {target: ["single", "all", "random", "self"], team: ["ally", "enemy", "any"]}
		this.targetingTags = tagObject;
		return this;
	}

	setUses(numberInput) {
		this.uses = numberInput;
		this.maxUses = numberInput;
		return this;
	}
}
