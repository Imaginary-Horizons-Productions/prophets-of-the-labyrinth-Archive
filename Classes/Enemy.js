const Combatant = require("./Combatant");

module.exports = class Enemy extends Combatant {
	/** This read-only data class defines an enemy players can fight
	 * @param {string} nameInput
	 */
	constructor(nameInput) {
		super(nameInput, "enemy");
		this.archetype = nameInput;
	}
	// Properties from Combatant: hp, maxHp, speed, roundSpeed, element, setHp, setSpeed, setElement
	actions = {};
	nextAction = "";
	/** @type {[modifierName: string]: number} */
	startingModifiers = {};
	shouldRandomizeHP = true;

	setHp = super.setHp;
	setId = super.setId;
	setArchetype = super.setArchetype;
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
	 * @param {integer} actionsInput.priority
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

	/** Marks the enemy as an artifact guardian or final boss, which shouldn't randomize hp and has boosted crit chance*/
	markAsBoss() {
		this.shouldRandomizeHP = false;
		this.setCritBonus(15);
		return this;
	}

	getName(enemyIdMap) {
		if (enemyIdMap[this.name] > 1) {
			return `${this.name} ${this.id}`;
		} else {
			return this.name;
		}
	}

	/** Set the uniquifing number for an enemy to its title.
	 * @param {object} titleObject
	 */
	static setEnemyTitle(titleObject, enemy) {
		if (titleObject[enemy.name]) {
			titleObject[enemy.name]++;
			enemy.id = titleObject[enemy.name];
		} else {
			titleObject[enemy.name] = 1;
			enemy.id = 1;
		}
	}
}
