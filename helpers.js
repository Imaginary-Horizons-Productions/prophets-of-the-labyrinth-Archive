const fs = require("fs");

exports.generateRandomNumber = function (adventure, exclusiveMax, branch) {
	if (exclusiveMax === 1) {
		return 0;
	} else {
		branch = branch.toLowerCase();
		let digits = Math.ceil(Math.log2(exclusiveMax) / Math.log2(12));
		let start = adventure.rnIndices[branch];
		let end = start + digits;
		adventure.rnIndices[branch] = end % adventure.rnTable.length;
		let max = 12 ** digits;
		let sectionLength = max / exclusiveMax;
		let roll = parseInt(adventure.rnTable.slice(start, end), 12);
		return Math.floor(roll / sectionLength);
	}
}

exports.parseCount = function (countExpression, nValue) {
	return Math.ceil(countExpression.split("*").reduce((total, term) => {
		if (term === "n") {
			return total * nValue;
		} else {
			return total * Number(term);
		}
	}, 1));
}

exports.clearComponents = function (messageId, messageManager) {
	if (messageId) {
		messageManager.fetch(messageId).then(message => {
			message.edit({ components: [] });
		})
	}
}

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

exports.ordinalSuffixEN = function (integer) {
	let lastDigit = integer % 10;
	let tensDigit = integer % 100 / 10;
	switch (lastDigit) {
		case 1:
			if (tensDigit !== 1) {
				return `${integer}st`;
			}
		case 2:
			if (tensDigit !== 1) {
				return `${integer}nd`;
			}
		case 3:
			if (tensDigit !== 1) {
				return `${integer}rd`;
			}
		default:
			return `${integer}th`;
	}
}
