module.exports = class Adventure {
    constructor(idInput, seedInput, startIdInput, leaderInput) {
        this.id = idInput; // the id of the channel created for the adventure
        this.initialSeed = seedInput || Date.now().toString();
        this.rnTable = lastTwoOfUnicodeSum(this.initialSeed);
        while (this.rnTable.length < 10) {
            this.rnTable = this.rnTable.concat(lastTwoOfUnicodeSum(this.rnTable));
        }
        this.rnIndex = 0;
        this.startMessageId = startIdInput;
        this.delvers = [leaderInput];
        this.accumulatedScore = 0;
        this.depth = 0;
        this.lives = 1;
        this.gold = 100;
        this.battleRound;
        this.battleEnemies = [];
        console.log(this.rnTable);
    }
}

function lastTwoOfUnicodeSum(stringOfNumbers) {
    // Problem: 4th character is always 0
    let sum = Array.from(stringOfNumbers).reduce((total, current) => total += current.charCodeAt(0), 0).toString();
    return sum.at(-1) + sum.at(-2);
}
