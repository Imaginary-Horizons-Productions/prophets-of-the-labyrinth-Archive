const Artifact = require("../../Classes/Artifact.js");

module.exports = new Artifact("Piggy Bank", "Gain @{copies*5}% of your current gold when you enter a new room.", "Increase rate of interest (additively) by 5% per piggy bank")
	.setElement("Untyped")
