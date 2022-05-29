const { generateRandomNumber } = require("../../helpers");

const challengeWhitelist = [
	"blindavarice.js",
	"cantholdallthisvalue.js",
	"restless.js"
];

const CHALLENGES = {};

for (const file of challengeWhitelist) {
	const challenge = require(`./${file}`);
	CHALLENGES[challenge.name] = challenge;
}

exports.getChallenge = function (challengeName) {
	return CHALLENGES[challengeName];
}

exports.rollChallenges = function (rolls, adventure) {
	let challenges = [];
	let challengeNames = Object.keys(CHALLENGES);
	for (let i = 0; i < rolls; i++) {
		let rolledChallenge = challengeNames[generateRandomNumber(adventure, challengeNames.length, "general")];
		if (!challenges.includes(rolledChallenge)) {
			challenges.push(rolledChallenge);
		}
	}
	return challenges;
}
