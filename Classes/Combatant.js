module.exports = class Combatant {
	constructor(nameInput, teamInput) {
		this.name = nameInput;
		this.team = teamInput;
	}
	title = "";
	hp = 300;
	maxHp = 300;
	block = 0;
	speed = 100;
	roundSpeed = 0;
	actionSpeed = 0;
	crit = false;
	critNumerator = 1;
	critDenominator = 4;
	element = "not picked";
	modifiers = {};
	staggerThreshold = 3;

	/**
	 * Sets the combatant's title, either the archetype for delvers or the uniquifying number for enemies
	 *
	 * @param {string} titleInput
	 * @returns {Combatant}
	 */
	setTitle(titleInput) {
		this.title = titleInput;
		return this;
	}

	/**
	 * Sets the hp and max hp of the combatant Delvers start at 300.
	 *
	 * @param {number} integer
	 * @returns {Combatant}
	 */
	setHp(integer) {
		this.hp = integer;
		this.maxHp = integer;
		return this;
	}

	/**
	 * Sets the speed of the combatant. Delvers start at 100.
	 *
	 * @param {number} integer
	 * @returns {Combatant}
	 */
	setSpeed(integer) {
		this.speed = integer;
		return this;
	}

	/**
	 * Sets the number of Stagger needed to promote to Stun. Delvers start at 3.
	 *
	 * @param {number} integer
	 * @returns {Combatant}
	 */
	setStaggerThreshold(integer) {
		this.staggerThreshold = integer;
		return this;
	}

	/** Combatant element determines weaknesses, resistances, and same element stagger bonus
	 * @param {"Fire" | "Water" | "Earth" | "Wind" | "@{adventure}" | "@{adventureOpposite}"} elementEnum
	 * @returns {Combatant}
	 */
	setElement(elementEnum) {
		this.element = elementEnum;
		return this;
	}

	/**
	 * Gets the numerator of the combatant's critical hit chance. Starts at 1. Delver has an overwrite that uses `count`.
	 *
	 * @param {number} hawkTailfeatherCount
	 * @returns {number}
	 */
	getCritNumerator(hawkTailfeatherCount) {
		return this.critNumerator;
	}

	/**
	 * Gets the denominator of the combatant's critical hit chance. Starts at 4. Delver has an overwrite that uses `count`.
	 *
	 * @param {number} hawkTailfeatherCount
	 * @returns {number}
	 */
	getCritDenominator(hawkTailfeatherCount) {
		return this.critDenominator;
	}

	/** Get the number of stacks of the given modifier the combatant has
	 * @param {string} modifierName
	 * @returns {number}
	 */
	getModifierStacks(modifierName) {
		return this.modifiers[modifierName] ?? 0
	}
}
