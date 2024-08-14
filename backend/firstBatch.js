const axios = require('axios');
const Market = require("./models/market.model.js")
const Pet = require('./models/pet.model.js')
const PetLibary =require("./models/petLibary.model.js")

const generateUniqueCode = (userId) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const codeLength = 6;
  let code = '';
  // Generate random bytes and map them to characters
  for (let i = 0; i < codeLength; i++) {
    const randomByte = crypto.randomBytes(1)[0];
    const characterIndex = randomByte % characters.length;
    code += characters.charAt(characterIndex);
  }
  // Create a hash of the userId and random code
  const hash = crypto.createHash('sha256').update(userId + code).digest('hex');
  const uniquePart = hash.slice(0, 4).toUpperCase(); // Take the first 6 characters for uniqueness

  return `${code.slice(0, 4)}${uniquePart}`;
};

const lightPets = [
  {
    "name": "Luminara",
    "baseHealth": 500,
    "baseAttack": 350,
    "baseDefense": 250,
    "baseManaCost": 55,
    "baseCost": 1000,
    "illustration": "https://res.cloudinary.com/dnmwhbb15/image/upload/f_auto,q_auto/v1/GameAssets/Pets/LightPets/woikydevqeaxph0gpmwq",
    "description": "A radiant humanoid figure with wings made of pure light, its body glowing with a soft golden hue. Species: Angel",
    "lore": "Luminara, born from the first light of dawn, is a beacon of hope and protection. Its blinding light acts as both a shield and a weapon, making it an ideal Guardian. Its thick aura of light makes it resilient to darkness, providing a natural defense.",
    "class": "Guardian",
    "element": ["Light"],
    "weaknesses": ["Shadow"],
    "strengths": ["Shadow", "Air"],
    "species": "Angel"
  },
  {
    "name": "Solara",
    "baseHealth": 480,
    "baseAttack": 360,
    "baseDefense": 240,
    "baseManaCost": 54,
    "baseCost": 980,
    "illustration": "https://res.cloudinary.com/dnmwhbb15/image/upload/f_auto,q_auto/v1/GameAssets/Pets/LightPets/pemg0tlqxn62lazppqe4",
    "description": "A fierce embodiment of sunlight, with a mane of flames and eyes that burn like the sun. Species: Solar Lion",
    "lore": "Solara, forged in the heart of a star, channels the raw energy of the sun. Its intense heat and radiant glow make it a powerful Breaker, shattering defenses with solar flares. The sheer intensity of its light overwhelms shadows, ensuring its dominance.",
    "class": "Breaker",
    "element": ["Light","Fire"],
    "weaknesses": ["Shadow","Water"],
    "strengths": ["Shadow", "Air","Ice"],
    "species": "Solar Lion"
  },
  {
    "name": "Radiantix",
    "baseHealth": 470,
    "baseAttack": 370,
    "baseDefense": 230,
    "baseManaCost": 56,
    "baseCost": 1010,
    "illustration": "https://res.cloudinary.com/dnmwhbb15/image/upload/f_auto,q_auto/v1/GameAssets/Pets/LightPets/asv7b2fbdx3ksioqa4p6",
    "description": "A swift, ethereal entity with a shimmering, translucent body that emits trails of light. Species: Light Spirit",
    "lore": "Radiantix, a spirit of pure energy, moves with unparalleled speed. Its agility and lightness make it a perfect Nimble class, evading attacks while delivering swift counters. Its radiant trails disorient foes, enhancing its evasive capabilities.",
    "class": "Nimble",
    "element": ["Light", "Air"],
    "weaknesses": ["Shadow", "Earth"],
    "strengths": ["Shadow", "Water", "Ice"],
    "species": "Light Spirit"
  },
  {
    "name": "Gleamshade",
    "baseHealth": 460,
    "baseAttack": 360,
    "baseDefense": 240,
    "baseManaCost": 55,
    "baseCost": 990,
    "illustration": "https://res.cloudinary.com/dnmwhbb15/image/upload/f_auto,q_auto/v1/GameAssets/Pets/LightPets/mrpxgpkxolec95vvkdzl",
    "description": "A shadowy figure with glowing white eyes and a cloak that shifts between light and dark. Species: Shadow Wraith",
    "lore": "Gleamshade, a paradox of existence, blends the powers of light and shadow. This duality makes it a formidable Predator, able to strike from the shadows with bursts of light. Its elusive nature allows it to adapt and survive in both realms.",
    "class": "Predator",
    "element": ["Light", "Shadow"],
    "weaknesses": ["Water", "Earth"],
    "strengths": ["Shadow", "Air", "Fire"],
    "species": "Shadow Wraith"
  },
  {
    "name": "Lumifrost",
    "baseHealth": 450,
    "baseAttack": 350,
    "baseDefense": 250,
    "baseManaCost": 57,
    "baseCost": 980,
    "illustration": "https://res.cloudinary.com/dnmwhbb15/image/upload/f_auto,q_auto/v1/GameAssets/Pets/LightPets/ewaycvbbppqtrfwxhp9p",
    "description": "A radiant ice being with crystalline wings and a body that glows with a cold luminescence. Species: Ice Seraph",
    "lore": "Lumifrost, born from the union of light and ice, combines the resilience of both elements. Its chilling radiance makes it a unique Guardian, using its icy shell to shield against attacks. The light within it amplifies its defensive capabilities.",
    "class": "Guardian",
    "element": ["Light", "Ice"],
    "weaknesses": ["Shadow", "Metal"],
    "strengths": ["Shadow", "Water", "Air"],
    "species": "Ice Seraph"
  },
  {
    "name": "Aurelia",
    "baseHealth": 480,
    "baseAttack": 340,
    "baseDefense": 260,
    "baseManaCost": 55,
    "baseCost": 1000,
    "illustration": "https://i.pinimg.com/originals/bf/2e/f1/bf2ef131e5cebb68d61fab2cb2c8c9f8.jpg",
    "description": "A magnificent unicorn with a shimmering golden horn and a mane that glows like sunlight. Species: Unicorn",
    "lore": "Aurelia, the majestic unicorn, embodies purity and light. Its golden horn and radiant presence make it an exceptional Guardian, protecting the innocent with its divine light. Its swift movements and powerful aura provide defense against darkness and evil.",
    "class": "Guardian",
    "element": ["Light"],
    "weaknesses": ["Shadow"],
    "strengths": ["Shadow", "Earth"],
    "species": "Unicorn"
  },
  {
  "name": "Radiant Griffin",
  "baseHealth": 720,
  "baseAttack": 440,
  "baseDefense": 360,
  "baseManaCost": 75,
  "baseCost": 1500,
  "illustration": "https://i.pinimg.com/originals/11/65/53/1165538854baa61fac9a518fa1a1fa46.jpg",
  "description": "A majestic griffin with golden feathers that radiate light and sharp, powerful talons. Species: Griffin",
  "lore": "Radiant Griffin, the regal guardian of the skies, embodies the essence of light and majesty. With its glowing feathers and piercing gaze, it wards off darkness. Its immense strength and protective nature make it an elite Guardian.",
  "class": "Guardian",
  "element": ["Light"],
  "weaknesses": ["Shadow"],
  "strengths": ["Shadow"],
  "species": "Griffin"
}
];

