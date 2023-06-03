const Artifact = require("../../Classes/Artifact.js");

module.exports = new Artifact("Bloodshield Sword", "When being healed, convert each point of excess hp to @{copies} block.", "Increase block conversion by 1 for each sword")
	.setElement("Untyped")
	.setFlavorText({ name: "*Additional Notes*", value: "*What's next, a sword that heals those it slashes?*" })
