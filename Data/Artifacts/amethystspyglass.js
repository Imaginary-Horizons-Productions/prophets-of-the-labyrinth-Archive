const Artifact = require("../../Classes/Artifact.js");

module.exports = new Artifact("Amethyst Spyglass", "Get a discount on scouting of @{copies} X 5 gold.") //TODO #188 parsable expressions in artifact description interpolation
	.setElement("Untyped")
	.setFlavorText(["Additional Notes", "Peering through it makes things look blocky"])
