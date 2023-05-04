const Artifact = require("../../Classes/Artifact.js");

module.exports = new Artifact("Enchanted Map", "When picking rooms, roll @{copies} more option (duplicate rolls possible, @{buttons} unique options max).")
	.setElement("Untyped")
	.setFlavorText({ name: "*Additional Notes*", value: "*Makes routing real ez*" })
