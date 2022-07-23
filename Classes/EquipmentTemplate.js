// A readonly template containing stats for a piece of equipment
module.exports = class EquipmentTemplate {
	constructor(nameInput, tierInput, descriptionInput, elementInput, effectInput, upgradeNames) {
		this.name = nameInput;
		this.tier = tierInput;
		this.description = descriptionInput;
		this.element = elementInput;
		this.effect = effectInput;
		this.upgrades = upgradeNames;
	}
	category = "";
	targetingTags = {};
	cost = 100;
	maxUses = 10;
	critBonus = 2;
	damage = 0;
	bonusDamage = 0;
	block = 0;
	hpCost = 0;
	healing = 0;
	isPriority = false;
	modifiers = []; //[{name, stacks}]

	/** Sets the equipment's category and returns the category via builder pattern
	 * @param {"Weapon" | "Armor" | "Spell" | "Pact" | "Trinket"} categoryEnum
	 * @returns {EquipmentTemplate}
	 */
	setCategory(categoryEnum) {
		this.category = categoryEnum;
		return this;
	}

	/** Sets the equipment's targets and returns the equipment via builder pattern
	 * @param {object} tagObject
	 * @param {"single" | "all" | "random→x" | "self" | "none"} tagObject.target
	 * @param {"delver" | "enemy" | "any" | "none"} tagObject.team
	 * @returns {EquipmentTemplate}
	 */
	setTargetingTags(tagObject) {
		this.targetingTags = tagObject;
		return this;
	}

	/** Sets the equipment's cost and returns the equipment via builder pattern
	 * @param {number} integer
	 * @returns {EquipmentTemplate}
	 */
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

	setCritBonus(numberInput) {
		this.critBonus = numberInput;
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

	/** Determines that this equipment adds moves to the priority queue
	 * @returns {EquipmentTemplate}
	 */
	markPriority() {
		this.isPriority = true;
		return this;
	}

	setModifiers(modifiersArray) {
		this.modifiers = modifiersArray;
		return this;
	}
}
