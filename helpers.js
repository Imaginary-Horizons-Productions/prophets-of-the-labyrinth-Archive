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

exports.versionEmbedBuilder = function (avatarURL) {
	return fs.promises.readFile('./ChangeLog.md', { encoding: 'utf8' }).then(data => {
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
				.addField(`Known Issues`, data.slice(knownIssuesStart + 16, knownIssuesEnd))
		} else {
			// Known Issues section not found
			embed.setDescription(data.slice(changesStartRegEx.lastIndex, knownIssuesEnd));
		}

		return embed.addField(`Become a Sponsor`, `Chip in for server costs or get premimum features by sponsoring [PotL on GitHub](https://github.com/Imaginary-Horizons-Productions/prophets-of-the-labyrinth)`);
	})
}

exports.SAFE_DELIMITER = "→";