// Represents a player's information specific to a specific delve including: delve id, difficulty options, character selected, stats, moves and upgrades, artifacts, and gold
module.exports = class Delver {
    constructor () {
        this.delveID = "";
        this.difficultyOptions = [];
        this.characterName = "";
        this.hp = 0;
        this.power = 0;
        this.moves = [];
    }
}
