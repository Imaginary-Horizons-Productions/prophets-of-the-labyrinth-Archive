const Combatant = require("./Combatant");

// Represents an enemy for players to fight
module.exports = class Enemy extends Combatant {
	// Properties from Combatant: hp, maxHp, speed, roundSpeed, element, setHp, setSpeed, setElement
	constructor(nameInput) {
		super(nameInput, "enemy");
		this.lookupName = nameInput;
	}
	actions = {};
	nextAction = "";
	bounty = 0;
	startingModifiers = {}; // {modifier: stacks}

	setHp = super.setHp;
	setTitle = super.setTitle;
	setStaggerThreshold = super.setStaggerThreshold;

	/** Set the name of the first action an enemy takes. "random" allowed for random move in enemy's move pool.
	 * @param {string} actionName
	 * @returns {Enemy}
	 */
	setFirstAction(actionName) {
		this.nextAction = actionName;
		return this;
	}

	/**
	 * Set the name, effect, target selector, and move selector of an enemy attack
	 *
	 * @param {object} actionsInput
	 * @param {string} actionsInput.name
	 * @param {boolean} actionsInput.isPriority
	 * @param {function} actionsInput.effect
	 * @param {function} actionsInput.selector
	 * @param {function} actionsInput.next
	 * @returns {Enemy}
	 */
	addAction(actionsInput) {
		this.actions[actionsInput.name] = actionsInput;
		return this;
	}

	/**
	 * Add a modifier (and number of stacks) to start an enemy with.
	 *
	 * @param {string} modifier
	 * @param {number} stacks
	 * @returns {Enemy}
	 */
	addStartingModifier(modifier, stacks) {
		this.startingModifiers[modifier] = stacks;
		return this;
	}

	/**
	 * Set the numerator of the enemy's critical hit rate.
	 *
	 * @param {number} numeratorInput
	 * @returns {Enemy}
	 */
	setCritNumerator(numeratorInput) {
		this.critNumerator = numeratorInput;
		return this;
	}

	/**
	 * Set the denominator of the enemy's critical hit rate.
	 *
	 * @param {number} denominatorInput
	 * @returns {Enemy}
	 */
	setCritDenominator(denominatorInput) {
		this.critDenominator = denominatorInput;
		return this;
	}

	/**
	 * Set the base amount of gold (randomized later) an enemy drops when defeated.
	 *
	 * @param {number} integer
	 * @returns {Enemy}
	 */
	setBounty(integer) {
		this.bounty = integer;
		return this;
	}

	/**
	 * Set the uniquifing number for an enemy to its title.
	 *
	 * @param {object} titleObject
	 * @param {Enemy} enemy
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
