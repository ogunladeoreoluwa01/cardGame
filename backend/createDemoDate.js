const axios = require('axios');
const fs = require('fs');
const path = require('path');

const createPet = async (pet) => {
  try {
    const response = await axios.post('http://localhost:5000/api/demo/pet', pet);
    console.log(`Created pet: ${response.data.name}`);
    return { name: response.data.name, id: response.data._id };
  } catch (error) {
    console.error(`Error creating pet: ${pet.name}`, error.response?.data || error.message);
  }
};

const createArena = async (arena) => {
  try {
    const response = await axios.post('http://localhost:5000/api/demo/arena', arena);
    console.log(`Created arena: ${response.data.name}`);
    return { name: response.data.name, id: response.data._id };
  } catch (error) {
    console.error(`Error creating arena: ${arena.name}`, error.response?.data || error.message);
  }
};

const firePets = [
  {
    name: 'Emberclaw',
    baseHealth: 120,
    baseAttack: 150,
    baseDefense: 80,
    baseManaCost: 40,
    illustration: 'link-to-image',
    description: 'Emberclaw, a fierce creature of the blazing infernos, stands tall with its scorching claws and fiery breath...',
    class: 'Guardian',
    classBonus: 'Increases defense against physical attacks.',
    elementalBonus: 'Boosts fire-based abilities.',
    element: 'Fire',
    weaknesses: ['Water', 'Earth'],
    strengths: ['Nature', 'Ice']
  },
  {
    name: 'Flame Serpent',
    baseHealth: 100,
    baseAttack: 160,
    baseDefense: 70,
    baseManaCost: 35,
    illustration: 'link-to-image',
    description: 'The Flame Serpent slithers through the air, leaving a trail of fire and ash in its wake...',
    class: 'Predator',
    classBonus: 'Increases attack power when health is low.',
    elementalBonus: 'Enhances fire attacks.',
    element: 'Fire',
    weaknesses: ['Water', 'Earth'],
    strengths: ['Ice', 'Nature']
  },
  {
    name: 'Inferno Guardian',
    baseHealth: 140,
    baseAttack: 130,
    baseDefense: 90,
    baseManaCost: 45,
    illustration: 'link-to-image',
    description: 'The Inferno Guardian protects the heart of the volcano with its impenetrable armor and fiery sword...',
    class: 'Guardian',
    classBonus: 'Reduces damage taken from non-elemental attacks.',
    elementalBonus: 'Improves resistance to fire damage.',
    element: 'Fire',
    weaknesses: ['Water', 'Earth'],
    strengths: ['Nature', 'Ice']
  },
  {
    name: 'Blaze Phoenix',
    baseHealth: 110,
    baseAttack: 170,
    baseDefense: 75,
    baseManaCost: 50,
    illustration: 'link-to-image',
    description: 'The Blaze Phoenix rises from its ashes, radiating immense heat and fire with each flap of its wings...',
    class: 'Nimble',
    classBonus: 'Increases evasion and critical hit chance.',
    elementalBonus: 'Boosts fire-based skills.',
    element: 'Fire',
    weaknesses: ['Water', 'Earth'],
    strengths: ['Ice', 'Nature']
  },
  {
    name: 'Magma Titan',
    baseHealth: 160,
    baseAttack: 140,
    baseDefense: 100,
    baseManaCost: 55,
    illustration: 'link-to-image',
    description: 'The Magma Titan, with its colossal size and molten rock body, crushes its enemies with sheer force...',
    class: 'Breaker',
    classBonus: 'Deals extra damage to structures and defenses.',
    elementalBonus: 'Increases effectiveness of fire abilities.',
    element: 'Fire',
    weaknesses: ['Water', 'Earth'],
    strengths: ['Nature', 'Ice']
  },
  {
    name: 'Fire Drake',
    baseHealth: 120,
    baseAttack: 150,
    baseDefense: 85,
    baseManaCost: 40,
    illustration: 'link-to-image',
    description: 'The Fire Drake soars through the skies, spewing flames and scorching everything in its path...',
    class: 'Predator',
    classBonus: 'Increases damage when attacking.',
    elementalBonus: 'Enhances fire breath attacks.',
    element: 'Fire',
    weaknesses: ['Water', 'Earth'],
    strengths: ['Ice', 'Nature']
  },
  {
    name: 'Volcanic Behemoth',
    baseHealth: 180,
    baseAttack: 120,
    baseDefense: 110,
    baseManaCost: 60,
    illustration: 'link-to-image',
    description: 'The Volcanic Behemoth towers over its foes, its massive form made of molten rock and lava...',
    class: 'Guardian',
    classBonus: 'Reduces damage taken from all sources.',
    elementalBonus: 'Enhances fire-based defenses.',
    element: 'Fire',
    weaknesses: ['Water', 'Earth'],
    strengths: ['Nature', 'Ice']
  },
  {
    name: 'Ash Wyrm',
    baseHealth: 90,
    baseAttack: 140,
    baseDefense: 70,
    baseManaCost: 30,
    illustration: 'link-to-image',
    description: 'The Ash Wyrm burrows through the volcanic ash, striking its enemies with precision and speed...',
    class: 'Nimble',
    classBonus: 'Increases speed and agility.',
    elementalBonus: 'Boosts fire-based attacks.',
    element: 'Fire',
    weaknesses: ['Water', 'Earth'],
    strengths: ['Ice', 'Nature']
  },
  {
    name: 'Pyro Hydra',
    baseHealth: 130,
    baseAttack: 160,
    baseDefense: 85,
    baseManaCost: 50,
    illustration: 'link-to-image',
    description: 'The Pyro Hydra, with its multiple heads, unleashes a torrent of flames and destruction...',
    class: 'Predator',
    classBonus: 'Increases damage dealt with multiple attacks.',
    elementalBonus: 'Enhances fire-based abilities.',
    element: 'Fire',
    weaknesses: ['Water', 'Earth'],
    strengths: ['Ice', 'Nature']
  },
  {
    name: 'Lava Golem',
    baseHealth: 150,
    baseAttack: 130,
    baseDefense: 95,
    baseManaCost: 45,
    illustration: 'link-to-image',
    description: 'The Lava Golem, a being of molten rock and fire, crushes its enemies with its powerful fists...',
    class: 'Guardian',
    classBonus: 'Increases defense and health.',
    elementalBonus: 'Boosts fire-based defenses.',
    element: 'Fire',
    weaknesses: ['Water', 'Earth'],
    strengths: ['Nature', 'Ice']
  }
];

