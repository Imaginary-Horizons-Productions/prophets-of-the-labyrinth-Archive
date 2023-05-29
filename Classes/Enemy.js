const Combatant = require("./Combatant");

module.exports = class Enemy extends Combatant {
	/** This read-only data class defines an enemy players can fight
	 * @param {string} nameInput
	 */
	constructor(nameInput) {
		super(nameInput, "enemy");
		this.lookupName = nameInput;
	}
	// Properties from Combatant: hp, maxHp, speed, roundSpeed, element, setHp, setSpeed, setElement
	actions = {};
	nextAction = "";
	/** @type {[modifierName: string]: number} */
	startingModifiers = {};
	shouldRandomizeHP = true;

	setHp = super.setHp;
	setTitle = super.setTitle;
	setStaggerThreshold = super.setStaggerThreshold;

	/** Set the name of the first action an enemy takes. "random" allowed for random move in enemy's move pool.
	 * @param {string} actionName
	 */
	setFirstAction(actionName) {
		this.nextAction = actionName;
		return this;
	}

	/** Set the name, effect, target selector, and move selector of an enemy attack
	 * @param {object} actionsInput
	 * @param {string} actionsInput.name
	 * @param {"Fire" | "Water" | "Wind" | "Earth" | "Untyped" | "@{adventure}" | "@{adventureOpposite}"} actionsInput.element
	 * @param {boolean} actionsInput.isPriority
	 * @param {function} actionsInput.effect
	 * @param {function} actionsInput.selector
	 * @param {function} actionsInput.next
	 */
	addAction(actionsInput) {
		this.actions[actionsInput.name] = actionsInput;
		return this;
	}

	/** Add a modifier (and number of stacks) to start an enemy with.
	 * @param {string} modifier
	 * @param {number} stacks
	 */
	addStartingModifier(modifier, stacks) {
		this.startingModifiers[modifier] = stacks;
		return this;
	}

	/** Set the numerator of the enemy's critical hit rate.
	 * @param {number} numeratorInput
	 */
	setCritNumerator(numeratorInput) {
		this.critNumerator = numeratorInput;
		return this;
	}

	/** Set the denominator of the enemy's critical hit rate.
	 * @param {number} denominatorInput
	 */
	setCritDenominator(denominatorInput) {
		this.critDenominator = denominatorInput;
		return this;
	}

	/** Marks the enemy as an artifact guardian or final boss, which shouldn't randomize hp */
	markAsBoss() {
		this.shouldRandomizeHP = false;
		return this;
	}

	/** Set the uniquifing number for an enemy to its title.
	 * @param {object} titleObject
	 */
	static setEnemyTitle(titleObject, enemy) {
		if (titleObject[enemy.name]) {
			titleObject[enemy.name]++;
			enemy.title = titleObject[enemy.name];
		} else {
			titleObject[enemy.name] = 1;
			enemy.title = 1;
		}
	}
}
