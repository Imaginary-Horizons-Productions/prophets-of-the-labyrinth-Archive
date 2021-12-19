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
	element = "water";
	modifiers = {};
	staggerThreshold = 3;

	setTitle(titleInput) {
		this.title = titleInput;
		return this;
	}

	setHp(integer) {
		this.hp = integer;
		this.maxHp = integer;
		return this;
	}

	setSpeed(integer) {
		this.speed = integer;
		return this;
	}

	setStaggerThreshold(integer) {
		this.staggerThreshold = integer;
		return this;
	}

	setElement(elementInput) {
		this.element = elementInput;
		return this;
	}
}
