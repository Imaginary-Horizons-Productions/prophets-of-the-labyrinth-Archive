module.exports = class Move {
	constructor() {
		this.name = "";
		this.speed = 0;
		this.element = "";
		this.roundSpeed = 0;
		this.isCrit = false;
		this.userTeam = ""; //TODO convert to array to support joint/combo moves
		this.userIndex = "";
		this.targets = [];
	}

	setSpeed(number) {
		this.speed = number;
		return this;
	}

	setRoundSpeed(number) {
		this.roundSpeed = number;
		return this;
	}

	setElement(elementInput) {
		this.element = elementInput;
		return this;
	}

	setIsCrit(boolean) {
		this.isCrit = boolean;
		return this;
	}

	setMoveName(weaponNameInput) {
		this.name = weaponNameInput;
		return this;
	}

	setUser(team, index) {
		this.userTeam = team;
		this.userIndex = index;
		return this;
	}

	addTarget(team, index) {
		this.targets.push({ team: team, index: index });
		return this;
	}

	setEffect(effectFunction) {
		this.effect = effectFunction;
		return this;
	}
}
