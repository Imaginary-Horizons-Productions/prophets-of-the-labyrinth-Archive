module.exports = class Adventure {
	constructor(idInput, seedInput, startIdInput, leaderInput) {
		this.id = idInput; // the id of the channel created for the adventure
		this.initialSeed = seedInput || Date.now().toString();
		this.rnTable = linearRandomGenerator(processSeed(this.initialSeed, seedInput !== undefined)).join("");
		this.rnIndex = 0;
		this.rnIndexBattle = 0;
        this.startMessageId = startIdInput;
		this.lastComponentMessageId = "";
		this.delvers = [leaderInput];
		this.accumulatedScore = 0;
		this.depth = 0;
		this.lives = 1;
		this.gold = 100;
		this.battleRound;
		this.battleEnemies = [];
		this.battleMoves = [];
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

function linearRandomGenerator(seed) {
	const results = [];
	for (let i = 0; i < 10000; i++) {
		seed = (5 * seed + 7) % 100003;
		results.push(seed);
	}
	return results;
}