const shadowPets = [
  {
  "name": "Void Behemoth",
  "baseHealth": 740,
  "baseAttack": 460,
  "baseDefense": 370,
  "baseManaCost": 78,
  "baseCost": 1550,
  "illustration": "https://res.cloudinary.com/dnmwhbb15/image/upload/f_auto,q_auto/v1/GameAssets/Pets/shadowPets/jnz0osufoljfa4nabqgp",
  "description": "A monstrous behemoth cloaked in shadow, with eyes that glow with malevolent energy. Species: Behemoth",
  "lore": "Void Behemoth, the colossal terror of the abyss, harnesses the power of darkness to instill fear in its foes. Its immense bulk and ferocious strength make it a formidable Breaker, while its shadowy aura grants it resistance to light and nature.",
  "class": "Breaker",
  "element": ["Shadow"],
  "weaknesses": ["Light"],
  "strengths": ["Nature"],
  "species": "Behemoth"
},
  {
    "name": "Umbra",
    "baseHealth": 510,
    "baseAttack": 330,
    "baseDefense": 270,
    "baseManaCost": 54,
    "baseCost": 1020,
    "illustration": "https://res.cloudinary.com/dnmwhbb15/image/upload/f_auto,q_auto/v1/GameAssets/Pets/shadowPets/wsfmbpjtbf5nuyejwsqt",
    "description": "A shadowy figure with red, glowing eyes and a cloak that seems to absorb all light. Species: Shadow Demon",
    "lore": "Umbra, a manifestation of pure shadow, thrives in the absence of light. Its ability to meld with darkness makes it an exceptional Predator, ambushing prey from the shadows. Its shadowy form grants it an innate ability to evade light-based attacks.",
    "class": "Predator",
    "element": ["Shadow"],
    "weaknesses": ["Light"],
    "strengths": ["Shadow", "Fire"],
    "species": "Shadow Demon"
  },
  {
    "name": "Nocturna",
    "baseHealth": 500,
    "baseAttack": 340,
    "baseDefense": 260,
    "baseManaCost": 55,
    "baseCost": 1010,
    "illustration": "https://res.cloudinary.com/dnmwhbb15/image/upload/f_auto,q_auto/v1/GameAssets/Pets/shadowPets/utnhrfcedlugis19gsnn",
    "description": "A sleek, panther-like creature with fur as dark as night and eyes that gleam in the darkness. Species: Night Panther",
    "lore": "Nocturna, a creature of the night, moves with silent grace. Its stealth and agility make it a perfect Nimble class, striking swiftly and vanishing without a trace. Its connection to the darkness enhances its evasive maneuvers.",
    "class": "Nimble",
    "element": ["Shadow"],
    "weaknesses": ["Light"],
    "strengths": ["Shadow", "Fire"],
    "species": "Night Panther"
  },
  {
    "name": "Obsidian",
    "baseHealth": 520,
    "baseAttack": 320,
    "baseDefense": 280,
    "baseManaCost": 53,
    "baseCost": 1030,
    "illustration": "https://i.pinimg.com/originals/25/00/70/250070d904787f237911d41625b5623a.jpg",
    "description": "A towering figure of dark rock, with jagged edges and a surface that absorbs light. Species: Stone Golem",
    "lore": "Obsidian, forged from volcanic rock and infused with dark magic, is an imposing Guardian. Its hardened exterior provides exceptional defense, while its dark magic repels light-based attacks. It stands as an unyielding sentinel in the dark lands.",
    "class": "Guardian",
    "element": ["Shadow", "Earth"],
    "weaknesses": ["Light"],
    "strengths": ["Shadow", "Metal"],
    "species": "Stone Golem"
  },
  {
    "name": "Erebos",
    "baseHealth": 490,
    "baseAttack": 350,
    "baseDefense": 260,
    "baseManaCost": 56,
    "baseCost": 1040,
    "illustration": "https://res.cloudinary.com/dnmwhbb15/image/upload/f_auto,q_auto/v1/GameAssets/Pets/shadowPets/noq9rfdmb4gpzjozlqh9",
    "description": "A spectral figure with an ethereal form and glowing purple eyes. Species: Wraith",
    "lore": "Erebos, a wraith born from the darkest shadows, moves silently through the night. Its ghostly form makes it a formidable Breaker, able to bypass physical defenses and strike at the soul. Its presence alone can instill fear in the bravest of hearts.",
    "class": "Breaker",
    "element": ["Shadow", "Air"],
    "weaknesses": ["Light"],
    "strengths": ["Shadow", "Metal", "Fire"],
    "species": "Wraith"
  },
  {
    "name": "Nightmare",
    "baseHealth": 500,
    "baseAttack": 340,
    "baseDefense": 270,
    "baseManaCost": 57,
    "baseCost": 1050,
    "illustration": "https://res.cloudinary.com/dnmwhbb15/image/upload/f_auto,q_auto/v1/GameAssets/Pets/shadowPets/ja4ukxatctmzbvfpffel",
    "description": "A dark steed with fiery eyes and a mane that burns with black flames. Species: Hell Horse",
    "lore": "Nightmare, the fearsome steed of the underworld, is a creature of nightmares. Its fiery mane and burning eyes make it an unmatched Predator, chasing down its prey with relentless speed. The black flames that surround it incinerate those who dare to oppose it.",
    "class": "Predator",
    "element": ["Shadow", "Fire"],
    "weaknesses": ["Light"],
    "strengths": ["Shadow", "Metal"],
    "species": "Hell Horse"
  },
  {
    "name": "Shadow Knight",
    "baseHealth": 510,
    "baseAttack": 330,
    "baseDefense": 270,
    "baseManaCost": 54,
    "baseCost": 1020,
    "illustration": "https://res.cloudinary.com/dnmwhbb15/image/upload/f_auto,q_auto/v1/GameAssets/Pets/shadowPets/ja4ukxatctmzbvfpffel",
    "description": "A towering knight in black armor, with glowing red eyes and a sword that emits dark energy. Species: Dark Knight",
    "lore": "Shadow Knight, a fearsome warrior from the abyss, is a master of darkness. Its heavy armor and powerful sword make it an exceptional Guardian, protecting allies and delivering devastating blows to enemies. The dark energy it wields amplifies its strength and resilience.",
    "class": "Guardian",
    "element": ["Shadow"],
    "weaknesses": ["Light"],
    "strengths": ["Shadow", "Fire"],
    "species": "Dark Knight"
  }
];

