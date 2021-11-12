const fs = require("fs");

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
