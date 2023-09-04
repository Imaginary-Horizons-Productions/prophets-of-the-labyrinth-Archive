module.exports = class Combatant {
	constructor(nameInput, teamInput) {
		this.name = nameInput;
		this.team = teamInput;
	}
	id = "";
	archetype = "";
	hp = 300;
	maxHp = 300;
	block = 0;
	speed = 100;
	roundSpeed = 0;
	actionSpeed = 0;
	crit = false;
	critBonus = 0;
	element = "not picked";
	/** @type {{[modifierName: string]: number}} */
	modifiers = {};
	staggerThreshold = 3;

	/** Sets the combatant's id, either the discord member id for delvers or the uniquifying number for enemies
	 * @param {string} idInput
	 */
	setId(idInput) {
		this.id = idInput;
		return this;
	}

	/** Sets the combatant's archetype, either the archetype name for delvers or the lookup name for enemies
	 * @param {string} archetypeInput
	   */
	setArchetype(archetypeInput) {
		this.archetype = archetypeInput;
		return this;
	}

	/** Sets the hp and max hp of the combatant Delvers start at 300.
	 * @param {number} integer
	 */
	setHp(integer) {
		this.hp = integer;
		this.maxHp = integer;
		return this;
	}

	/** Sets the speed of the combatant. Delvers start at 100.
	 * @param {number} integer
	 */
	setSpeed(integer) {
		this.speed = integer;
		return this;
	}

	/** Sets the number of Stagger needed to promote to Stun. Delvers start at 3.
	 * @param {number} integer
	 */
	setStaggerThreshold(integer) {
		this.staggerThreshold = integer;
		return this;
	}

	/** Combatant element determines weaknesses, resistances, and same element stagger bonus
	 * @param {"Fire" | "Water" | "Earth" | "Wind" | "Untyped" | "@{adventure}" | "@{adventureOpposite}"} elementEnum
	 */
	setElement(elementEnum) {
		this.element = elementEnum;
		return this;
	}

	/** Adds the given percent to the combatant's individual increased chance to crit
	 * @param {number} percent
	 */
	setCritBonus(percent) {
		this.critBonus += percent;
		return this;
	}

	getName() { }

	findMyIndex(adventure) { }

	/** Get the number of stacks of the given modifier the combatant has
	 * @param {string} modifierName
	 */
	getModifierStacks(modifierName) {
		return this.modifiers[modifierName] ?? 0
	}
}