const firePets = [
  {
    "name": "Ifrit",
    "baseHealth": 510,
    "baseAttack": 380,
    "baseDefense": 220,
    "baseManaCost": 60,
    "baseCost": 1050,
    "illustration": "https://res.cloudinary.com/dnmwhbb15/image/upload/f_auto,q_auto/v1/GameAssets/Pets/firePets/hayw9fvxtwvlmjrueacr",
    "description": "A towering figure wreathed in flames, with eyes that burn like hot coals. Species: Fire Demon",
    "lore": "Ifrit, a powerful fire demon from ancient lore, commands the flames with unrivaled mastery. Its fiery aura and destructive power make it a fearsome Breaker, capable of incinerating defenses and scorching enemies. The searing flames that make up its body grant it resistance to cold and earth attacks.",
    "class": "Breaker",
    "element": ["Fire"],
    "weaknesses": ["Water"],
    "strengths": ["Earth", "Metal", "Nature"],
    "species": "Fire Demon"
  },
  {
    "name": "Salamander",
    "baseHealth": 490,
    "baseAttack": 340,
    "baseDefense": 250,
    "baseManaCost": 54,
    "baseCost": 980,
    "illustration": "https://res.cloudinary.com/dnmwhbb15/image/upload/f_auto,q_auto/v1/GameAssets/Pets/firePets/hnsji1qenl2ydzhfu1yo",
    "description": "A small, agile lizard-like creature with scales that glow like embers and eyes that smolder with inner fire. Species: Fire Lizard",
    "lore": "Salamander, a creature of ancient legend, thrives in the hottest environments. Its swift movements and fiery breath make it a perfect Nimble class, evading attacks and striking with blazing speed. Its ember-like scales provide a natural defense against ice and nature attacks.",
    "class": "Nimble",
    "element": ["Fire"],
    "weaknesses": ["Water"],
    "strengths": ["Earth", "Metal", "Nature"],
    "species": "Fire Lizard"
  },
  {
    "name": "Phoenix",
    "baseHealth": 500,
    "baseAttack": 350,
    "baseDefense": 230,
    "baseManaCost": 56,
    "baseCost": 1000,
    "illustration": "https://res.cloudinary.com/dnmwhbb15/image/upload/f_auto,q_auto/v1/GameAssets/Pets/firePets/lqnpbfoerrgzgl5n24di",
    "description": "A majestic bird of fire, with vibrant plumage that blazes with every movement and a cry that echoes with the heat of the sun. Species: Phoenix",
    "lore": "Phoenix, the eternal symbol of rebirth, rises from its own ashes with renewed strength. Its ability to resurrect makes it an ideal Guardian, protecting its allies with its fiery presence. The flames that envelop its body offer protection against metal and nature attacks.",
    "class": "Guardian",
    "element": ["Fire"],
    "weaknesses": ["Water"],
    "strengths": ["Earth", "Metal", "Nature"],
    "species": "Phoenix"
  },
  {
  "name": "Inferno Basilisk",
  "baseHealth": 700,
  "baseAttack": 450,
  "baseDefense": 350,
  "baseManaCost": 72,
  "baseCost": 1450,
  "illustration": "https://res.cloudinary.com/dnmwhbb15/image/upload/f_auto,q_auto/v1/GameAssets/Pets/firePets/xwodyycgr9pd3p30kegn",
  "description": "A fearsome basilisk with scales that burn with an eternal flame and eyes that can ignite anything they gaze upon. Species: Basilisk",
  "lore": "Inferno Basilisk, the fiery serpent of legends, scorches everything in its path. Its burning scales and piercing gaze make it a deadly Predator. The basilisk's fire grants it resistance to ice and nature.",
  "class": "Predator",
  "element": ["Fire"],
  "weaknesses": ["Water"],
  "strengths": ["Ice", "Nature"],
  "species": "Basilisk"
}
];

