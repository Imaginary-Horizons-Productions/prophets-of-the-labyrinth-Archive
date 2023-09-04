module.exports = class EquipmentTemplate {
	/** This read-only data class defines stats for a piece of equipment
	 * @param {string} nameInput
	 * @param {string} descriptionInput
	 * @param {string} critDescriptionInput
	 * @param {"Fire" | "Water" | "Earth" | "Wind" | "Untyped"} elementInput
	 * @param {Function} effectInput
	 * @param {Array<string>} upgradeNames
	 */
	constructor(nameInput, descriptionInput, critDescriptionInput, elementInput, effectInput, upgradeNames) {
		this.name = nameInput;
		this.description = descriptionInput;
		this.critDescription = critDescriptionInput;
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
	bonus = 0;
	block = 0;
	hpCost = 0;
	healing = 0;
	priority = 0;
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

	setBonus(integer) {
		this.bonus = integer;
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
	setPriority(integer) {
		this.priority = integer;
		return this;
	}

	setModifiers(modifiersArray) {
		this.modifiers = modifiersArray;
		return this;
	}
}
