const ChallengeTemplate = require("../../Classes/Challenge.js");

module.exports = new ChallengeTemplate("name", "description")
	.setIntensity(1)
	.setDuration(null)
	.setScoreMultiplier(1)
	.setReward(0);

module.exports.complete = function (adventure, thread) {
	// rewards provided on completion of challenge
	thread.send({ content: `Having completed *${module.exports.name}*, the party gains ${reward} gold!` });
}