const waterPets = [
  {
    "name": "Leviathan",
    "baseHealth": 520,
    "baseAttack": 370,
    "baseDefense": 240,
    "baseManaCost": 58,
    "baseCost": 1080,
    "illustration": "https://i.pinimg.com/originals/59/30/de/5930de0136729559ee654f1cb5392a0f.jpg",
    "description": "A colossal sea serpent with scales as tough as steel and eyes that glow like deep ocean pearls. Species: Sea Serpent",
    "lore": "Leviathan, the ancient sea serpent, rules the depths with its immense power. Its immense size and strength make it an indomitable Guardian, capable of crushing foes with its massive coils. The cold, crushing depths of its home grant it resistance to fire and lightning.",
    "class": "Guardian",
    "element": ["Water"],
    "weaknesses": ["Lightning"],
    "strengths": ["Fire", "Earth", "Ice"],
    "species": "Sea Serpent"
  },
  {
    "name": "Naiad",
    "baseHealth": 480,
    "baseAttack": 320,
    "baseDefense": 260,
    "baseManaCost": 52,
    "baseCost": 960,
    "illustration": "https://res.cloudinary.com/dnmwhbb15/image/upload/f_auto,q_auto/v1/GameAssets/Pets/waterPets/akbzw01pjnhg78grhocu",
    "description": "A graceful water spirit with flowing hair and skin that shimmers like a clear lake. Species: Water Nymph",
    "lore": "Naiad, the ethereal water nymph, dances through the streams and rivers with unmatched agility. Its fluid movements and healing powers make it a perfect Nimble class, evading attacks and providing support to allies. Its watery form grants it resistance to fire and lightning.",
    "class": "Nimble",
    "element": ["Water"],
    "weaknesses": ["Lightning"],
    "strengths": ["Fire", "Earth", "Ice"],
    "species": "Water Nymph"
  },
  {
    "name": "Kraken",
    "baseHealth": 510,
    "baseAttack": 360,
    "baseDefense": 250,
    "baseManaCost": 56,
    "baseCost": 1000,
    "illustration": "https://i.pinimg.com/originals/3f/2c/61/3f2c61117637c9615072888e502152c0.jpg",
    "description": "A massive cephalopod with tentacles that stretch for miles and eyes that pierce the darkest depths. Species: Sea Monster",
    "lore": "Kraken, the legendary sea monster, strikes terror into the hearts of sailors. Its tentacles can crush ships and drag enemies into the abyss, making it an exceptional Breaker. The ocean's embrace grants it resistance to fire and lightning.",
    "class": "Breaker",
    "element": ["Water"],
    "weaknesses": ["Lightning"],
    "strengths": ["Fire", "Earth", "Ice"],
    "species": "Sea Monster"
  },
  {
    "name": "Siren",
    "baseHealth": 490,
    "baseAttack": 330,
    "baseDefense": 270,
    "baseManaCost": 54,
    "baseCost": 980,
    "illustration": "https://i.pinimg.com/originals/4a/4d/cc/4a4dcc6a3553808e2ffa11557d2ca297.jpg",
    "description": "A beautiful yet deadly creature with a voice that lures sailors to their doom and eyes as deep as the ocean. Species: Sea Enchantress",
    "lore": "Siren, the enchanting sea creature, uses its haunting song to mesmerize and control its prey. Its captivating presence and charm make it an ideal Predator, luring enemies into traps and ambushes. The ocean's protection grants it resistance to fire and lightning.",
    "class": "Predator",
    "element": ["Water"],
    "weaknesses": ["Lightning"],
    "strengths": ["Fire", "Earth", "Ice"],
    "species": "Sea Enchantress"
  },
];


