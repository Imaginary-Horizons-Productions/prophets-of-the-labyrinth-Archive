module.exports = class Adventure {
    constructor(idInput, seedInput, startIdInput, leaderInput) {
        this.id = idInput; // the id of the channel created for the adventure
        this.initialSeed = seedInput || Date.now().toString();
        this.rnTable = linearRandomGenerator(processSeed(this.initialSeed, seedInput !== undefined)).join("");
        this.rnIndex = 0;
        this.startMessageId = startIdInput;
        this.delvers = [leaderInput];
        this.accumulatedScore = 0;
        this.depth = 0;
        this.lives = 1;
        this.gold = 100;
        this.battleRound;
        this.battleEnemies = [];
    }
}

function processSeed(initialSeed, seedProvidedByUser) {
    let lumber; // will become a table later
    if (seedProvidedByUser) {
        // Sum the unicode indices of the characters
        lumber = Array.from(initialSeed).reduce((total, current) => total += current.charCodeAt(0), 0).toString();
    } else {
        lumber = initialSeed;
    }
    return lumber.substring(-5); // planks
}

// x0=seed; a=multiplier; b=increment; m=modulus; n=desired array length;
function linearRandomGenerator(x0) {
    const results = [];
    for (let i = 0; i < 1000000; i++) {
        x0 = (5 * x0 + 7) % 100003;
        results.push(x0);
    }
    return results;
}
