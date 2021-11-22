const Combatant = require("./Combatant");

// Represents an enemy for players to fight
module.exports = class Enemy extends Combatant {
	// Properties from Combatant: hp, maxHp, speed, roundSpeed, elements, setHp, setSpeed, setElement
	constructor(nameInput) {
		super(nameInput, "enemy");
		this.lookupName = nameInput;
	}
	actions = {};
	bounty = 0;

	setTitle = super.setTitle;
	setStaggerThreshold = super.setStaggerThreshold;

	addAction(actionsInput) {
		this.actions[actionsInput.name] = actionsInput;
		return this;
	}

	setBounty(integer) {
		this.bounty = integer;
		return this;
	}

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
