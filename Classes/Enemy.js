const Combatant = require("./Combatant");

// Represents an enemy for players to fight
module.exports = class Enemy extends Combatant {
	// Properties from Combatant: hp, maxHp, speed, roundSpeed, elements, setHp, setSpeed, setElement
	constructor(nameInput) {
		super(nameInput, "enemy");
		this.actions = {};
	}

	setTitle = super.setTitle;

	addAction(actionsInput) {
		this.actions[actionsInput.name] = actionsInput;
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
