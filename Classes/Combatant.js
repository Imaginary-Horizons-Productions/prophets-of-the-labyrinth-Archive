module.exports = class Combatant {
	constructor() { }
	name = "Placeholder";
	team = "";
	hp = 10;
	maxHp = 30;
	speed = 10;
	roundSpeed = 0;
	elements = [];

	setHp(integer) {
		this.hp = integer;
		this.maxHp = integer;
		return this;
	}

	setSpeed(integer) {
		this.speed = integer;
		return this;
	}

	setElement(elementInput) {
		this.elements.push(elementInput);
		return this;
	}
}
