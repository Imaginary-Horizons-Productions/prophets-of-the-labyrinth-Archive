const { MessageEmbed } = require("discord.js");
const fs = require("fs");

exports.versionData = {};
exports.sponsors = {};
exports.injectConfig = function (isProduction) {
	if (isProduction) {
		exports.versionData = require('./Config/versionData.json');
		exports.sponsors = require("./Config/sponsors.json");
	}
	return this;
}

/**
 * Check if the given `id` belongs to a sponsor of the project
 *
 * @param {string} id
 * @returns {boolean} if the id belongs to a sponsor
 */
exports.isSponsor = function (id) {
	let allSponsors = new Set();
	for (const group in exports.sponsors) {
		exports.sponsors[group].forEach(sponsorId => {
			if (!allSponsors.has(sponsorId)) {
				allSponsors.add(sponsorId);
			}
		})
	}
	return allSponsors.has(id);
}


/**
 * Generate an integer between 0 and the given `exclusiveMax`
 *
 * @param {Adventure} adventure the adventure in which to roll
 * @param {number} exclusiveMax the integer after the max roll
 * @param {string} branch which rnTable branch to roll on ("general" or "battle")
 * @returns {number} generated integer
 */
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

/**
 * Calculate the value represented by a mathematical expression (supported operations: multiplication)
 *
 * @param {string} countExpression
 * @param {number} nValue - the value to replace "n" with
 * @returns {number} the calculated value
 */
exports.parseCount = function (countExpression, nValue) {
	return Math.ceil(countExpression.split("*").reduce((total, term) => {
		if (term === "n") {
			return total * nValue;
		} else {
			return total * Number(term);
		}
	}, 1));
}

/**
 * Remove components (buttons and selects) from a given message
 *
 * @param {string} messageId - the id of the message to remove components from
 * @param {MessageManager} messageManager - the MessageManager for the channel the message is in
 */
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

/**
 * Calculates the English cojugation of the ordinal suffix (eg 1st, 2nd, 3rd)
 *
 * @param {number} integer - the integer to calculate the suffix for
 * @returns {string}
 */
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

/**
 * The version embed lists the following: changes in the most recent update, known issues in the most recent update, and links to support the project
 *
 * @param {string} avatarURL
 * @returns {MessageEmbed}
 */
exports.getVersionEmbed = async function (avatarURL) {
	const data = await fs.promises.readFile('./ChangeLog.md', { encoding: 'utf8' });
	const dividerRegEx = /####/g;
	const changesStartRegEx = /\.\d+:/g;
	const knownIssuesStartRegEx = /### Known Issues/g;
	let titleStart = dividerRegEx.exec(data).index;
	changesStartRegEx.exec(data);
	let knownIssuesStart;
	let knownIssueStartResult = knownIssuesStartRegEx.exec(data);
	if (knownIssueStartResult) {
		knownIssuesStart = knownIssueStartResult.index;
	}
	let knownIssuesEnd = dividerRegEx.exec(data).index;

	let embed = new MessageEmbed().setColor('6b81eb')
		.setAuthor({ name: "Click here to check out the Imaginary Horizons GitHub", iconURL: avatarURL, url: "https://github.com/Imaginary-Horizons-Productions" })
		.setTitle(data.slice(titleStart + 5, changesStartRegEx.lastIndex))
		.setURL('https://discord.gg/JxqE9EpKt9')
		.setThumbnail('https://cdn.discordapp.com/attachments/545684759276421120/734099622846398565/newspaper.png')
		.setFooter({ text: "Imaginary Horizons Productions", iconURL: "https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png" })
		.setTimestamp();

	if (knownIssuesStart && knownIssuesStart < knownIssuesEnd) {
		// Known Issues section found
		embed.setDescription(data.slice(changesStartRegEx.lastIndex, knownIssuesStart))
			.addField(`Known Issues`, data.slice(knownIssuesStart + 16, knownIssuesEnd));
	} else {
		// Known Issues section not found
		embed.setDescription(data.slice(changesStartRegEx.lastIndex, knownIssuesEnd));
	}
	return embed.addField(`Become a Sponsor`, `Chip in for server costs or get premimum features by sponsoring [PotL on GitHub](https://github.com/Imaginary-Horizons-Productions/prophets-of-the-labyrinth)`);
}

exports.SAFE_DELIMITER = "→";
