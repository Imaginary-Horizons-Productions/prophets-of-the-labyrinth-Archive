const ChallengeTemplate = require("../../Classes/ChallengeTemplate.js");

module.exports = new ChallengeTemplate("Restless", "Reduce hp recovered at rest sites by @{intensity}%.")
	.setIntensity(30)
	.setDuration(null)
	.setScoreMultiplier(1.5);

module.exports.reward = function (adventure) { }
