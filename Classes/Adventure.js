module.exports = class Adventure {
    constructor(idInput, seedInput, startIdInput, leaderInput) {
        this.id = idInput; // the id of the channel created for the adventure
        if (typeof seedInput === "string") {
            this.initialSeed = Array.from(seedInput).reduce((total, current) => total += current.charCodeAt(0), 0);
        } else {
            this.initialSeed = parseInt(startIdInput);
        }
        this.seed = this.initialSeed;
        this.startMessageId = startIdInput;
        this.delvers = [leaderInput];
        this.accumulatedScore = 0;
        this.depth = 0;
        this.lives = 1;
        this.gold = 100;
    }
}
