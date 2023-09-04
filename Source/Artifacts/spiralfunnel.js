const Artifact = require("../../Classes/Artifact.js");

module.exports = new Artifact("Spiral Funnel", "Increase Poison damage dealt to enemies by @{copies*5} per stack.", "Increase damage per stack by 5 per funnel")
	.setElement("Untyped")
	.setFlavorText({ name: "Artifact Usage Survey Report", value: "Found to be a major contributor to toxic spiralling in dungeon delves" })
