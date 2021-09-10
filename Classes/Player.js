// Represents a player's overall profile, including unlocked artifacts and characters and score
module.exports = class Player {
    constructor(idInput) {
        this.id = idInput;
        this.guilds = new Map();
        this.score = {};
        this.artifacts = [];
        this.characters = [];
    }
}
