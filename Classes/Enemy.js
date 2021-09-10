// Represents an enemy for players to fight
module.exports = class Enemy {
    constructor() {
        this.hp = 0;
        this.power = 0;
        this.element = "";
        this.moves = [];
    }
}
