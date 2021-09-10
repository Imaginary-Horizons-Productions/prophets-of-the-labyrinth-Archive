// Represents a player's overall profile, including unlocked artifacts and characters and score
module.exports = class Player {
    constructor() {
        this.id = "";
        this.score = "";
        this.artifacts;
        this.characters;
    }
}
