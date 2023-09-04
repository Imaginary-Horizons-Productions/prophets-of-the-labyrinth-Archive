const Artifact = require("../../Classes/Artifact.js");

module.exports = new Artifact("Amethyst Spyglass", "Get a discount on scouting of @{copies*15} gold.", "Increase discount by 5g per spyglass")
	.setElement("Untyped")
	.setFlavorText({ name: "*Additional Notes*", value: "*Peering through it makes things look blocky*" })
