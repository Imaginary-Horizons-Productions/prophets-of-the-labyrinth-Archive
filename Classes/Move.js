module.exports = class Move {
    constructor() {
        this.speed = 0;
		this.weaponName = "";
        this.userTeam = "";
        this.userIndex = "";
        this.targetTeam = "";
        this.targetIndex = "";
        this.damage = 0;
        this.effect = () => { };
    }

    setSpeed(number) {
        this.speed = number;
        return this;
    }

	setWeaponName(weaponNameInput) {
		this.weaponName = weaponNameInput;
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

    setDamage(integer) {
        this.damage = integer;
        return this;
    }

    setEffect(effectFunction) {
        this.effect = effectFunction;
        return this;
    }
}
