const Combatant = require("./Combatant");

// Represents an enemy for players to fight
module.exports = class Enemy extends Combatant {
	// Properties from Combatant: hp, maxHp, speed, roundSpeed, elements, setHp, setSpeed, setElement
	constructor(nameInput) {
		super();
		this.name = nameInput;
		this.team = "enemy";
		this.actions = [];
	}

	setTitle = super.setTitle;

	addActions(actionsInput) {
		this.actions = actionsInput;
		return this;
	}
}