const earthPets = [
  {
    "name": "Golem",
    "baseHealth": 540,
    "baseAttack": 350,
    "baseDefense": 280,
    "baseManaCost": 60,
    "baseCost": 1100,
    "illustration": "https://i.pinimg.com/originals/81/8c/18/818c188bf84fb0b757d873c99deb9dc8.jpg",
    "description": "A massive stone creature with a body made of rocks and minerals, and eyes that glow with an inner light. Species: Stone Guardian",
    "lore": "Golem, the mighty stone guardian, stands as a fortress against any foe. Its immense strength and durability make it an unbeatable Guardian, protecting allies with its massive frame. The solid rock that makes up its body grants it resistance to fire and metal.",
    "class": "Guardian",
    "element": ["Earth"],
    "weaknesses": ["Lightning"],
    "strengths": ["Fire", "Metal", "Nature"],
    "species": "Stone Guardian"
  },
  {
    "name": "Treant",
    "baseHealth": 500,
    "baseAttack": 310,
    "baseDefense": 290,
    "baseManaCost": 54,
    "baseCost": 980,
    "illustration": "https://i.pinimg.com/originals/08/08/1a/08081a1831409bd87994fad4f791ad07.jpg",
    "description": "A towering tree creature with branches for arms and roots that dig deep into the earth. Species: Tree Guardian",
    "lore": "Treant, the ancient tree guardian, embodies the spirit of the forest. Its strong roots and sturdy trunk make it a perfect Guardian, shielding allies and withstanding attacks. The deep connection to the earth grants it resistance to fire and metal.",
    "class": "Guardian",
    "element": ["Earth", "Nature"],
    "weaknesses": ["Fire"],
    "strengths": ["Metal"],
    "species": "Tree Guardian"
  },
 {
  "name": "Terra Titan",
  "baseHealth": 760,
  "baseAttack": 480,
  "baseDefense": 390,
  "baseManaCost": 82,
  "baseCost": 1650,
  "illustration": "https://i.pinimg.com/originals/c7/72/d0/c772d0ef098d4ba2fe2239568d147661.jpg",
  "description": "A colossal titan with a body made of rock and stone, imbued with the power of the earth itself. Species: Titan",
  "lore": "Terra Titan, the ancient guardian of the mountains, wields the power of the earth to protect its domain. Its rocky form and immense strength make it a formidable Guardian. The titan's earth grants it resistance to water and metal.",
  "class": "Guardian",
  "element": ["Earth"],
  "weaknesses": ["Air"],
  "strengths": ["Water", "Metal"],
  "species": "Titan"
},
  {
    "name": "Stone Basilisk",
    "baseHealth": 500,
    "baseAttack": 350,
    "baseDefense": 250,
    "baseManaCost": 57,
    "baseCost": 1020,
    "illustration": "https://i.pinimg.com/originals/8e/0b/f7/8e0bf77c2a0a775926ec7e1e5efacc1e.jpg",
    "description": "A massive serpent with eyes that can turn creatures to stone and scales as hard as rock. Species: Stone Serpent",
    "lore": "Basilisk, the fearsome stone serpent, is a creature of legend. Its petrifying gaze and rock-hard scales make it a dangerous Predator, capable of immobilizing and crushing its prey. The stony nature of its body grants it resistance to fire and metal.",
    "class": "Predator",
    "element": ["Earth"],
    "weaknesses": ["Lightning"],
    "strengths": ["Fire", "Metal", "Nature"],
    "species": "Stone Serpent"
  },
  {
    "name": "Behemoth",
    "baseHealth": 530,
    "baseAttack": 360,
    "baseDefense": 260,
    "baseManaCost": 59,
    "baseCost": 1080,
    "illustration": "https://i.pinimg.com/originals/7b/a5/51/7ba55146fb104384a6730f2640317fd4.jpg",
    "description": "A colossal beast with a body covered in thick, rocky armor and a roar that shakes the ground. Species: Earth elephant",
    "lore": "Behemoth, the massive earth beast, is a force of nature. Its immense strength and unyielding armor make it an unbeatable Guardian, defending allies with its sheer bulk. The rocky armor that covers its body grants it resistance to fire and metal.",
    "class": "Guardian",
    "element": ["Earth"],
    "weaknesses": ["Lightning"],
    "strengths": ["Fire", "Metal", "Nature"],
    "species": "Earth Beast"
  }
];


const airPets = [
  {
    "name": "Griffin",
    "baseHealth": 500,
    "baseAttack": 350,
    "baseDefense": 270,
    "baseManaCost": 55,
    "baseCost": 1000,
    "illustration": "https://i.pinimg.com/originals/4b/37/0d/4b370d01db9a29bb14c5c56dfd056b4a.jpg",
    "description": "A majestic creature with the body of a lion and the wings and head of an eagle. Species: Mythical Beast",
    "lore": "Griffin, the majestic mythical beast, soars through the skies with unmatched grace. Its powerful wings and sharp claws make it a formidable Breaker, tearing through enemies from above. The freedom of the skies grants it resistance to lightning and earth.",
    "class": "Breaker",
    "element": ["Air"],
    "weaknesses": ["Ice"],
    "strengths": ["Lightning", "Earth"],
    "species": "Mythical Beast"
  },
  {
    "name": "Sylph",
    "baseHealth": 480,
    "baseAttack": 320,
    "baseDefense": 290,
    "baseManaCost": 52,
    "baseCost": 960,
    "illustration": "http://i.pinimg.com/736x/af/f7/b6/aff7b6471fb31183f69db307217ac90d.jpg",
    "description": "A delicate air spirit with a body that shimmers like the morning dew and wings like a dragonfly. Species: Air Nymph",
    "lore": "Sylph, the ethereal air nymph, dances through the winds with unmatched agility. Its light, nimble movements and soothing presence make it an ideal Nimble, evading attacks and providing support to allies. The airy nature grants it resistance to lightning and earth.",
    "class": "Nimble",
    "element": ["Air"],
    "weaknesses": ["Ice"],
    "strengths": ["Lightning", "Earth"],
    "species": "Air Nymph"
  },
  {
    "name": "Thunderbird",
    "baseHealth": 510,
    "baseAttack": 340,
    "baseDefense": 260,
    "baseManaCost": 56,
    "baseCost": 1000,
    "illustration": "https://i.pinimg.com/originals/ed/f5/ee/edf5ee96f84c3513cbeac1c3dd8f16d6.jpg",
    "description": "A powerful bird of prey with feathers crackling with electricity and eyes that glow like storm clouds. Species: Storm Bird",
    "lore": "Thunderbird, the mighty storm bird, commands the power of the skies. Its electrifying presence and powerful wings make it a formidable Breaker, striking foes with lightning speed. The connection to the storm grants it resistance to lightning and earth.",
    "class": "Breaker",
    "element": ["Air", "Lightning"],
    "weaknesses": ["Ice"],
    "strengths": ["Earth"],
    "species": "Storm Bird"
  },
];

