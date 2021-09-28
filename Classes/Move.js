module.exports = class Move {
	constructor() {
		this.name = "";
		this.speed = 0;
		this.roundSpeed = 0;
		this.isCrit = false;
		this.userTeam = "";
		this.userIndex = "";
		this.targetTeam = "";
		this.targetIndex = "";
		this.effect = () => { };
	}

	setSpeed(number) {
		this.speed = number;
		return this;
	}

	setRoundSpeed(number) {
		this.roundSpeed = number;
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

	setTarget(team, index) {
		this.targetTeam = team;
		this.targetIndex = index;
		return this;
	}

	setEffect(effectFunction) {
		this.effect = effectFunction;
		return this;
	}
}
