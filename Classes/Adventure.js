module.exports = class Adventure {
    constructor(idInput, startIdInput, leaderInput) {
        this.id = idInput;
        this.startMessageId = startIdInput;
        this.players = [leaderInput];
    }
}
