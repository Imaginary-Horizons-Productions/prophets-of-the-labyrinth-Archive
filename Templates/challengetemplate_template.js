const ChallengeTemplate = require("../../Classes/Challenge.js");

module.exports = new ChallengeTemplate("name", "description")
	.setIntensity(1)
	.setDuration(null)
	.setScoreMultiplier(1);

module.exports.reward = function (adventure) {
	// rewards provided on completion of challenge
}
