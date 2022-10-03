const Labyrinth = require("../../Classes/Labyrinth");

module.exports = new Labyrinth("name", "Untyped", 10)
	.setConsumables(
		{
			Earth: [],
			Fire: [],
			Water: [],
			Wind: [],
			Untyped: [
				"Block Potion",
				"Earthen Potion",
				"Explosion Potion",
				"Fiery Potion",
				"Health Potion",
				"Salt of Oblivion",
				"Quick Pepper",
				"Regen Root",
				"Repair Kit",
				"Smoke Bomb",
				"Stasis Quartz",
				"Strength Spinach",
				"Vitamins",
				"Watery Potion",
				"Windy Potion"
			]
		})
	.setEquipment(
		{
			Earth: {
				Cursed: [
				],
				Common: [
					"Buckler",
					"Infinite Regeneration",
					"Sword",
					"Vigilance Charm",
					"Warhammer"
				],
				Rare: [
					"Guarding Buckler",
					"Heavy Buckler",
					"Urgent Buckler",
					"Guarding Sword",
					"Reckless Sword",
					"Accelerating Sword",
					"Devoted Vigilance Charm",
					"Long Vigilance Charm",
					"Guarding Vigilance Charm",
					"Piercing Warhammer"
				]
			},
			Wind: {
				Cursed: [
				],
				Common: [
					"Bow",
					"Cloak",
					"Daggers",
					"Inspiration",
					"Scythe"
				],
				Rare: [
					"Evasive Bow",
					"Hunter's Bow",
					"Mercurial Bow",
					"Long Cloak",
					"Accelerating Cloak",
					"Thick Cloak",
					"Sharpened Daggers",
					"Sweeping Daggers",
					"Wicked Daggers",
					"Reinforcing Inspiration",
					"Soothing Inspiration",
					"Sweeping Inspiration",
					"Lethal Scythe",
					"Piercing Scythe",
					"Toxic Scythe"
				]
			},
			Water: {
				Cursed: [
				],
				Common: [
					"Blood Aegis",
					"Ice Ward",
					"Life Drain",
					"Midas Staff",
					"Potion Kit",
					"Sickle"
				],
				Rare: [
					"Charging Blood Aegis",
					"Heavy Blood Aegis",
					"Sweeping Blood Aegis",
					"Heavy Ice Ward",
					"Sweeping Ice Ward",
					"Flanking Life Drain",
					"Reactive Life Drain",
					"Urgent Life Drain",
					"Soothing Midas Staff",
					"Accelerating Midas Staff",
					"Urgent Potion Kit",
					"Hunter's Sickle",
					"Sharpened Sickle",
					"Thick Sickle"
				]
			},
			Fire: {
				Cursed: [
				],
				Common: [
					"Barrier",
					"Battleaxe",
					"Censer",
					"Corrosion",
					"Firecracker",
					"Spear",
					"Sun Flare"
				],
				Rare: [
					"Purifying Barrier",
					"Thick Barrier",
					"Urgent Barrier",
					"Prideful Battleaxe",
					"Thick Battleaxe",
					"Thirsting Battleaxe",
					"Flanking Corrosion",
					"Double Firecracker",
					"Mercurial Firecracker",
					"Toxic Firecracker",
					"Lethal Spear",
					"Reactive Spear",
					"Sweeping Spear",
					"Evasive Sun Flare",
					"Accelerating Sun Flare",
					"Tormenting Sun Flare"
				]
			},
			Untyped: {
				Cursed: [
				],
				Common: [
				],
				Rare: [
				]
			}
		})
	.setRooms(
		{
			"Event": ["Element Redistrabution", "Free Gold?", "Health Redistrabution", "The Score Beggar", "Abandoned Forge", "Equipment Merchant", "Rest Site", "Treasure!"],
			"Battle": ["Hawk Fight", "Frog Fight", "Mechabee Fight", "Slime Fight", "Tortoise Fight"],
			"Merchant": ["Equipment Merchant"],
			"Rest Site": ["Rest Site"],
			"Final Battle": ["A Northern Laboratory", "Hall of Mirrors"],
			"Forge": ["Abandoned Forge"],
			"Artifact Guardian": ["A Slimy Throneroom", "A windfall of treasure!"],
			"Treasure": ["Treasure!"],
			"Empty": ["Empty Room"]
		}
	);