const metalPets = [
  {
    "name": "Ironclad Golem",
    "baseHealth": 550,
    "baseAttack": 340,
    "baseDefense": 300,
    "baseManaCost": 60,
    "baseCost": 1100,
    "illustration": "https://i.pinimg.com/originals/c7/2a/01/c72a01bd29931e6722f8eb5ac66334ac.jpg",
    "description": "A towering golem made entirely of iron, with a body that gleams like polished metal. Species: Metal Golem",
    "lore": "Ironclad Golem, the imposing metal golem, stands as an indomitable Guardian on the battlefield. Its metallic skin provides formidable protection, making it a robust Guardian. The metal's durability grants it resistance to earth and fire.",
    "class": "Guardian",
    "element": ["Metal"],
    "weaknesses": ["Fire"],
    "strengths": ["Earth", "Water"],
    "species": "Metal Golem"
  },
  {
    "name": "Titan Forge",
    "baseHealth": 500,
    "baseAttack": 320,
    "baseDefense": 270,
    "baseManaCost": 55,
    "baseCost": 1000,
    "illustration": "https://i.pinimg.com/originals/88/01/4f/88014f372f7bc6966aff058bfb402ab4.jpg",
    "description": "A massive, humanoid figure with a body of forged metal and eyes like molten lava. Species: Metal Colossus",
    "lore": "Titan Forge, the colossal metal colossus, wields the power of the forge. Its immense strength and metallic form make it a powerful Guardian. The metal's resilience grants it resistance to earth and fire.",
    "class": "Guardian",
    "element": ["Metal"],
    "weaknesses": ["Fire"],
    "strengths": ["Earth", "Water"],
    "species": "Metal Colossus"
  }
];


const lightningPets =[
 {
    "name": "Thunder Drake",
    "baseHealth": 520,
    "baseAttack": 370,
    "baseDefense": 250,
    "baseManaCost": 58,
    "baseCost": 1080,
    "illustration": "https://i.pinimg.com/originals/f8/51/1c/f8511ce6881e0ca60e70350c221b69ca.jpg",
    "description": "A dragon-like creature with scales that crackle with electricity and eyes that flash like lightning. Species: Storm Dragon",
    "lore": "Thunder Drake, the fearsome storm dragon, commands the power of the thunderstorm. Its electrifying presence and powerful breath make it an unmatched Guardian, shielding allies with its immense power. The storm's embrace grants it resistance to water and metal.",
    "class": "Guardian",
    "element": ["Lightning"],
    "weaknesses": ["Earth"],
    "strengths": ["Water", "Metal"],
    "species": "Storm Dragon"
  },
  {
  "name": "Storm Colossus",
  "baseHealth": 740,
  "baseAttack": 470,
  "baseDefense": 360,
  "baseManaCost": 76,
  "baseCost": 1500,
  "illustration": "https://i.pinimg.com/originals/7a/b5/79/7ab5794889b205fa0427fbdb863bd93a.jpg",
  "description": "A gigantic colossus infused with the power of storms, with lightning crackling around its massive frame. Species: Colossus",
  "lore": "Storm Colossus, the embodiment of the tempest, harnesses the power of lightning to obliterate its foes. Its electrified form and devastating attacks make it a powerful Breaker. The colossus's lightning grants it resistance to water and air.",
  "class": "Breaker",
  "element": ["Lightning"],
  "weaknesses": ["Earth"],
  "strengths": ["Water", "Air"],
  "species": "Colossus"
}
  
]

const icePets = [
  {
    "name": "Frost Dragon",
    "baseHealth": 530,
    "baseAttack": 360,
    "baseDefense": 280,
    "baseManaCost": 58,
    "baseCost": 1080,
    "illustration": "https://i.pinimg.com/originals/28/61/83/2861838b9124c0217f087c1b440f63b7.jpg",
    "description": "A fearsome dragon with scales covered in shimmering frost and eyes like icy crystals. Species: Ice Dragon",
    "lore": "Frost Dragon, the fearsome ice dragon, breathes a chilling frost upon its enemies. Its powerful ice breath and icy scales make it a formidable Guardian, shielding allies with its icy defense. The cold embrace grants it resistance to fire and nature.",
    "class": "Guardian",
    "element": ["Ice"],
    "weaknesses": ["Fire"],
    "strengths": ["Fire", "Nature"],
    "species": "Ice Dragon"
  },
  {
    "name": "Glacier Behemoth",
    "baseHealth": 510,
    "baseAttack": 340,
    "baseDefense": 290,
    "baseManaCost": 54,
    "baseCost": 960,
    "illustration": "https://i.pinimg.com/originals/09/13/be/0913be043009204ba9b39ae634b8e23d.jpg",
    "description": "A massive creature with a body of ice and frost, towering over its foes. Species: Ice Giant",
    "lore": "Glacier Behemoth, the colossal ice giant, wields the power of the glacier. Its icy body and massive size make it a great Guardian, absorbing hits and dealing crushing blows. The glacier's power grants it resistance to fire and nature.",
    "class": "Guardian",
    "element": ["Ice"],
    "weaknesses": ["Fire"],
    "strengths": ["Fire", "Nature"],
    "species": "Ice Giant"
  },
  {
    "name": "Ice Golem",
    "baseHealth": 520,
    "baseAttack": 350,
    "baseDefense": 280,
    "baseManaCost": 56,
    "baseCost": 1000,
    "illustration": "https://i.pinimg.com/originals/d6/82/88/d6828870fa444bf85bd59a8346a21c60.jpg",
    "description": "A massive golem made of ice and frost, with immense strength and resilience. Species: Ice Colossus",
    "lore": "Ice Golem, the formidable ice colossus, stands as a bastion of frost. Its immense strength and icy body make it a powerful Guardian, absorbing blows and striking back with icy force. The glacier's power grants it resistance to fire and nature.",
    "class": "Guardian",
    "element": ["Ice"],
    "weaknesses": ["Fire"],
    "strengths": ["Fire", "Nature"],
    "species": "Ice Colossus"
  },

];


