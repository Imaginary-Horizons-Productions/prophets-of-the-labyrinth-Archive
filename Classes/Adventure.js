module.exports = class Adventure {
	constructor(idInput, seedInput, startIdInput, leaderInput) {
		this.id = idInput; // the id of the channel created for the adventure
		this.initialSeed = seedInput || Date.now().toString();
		this.rnTable = linearRandomGenerator(processSeed(this.initialSeed, seedInput !== undefined)).join("");
		this.rnIndex = 0;
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
	for (let i = 0; i < 1000000; i++) {
		seed = (5 * seed + 7) % 100003;
		results.push(seed);
	}
	return results;
}

module.exports.prototype.nextRandomNumber = (poolSize) => {
	let index;
	let indexEnd = this.rnIndex + poolSize.toString().length;
	if (indexEnd < this.rnIndex) {
		index = this.rnTable.slice(this.rnIndex) + this.rnTable.slice(0, indexEnd);
	} else {
		index = this.rnTable.slice(this.rnIndex, indexEnd);
	}
	this.rnIndex = (this.rnIndex + 1) % this.rnTable.length;
	return index % poolSize;
}