const waterPets = [
  {
    name: 'Tide Guardian',
    baseHealth: 130,
    baseAttack: 120,
    baseDefense: 100,
    baseManaCost: 50,
    illustration: 'link-to-image',
    description: 'Tide Guardian stands sentinel over the ocean depths, its protective nature unmatched...',
    class: 'Guardian',
    classBonus: 'Enhances defensive capabilities.',
    elementalBonus: 'Boosts water-based abilities.',
    element: 'Water',
    weaknesses: ['Lightning', 'Fire'],
    strengths: ['Earth', 'Ice']
  },
  {
    name: 'Aqua Serpent',
    baseHealth: 110,
    baseAttack: 140,
    baseDefense: 80,
    baseManaCost: 40,
    illustration: 'link-to-image',
    description: 'The Aqua Serpent glides through the water, striking its prey with lightning speed and deadly precision...',
    class: 'Predator',
    classBonus: 'Increases attack speed and critical hit rate.',
    elementalBonus: 'Enhances water-based attacks.',
    element: 'Water',
    weaknesses: ['Lightning', 'Fire'],
    strengths: ['Earth', 'Ice']
  },
  {
    name: 'Wavebreaker',
    baseHealth: 150,
    baseAttack: 130,
    baseDefense: 90,
    baseManaCost: 55,
    illustration: 'link-to-image',
    description: 'The Wavebreaker crushes its enemies with the force of the ocean, its powerful strikes relentless...',
    class: 'Breaker',
    classBonus: 'Increases damage against fortified defenses.',
    elementalBonus: 'Boosts water-based abilities.',
    element: 'Water',
    weaknesses: ['Lightning', 'Fire'],
    strengths: ['Earth', 'Ice']
  },
  {
    name: 'Coral Siren',
    baseHealth: 100,
    baseAttack: 110,
    baseDefense: 70,
    baseManaCost: 30,
    illustration: 'link-to-image',
    description: 'The Coral Siren enchants its foes with its mesmerizing song, drawing them into the depths...',
    class: 'Nimble',
    classBonus: 'Increases evasion and charm effects.',
    elementalBonus: 'Enhances water-based skills.',
    element: 'Water',
    weaknesses: ['Lightning', 'Fire'],
    strengths: ['Earth', 'Ice']
  },
  {
    name: 'Kraken',
    baseHealth: 160,
    baseAttack: 150,
    baseDefense: 110,
    baseManaCost: 60,
    illustration: 'link-to-image',
    description: 'The Kraken, with its massive tentacles, drags its enemies into the abyss, never to be seen again...',
    class: 'Guardian',
    classBonus: 'Increases health and defense.',
    elementalBonus: 'Boosts water-based defenses.',
    element: 'Water',
    weaknesses: ['Lightning', 'Fire'],
    strengths: ['Earth', 'Ice']
  },
  {
    name: 'Leviathan',
    baseHealth: 140,
    baseAttack: 160,
    baseDefense: 90,
    baseManaCost: 50,
    illustration: 'link-to-image',
    description: 'The Leviathan roams the ocean depths, its colossal form inspiring awe and terror...',
    class: 'Predator',
    classBonus: 'Increases damage dealt with physical attacks.',
    elementalBonus: 'Enhances water-based abilities.',
    element: 'Water',
    weaknesses: ['Lightning', 'Fire'],
    strengths: ['Earth', 'Ice']
  },
  {
    name: 'Tsunami Dragon',
    baseHealth: 120,
    baseAttack: 140,
    baseDefense: 80,
    baseManaCost: 45,
    illustration: 'link-to-image',
    description: 'The Tsunami Dragon commands the waves, its roar summoning tidal forces that engulf its enemies...',
    class: 'Breaker',
    classBonus: 'Increases damage dealt with area attacks.',
    elementalBonus: 'Boosts water-based abilities.',
    element: 'Water',
    weaknesses: ['Lightning', 'Fire'],
    strengths: ['Earth', 'Ice']
  },
  {
    name: 'Abyssal Wyrm',
    baseHealth: 90,
    baseAttack: 120,
    baseDefense: 70,
    baseManaCost: 35,
    illustration: 'link-to-image',
    description: 'The Abyssal Wyrm lurks in the darkest depths, striking swiftly and retreating into the shadows...',
    class: 'Nimble',
    classBonus: 'Increases speed and evasion.',
    elementalBonus: 'Enhances water-based attacks.',
    element: 'Water',
    weaknesses: ['Lightning', 'Fire'],
    strengths: ['Earth', 'Ice']
  },
  {
    name: 'Frostfish',
    baseHealth: 110,
    baseAttack: 130,
    baseDefense: 80,
    baseManaCost: 40,
    illustration: 'link-to-image',
    description: 'The Frostfish swims gracefully through icy waters, its presence chilling the air around it...',
    class: 'Nimble',
    classBonus: 'Increases evasion and freezing effects.',
    elementalBonus: 'Boosts water-based attacks.',
    element: 'Water',
    weaknesses: ['Lightning', 'Fire'],
    strengths: ['Earth', 'Ice']
  },
  {
    name: 'Hydro Golem',
    baseHealth: 150,
    baseAttack: 120,
    baseDefense: 100,
    baseManaCost: 50,
    illustration: 'link-to-image',
    description: 'The Hydro Golem, formed from enchanted waters, crushes its enemies with immense strength...',
    class: 'Guardian',
    classBonus: 'Increases health and defensive capabilities.',
    elementalBonus: 'Boosts water-based defenses.',
    element: 'Water',
    weaknesses: ['Lightning', 'Fire'],
    strengths: ['Earth', 'Ice']
  }
];


