const Artifact = require("../../Classes/Artifact.js");

module.exports = new Artifact("Oil Painting", "Gain 500g when obtaining this artifact.", "Gain 500g each time")
	.setElement("Untyped")
	.setFlavorText({ name: "Additional Notes", value: "This will likely end up in the museum of a powerful nation." });
