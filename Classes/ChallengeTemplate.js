const { parseCount } = require("../helpers");

module.exports = class ChallengeTemplate {
	constructor(nameInput, descriptionInput) {
		this.name = nameInput;
		this.description = descriptionInput;
	}
	intensity = 1;
	duration = null;
	scoreMultiplier = 1;

	reward(adventure) { }

	dynamicDescription(intensity, duration) {
		let intensityExpression = this.description.match(/@{(intensity[\*\d]*)}/)?.[1].replace(/intensity/g, "n");
		if (intensityExpression) {
			intensity = parseCount(intensityExpression, intensity);
		}
		return this.description.replace(/@{intensity.*}/g, intensity).replace(/@{duration}/g, duration);
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
}
