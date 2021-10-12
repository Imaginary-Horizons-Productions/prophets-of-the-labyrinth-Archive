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
}
