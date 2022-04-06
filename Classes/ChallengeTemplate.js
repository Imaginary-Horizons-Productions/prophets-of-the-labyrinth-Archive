const { parseCount } = require("../helpers");

module.exports = class ChallengeTemplate {
	constructor(nameInput, descriptionInput) {
		this.name = nameInput;
		this.description = descriptionInput;
	}
	intensity = 1;
	duration = null;
	scoreMultiplier = 1;
	reward = 0;

	complete(adventure, thread) { }

	dynamicDescription(intensity, duration, reward) {
		let intensityExpression = this.description.match(/@{(intensity[\*\d]*)}/)?.[1].replace(/intensity/g, "n");
		if (intensityExpression) {
			intensity = parseCount(intensityExpression, intensity);
		}
		return this.description.replace(/@{intensity[\d*]*}/g, intensity).replace(/@{duration}/g, duration).replace(/@{reward}/g, reward);
	}

	setIntensity(intensityInput) {
		this.intensity = intensityInput;
		return this;
	}

	setDuration(durationInputs) {
		this.duration = durationInputs;
		return this;
	}

	setScoreMultiplier(multiplierInput) {
		this.scoreMultiplier = multiplierInput;
		return this;
	}

	setReward(rewardInput) {
		this.reward = rewardInput;
		return this;
	}
}
