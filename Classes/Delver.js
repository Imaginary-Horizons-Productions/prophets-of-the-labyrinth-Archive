// Represents a player's information specific to a specific delve including: delve id, difficulty options, character selected, stats, moves and upgrades, and artifacts
module.exports = class Delver {
    constructor (idInput, delveIdInput) {
        this.id = idInput;
        this.delveID = delveIdInput;
        this.difficultyOptions = [];
        this.characterName = "";
        this.hp = 10;
        this.maxHp = 30;
        this.power = 0;
        this.moves = [];
    }
}
