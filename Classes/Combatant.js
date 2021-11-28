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

	static getWeaknesses(element) {
		switch (element) {
			case "Light":
				return ["Fire", "Earth"];
			case "Darkness":
				return ["Wind", "Water"];
			case "Fire":
				return ["Earth", "Darkness"];
			case "Water":
				return ["Wind", "Light"];
			case "Earth":
				return ["Water", "Darkness"];
			case "Wind":
				return ["Light", "Fire"];
			default:
				return ["none"];
		}
	}

	static getResistances(element) {
		switch (element) {
			case "Light":
				return ["Wind", "Water"];
			case "Darkness":
				return ["Earth", "Fire"];
			case "Fire":
				return ["Light", "Wind"];
			case "Water":
				return ["Darkness", "Earth"];
			case "Earth":
				return ["Fire", "Light"];
			case "Wind":
				return ["Water", "Darkness"];
			default:
				return ["none"];
		}
	}
}