const naturePets = [
  {
    "name": "Ancient Treant",
    "baseHealth": 550,
    "baseAttack": 320,
    "baseDefense": 300,
    "baseManaCost": 58,
    "baseCost": 1050,
    "illustration": "https://i.pinimg.com/originals/08/7a/b2/087ab27947b1dd5d463f2f4b21652c05.jpg",
    "description": "A towering tree-like creature with a bark-covered body and branches that stretch toward the sky. Species: Treant",
    "lore": "Ancient Treant, the venerable treant, is a formidable Guardian of the forest. Its thick bark and towering presence provide excellent defense and support. The ancient wood grants it resistance to fire and metal.",
    "class": "Guardian",
    "element": ["Nature"],
    "weaknesses": ["Fire"],
    "strengths": ["Water", "Earth"],
    "species": "Treant"
  },

  {
    "name": "Vine Golem",
    "baseHealth": 510,
    "baseAttack": 340,
    "baseDefense": 290,
    "baseManaCost": 56,
    "baseCost": 1000,
    "illustration": "https://i.pinimg.com/originals/d6/65/4a/d6654abd06ae0ca2f6d732f80a25c941.jpg",
    "description": "A massive golem covered in thick vines and leaves, with a powerful presence in the forest. Species: Golem",
    "lore": "Vine Golem, the massive forest guardian, stands as a protector of the woodland realms. Its vine-covered body and immense strength make it a powerful Guardian. The forest's magic grants it resistance to fire and metal.",
    "class": "Guardian",
    "element": ["Nature"],
    "weaknesses": ["Fire"],
    "strengths": ["Water", "Earth"],
    "species": "Golem"
  }
];
const creatures = [
  {
    name: "Shadow Warrior",
    baseHealth: 450,  // Adjusted to be less than 500
    baseAttack: 90,  // Adjusted to maintain balance
    baseDefense: 60,  // Adjusted within limits
    baseManaCost: 60,  // Adjusted to balance with lower health
    baseCost: 1000,  // Proportional to other stats
    illustration: "https://i.pinimg.com/originals/2b/1c/9a/2b1c9aa79943e73394a075341031d996.jpg",
    description: "A fearsome warrior of the shadows, wielding dark powers to break through enemy defenses. Its presence alone instills fear.",
    lore: "Shadow Warrior, a shadowy fighter, excels in breaking enemy defenses with dark magic. Fear follows its every step.",
    class: "Breaker",
    element: ["Shadow"],
    weaknesses: ["Light"],
    strengths: ["Shadow", "Metal"],
    species: "Warrior"
  },
  {
    name: "Radiant Drake",
    baseHealth: 480,  // Adjusted to be less than 500
    baseAttack: 95,  // Adjusted to maintain balance
    baseDefense: 70,  // Adjusted within limits
    baseManaCost: 85,  // Adjusted to balance with lower health
    baseCost: 1200,  // Proportional to other stats
    illustration: "https://i.pinimg.com/originals/c1/c2/a4/c1c2a484a5c69b4529a3cc21030bf8d4.jpg",
    description: "A majestic dragon imbued with the power of light, shattering enemy lines with radiant strikes.",
    lore: "Radiant Drake, a majestic creature, harnesses the power of light to shatter enemy lines with radiant strikes.",
    class: "Breaker",
    element: ["Light"],
    weaknesses: ["Shadow"],
    strengths: ["Fire", "Air"],
    species: "Dragon"
  },
  {
    name: "Inferno Beast",
    baseHealth: 490,  // Adjusted to be less than 500
    baseAttack: 85,  // Adjusted within limits
    baseDefense: 140,  // Adjusted within limits
    baseManaCost: 75,  // Adjusted to balance with lower health
    baseCost: 1300,  // Proportional to other stats
    illustration: "https://i.pinimg.com/originals/14/e2/1c/14e21c6b9851054135c3e97a9c383bbd.jpg",
    description: "A powerful beast engulfed in flames, its fiery wrath protects its territory and allies.",
    lore: "Inferno Beast, a mighty creature of flames, defends its territory with fierce and fiery wrath.",
    class: "Guardian",
    element: ["Fire"],
    weaknesses: ["Water"],
    strengths: ["Nature", "Ice"],
    species: "Beast"
  },
  {
    name: "Tide Sprite",
    baseHealth: 420,  // Adjusted to be less than 500
    baseAttack: 60,  // Adjusted to maintain balance
    baseDefense: 50,  // Adjusted within limits
    baseManaCost: 140,  // Higher to balance low defense
    baseCost: 1100,  // Proportional to other stats
    illustration: "https://i.pinimg.com/originals/2f/09/ec/2f09ecb1d5320e75b71b490a9b5ad67f.jpg",
    description: "A swift and elusive creature of the seas, using its agility and water manipulation to outmaneuver foes.",
    lore: "Tide Sprite, an agile sea creature, masters water manipulation to outmaneuver its foes.",
    class: "Nimble",
    element: ["Water"],
    weaknesses: ["Lightning"],
    strengths: ["Fire", "Earth"],
    species: "Sprite"
  },
  {
    name: "Woodland Hunter",
    baseHealth: 470,  // Adjusted to be less than 500
    baseAttack: 100,  // Adjusted within limits
    baseDefense: 75,  // Adjusted within limits
    baseManaCost: 70,  // Adjusted to balance with lower health
    baseCost: 1250,  // Proportional to other stats
    illustration: "https://i.pinimg.com/originals/d9/eb/61/d9eb613834fd97c1a9893ba457e06607.jpg",
    description: "A formidable hunter from the forest, blending into its surroundings and striking with deadly precision.",
    lore: "Woodland Hunter, a forest hunter, blends seamlessly into its surroundings and strikes with deadly precision.",
    class: "Predator",
    element: ["Nature"],
    weaknesses: ["Fire"],
    strengths: ["Water", "Earth"],
    species: "Hunter"
  },
  {
    name: "Sky Reaver",
    baseHealth: 460,  // Adjusted to be less than 500
    baseAttack: 95,  // Adjusted within limits
    baseDefense: 70,  // Adjusted within limits
    baseManaCost: 85,  // Adjusted to balance with lower health
    baseCost: 1200,  // Proportional to other stats
    illustration: "https://i.pinimg.com/originals/dc/63/7b/dc637b19e22e3bfc3d0134eaed61de4d.jpg",
    description: "A creature of the skies, using its powerful wings and speed to dominate the air and break enemy lines.",
    lore: "Sky Reaver, a sky-dweller, uses powerful wings and speed to dominate the air and break enemy lines.",
    class: "Breaker",
    element: ["Air"],
    weaknesses: ["Earth"],
    strengths: ["Lightning", "Nature"],
    species: "Reaver"
  },
  {
    name: "Storm Guardian",
    baseHealth: 480,  // Adjusted to be less than 500
    baseAttack: 90,  // Adjusted within limits
    baseDefense: 100,  // Adjusted within limits
    baseManaCost: 80,  // Adjusted to balance with lower health
    baseCost: 1400,  // Proportional to other stats
    illustration: "https://i.pinimg.com/originals/f8/f4/f7/f8f4f7e2c32898f4a740dfa3232f141c.jpg",
    description: "A fearsome guardian that channels the power of lightning to defend its domain and allies.",
    lore: "Storm Guardian, a lightning-charged protector, defends its domain and allies with fierce power.",
    class: "Guardian",
    element: ["Lightning"],
    weaknesses: ["Earth"],
    strengths: ["Water", "Air"],
    species: "Guardian"
  },
  {
    name: "Frost Phantom",
    baseHealth: 430,  // Adjusted to be less than 500
    baseAttack: 70,  // Adjusted within limits
    baseDefense: 60,  // Adjusted within limits
    baseManaCost: 130,  // Adjusted to balance with lower health
    baseCost: 1150,  // Proportional to other stats
    illustration: "https://i.pinimg.com/originals/13/e9/92/13e992297ec623a2980cd343e47940c1.jpg",
    description: "A nimble and cold-hearted creature, freezing anything that crosses its path with chilling precision.",
    lore: "Frost Phantom, a cold-hearted creature, freezes anything that crosses its path with chilling precision.",
    class: "Nimble",
    element: ["Ice"],
    weaknesses: ["Fire"],
    strengths: ["Water", "Air"],
    species: "Phantom"
  },
  {
    name: "Mountain Wyvern",
    baseHealth: 490,  // Adjusted to be less than 500
    baseAttack: 105,  // Adjusted within limits
    baseDefense: 85,  // Adjusted within limits
    baseManaCost: 75,  // Adjusted to balance with lower health
    baseCost: 1300,  // Proportional to other stats
    illustration: "https://i.pinimg.com/originals/ed/db/af/eddbaf25828ed704f6a49fc657c03c9e.jpg",
    description: "A mighty beast of the mountains, using its rocky scales for defense and causing earthquakes to crush foes.",
    lore: "Mountain Wyvern, a mountain beast, uses its rocky scales for defense and causes earthquakes to crush foes.",
    class: "Predator",
    element: ["Earth"],
    weaknesses: ["Air"],
    strengths: ["Lightning", "Fire"],
    species: "Wyvern"
  },
  {
    name: "Steel Colossus",
    baseHealth: 500,  // Adjusted to the maximum limit for balance
    baseAttack: 95,  // Adjusted within limits
    baseDefense: 120,  // Adjusted within limits
    baseManaCost: 90,  // Adjusted to balance with other stats
    baseCost: 1450,  // Proportional to other stats
    illustration: "https://i.pinimg.com/originals/25/6b/77/256b7761ea4d5f788e7e0b7c52d1a1cb.jpg",
    description: "A colossal figure made of metal, its defense is unmatched and its attacks are powerful and precise.",
    lore: "Steel Colossus, a towering figure of metal, boasts unmatched defense and powerful attacks.",
    class: "Guardian",
    element: ["Metal"],
    weaknesses: ["Fire"],
    strengths: ["Earth", "Shadow"],
    species: "Colossus"
  }
];




