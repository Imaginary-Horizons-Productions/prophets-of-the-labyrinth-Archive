// Represents an enemy for players to fight
module.exports = class Enemy {
    constructor(nameInput) {
        this.name = nameInput; //TODO #25 unique-ify enemy names
        this.hp = 0;
        this.speed = 0;
        this.element = "";
        this.actions = [];
    }

    setHp(hpInput) {
        this.hp = hpInput;
        return this;
    }

    setSpeed(speedInput) {
        this.speed = speedInput;
        return this;
    }

    setElement(elementInput) {
        this.element = elementInput;
        return this;
    }

    addActions(actionsInput) {
        this.actions = actionsInput;
        return this;
    }
}
