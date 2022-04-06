const ChallengeTemplate = require("../../Classes/ChallengeTemplate.js");

module.exports = new ChallengeTemplate("Blind Avarice", "Predicting costs @{intensity} gold for @{duration} rooms. Afterwards, gain @{reward} gold.")
	.setIntensity(4)
	.setDuration(3)
	.setScoreMultiplier(1.1)
	.setReward(500);

module.exports.complete = function (adventure, thread) {
	let reward = adventure.challenges[module.exports.name].reward;
	adventure.gainGold(reward);
	thread.send({ content: `Having completed *${module.exports.name}*, the party gains ${reward} gold!` });
}