const arenas = [
  {
    name: 'Volcano Crater',
    description: 'A fierce battlefield surrounded by bubbling lava and molten rocks, where the ground itself burns...',
    element: 'Fire',
    imageUrl: 'link-to-image'
  },
  {
    name: 'Inferno Plateau',
    description: 'A vast plateau with searing heat and flames erupting from the ground, challenging the bravest warriors...',
    element: 'Fire',
    imageUrl: 'link-to-image'
  },
  {
    name: 'Ocean Abyss',
    description: 'A deep underwater arena with bioluminescent creatures lighting the way, creating a hauntingly beautiful battlefield...',
    element: 'Water',
    imageUrl: 'link-to-image'
  },
  {
    name: 'Coral Reef',
    description: 'A vibrant underwater world teeming with life and colorful corals, where battles are both deadly and beautiful...',
    element: 'Water',
    imageUrl: 'link-to-image'
  },
  {
    name: 'Tidal Pools',
    description: 'A series of interconnected pools filled with seawater and hidden dangers, where the tide can turn the battle...',
    element: 'Water',
    imageUrl: 'link-to-image'
  }
];

const createDemoData = async () => {
  const petsData = [];
  const arenasData = [];

  console.log("Creating Fire Pets...");
  for (const pet of firePets) {
    const petData = await createPet(pet);
    if (petData) petsData.push(petData);
  }
  
  console.log("Creating Water Pets...");
  for (const pet of waterPets) {
    const petData = await createPet(pet);
    if (petData) petsData.push(petData);
  }
  
  console.log("Creating Arenas...");
  for (const arena of arenas) {
    const arenaData = await createArena(arena);
    if (arenaData) arenasData.push(arenaData);
  }

  const demoData = {
    pets: petsData,
    arenas: arenasData,
  };

  const demoDataPath = path.join(__dirname, 'demoData.json');
  fs.writeFileSync(demoDataPath, JSON.stringify(demoData, null, 2));
  console.log(`Demo data saved to ${demoDataPath}`);
};

createDemoData().catch((error) => {
  console.error("Error during demo data creation:", error.message);
});


