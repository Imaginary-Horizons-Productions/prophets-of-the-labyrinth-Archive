const fs = require("fs");

exports.patrons = require("./Config/patrons.json");
exports.getPremiumUsers = function () {
	return exports.patrons.cartographers.concat(exports.patrons.archivists, exports.patrons.grandArchivists, exports.patrons.developers, exports.patrons.giftPremium);
}

exports.ELEMENTS = ["Fire", "Earth", "Light", "Water", "Wind", "Darkness"];

exports.ensuredPathSave = function (path, fileName, data) {
	if (!fs.existsSync(path)) {
		fs.mkdirSync(path, { recursive: true });
	}
	fs.writeFile(path + "/" + fileName, data, "utf8", error => {
		if (error) {
			console.error(error);
		}
	})
}
