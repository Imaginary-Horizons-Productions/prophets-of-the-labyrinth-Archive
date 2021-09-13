module.exports = class Adventure {
    constructor(idInput, startIdInput, leaderInput) {
        this.id = idInput; // the id of the channel created for the adventure
        this.startMessageId = startIdInput;
        this.delvers = [leaderInput];
        this.accumulatedScore = 0;
        this.depth = 0;
        this.gold = 100;
    }
}