const createPet = async (pet) => {
  try {
    const response = await axios.post('http://localhost:5000/api/demo/pet', pet);
    console.log(`Created pet: ${response.data.name}`);
    console.log(response.data._d)
    return { name: response.data.name, id: response.data._id };
  } catch (error) {
    console.log(error.message)
    console.error(`Error creating pet: ${pet.name}`, error.response?.data || error.message);
  }
};

const h= async ()=>{
   try {
    console.log("started")
    const response = await axios.post('http://localhost:5000/api/demo/add');
    console.log(`Created pet: ${response}`);
  } catch (error) {
    console.log(error.message);
  }
}





const managePets = async () => {
  // Helper function to process each array of pets
  const processPets = async (petsArray, elementName) => {
    console.log(`Creating ${elementName} Pets`);
    for (const pet of petsArray) {
      const petData = await createPet(pet);
    }
  };

  // Process each array of pets
  await processPets(lightPets, 'Light');
  await processPets(shadowPets, 'Shadow');
  await processPets(firePets, 'Fire');
  await processPets(waterPets, 'Water');
  await processPets(earthPets, 'Earth');
  await processPets(airPets, 'Air');
  await processPets(metalPets, 'Metal');
  await processPets(icePets, 'Ice');
  await processPets(naturePets, 'Nature');
  await processPets(lightningPets, 'Lightning');
   await processPets(creatures, 'extra');
};

// Call the function to start processing pets
managePets()
    .then(() => {
        h();
    })
    .catch(err => {
        console.error("Error managing pets:", err);
    });