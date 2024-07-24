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
    illustration: 'https://i.pinimg.com/originals/14/e2/1c/14e21c6b9851054135c3e97a9c383bbd.jpg',
    description: 'Emberclaw, a fierce creature of the blazing infernos, stands tall with its scorching claws and fiery breath',
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
    illustration: 'https://i.pinimg.com/originals/c9/24/f1/c924f11f7410175cdf89c632e1886128.jpg',
    description: 'The Flame Serpent slithers through the air, leaving a trail of fire and ash in its wake',
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
    illustration: 'https://i.pinimg.com/originals/7b/3f/42/7b3f4264afbf85e17169f35ae8a550b2.jpg',
    description: 'The Inferno Guardian protects the heart of the volcano with its impenetrable armor and fiery sword',
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
    illustration: 'https://i.pinimg.com/originals/8d/24/38/8d24388fc0ddd484ad0d4099047f5447.jpg',
    description: 'The Blaze Phoenix rises from its ashes, radiating immense heat and fire with each flap of its wings',
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
    illustration: 'https://i.pinimg.com/originals/e3/78/75/e37875ab862140cc7e4cacb43972ef08.jpg',
    description: 'The Magma Titan, with its colossal size and molten rock body, crushes its enemies with sheer force',
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
    illustration: 'https://i.pinimg.com/originals/e8/96/39/e89639bf4d56563ea5f76444eac26d3e.jpg',
    description: 'The Fire Drake soars through the skies, spewing flames and scorching everything in its path',
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
    illustration: 'https://i.pinimg.com/originals/84/81/e3/8481e30d9cf9470aedea4639f82e8628.jpg',
    description: 'The Volcanic Behemoth towers over its foes, its massive form made of molten rock and lava',
    class: 'Guardian',
    classBonus: 'Reduces damage taken from all sources.',
    elementalBonus: 'Enhances fire-based defenses.',
    element: 'Fire',
    weaknesses: ['Water', 'Earth'],
    strengths: ['Nature', 'Ice']
  },

  {
    name: 'Lava Golem',
    baseHealth: 150,
    baseAttack: 130,
    baseDefense: 95,
    baseManaCost: 45,
    illustration: 'https://i.pinimg.com/originals/9c/3b/e9/9c3be9281974912dfe48cd3740c7f67a.jpg',
    description: 'The Lava Golem, a being of molten rock and fire, crushes its enemies with its powerful fists',
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
    illustration: 'https://i.pinimg.com/originals/d6/da/69/d6da69808fc41cafaf248b32332ee0af.jpg',
    description: 'Tide Guardian stands sentinel over the ocean depths, its protective nature unmatched',
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
    illustration: 'https://i.pinimg.com/originals/64/3a/5a/643a5a7ce559340059687e588be42a11.jpg',
    description: 'The Aqua Serpent glides through the water, striking its prey with lightning speed and deadly precision',
    class: 'Predator',
    classBonus: 'Increases attack speed and critical hit rate.',
    elementalBonus: 'Enhances water-based attacks.',
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
    illustration: 'https://i.pinimg.com/originals/99/ba/d4/99bad44dbf469befde3cf8713ad3dc74.jpg',
    description: 'The Coral Siren enchants its foes with its mesmerizing song, drawing them into the depths',
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
    illustration: 'https://i.pinimg.com/originals/3f/2c/61/3f2c61117637c9615072888e502152c0.jpg',
    description: 'The Kraken, with its massive tentacles, drags its enemies into the abyss, never to be seen again',
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
    illustration: 'https://i.pinimg.com/originals/59/30/de/5930de0136729559ee654f1cb5392a0f.jpg',
    description: 'The Leviathan roams the ocean depths, its colossal form inspiring awe and terror',
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
    illustration: 'https://i.pinimg.com/originals/9d/0c/93/9d0c93496115e9727867a33fdf34fdae.jpg',
    description: 'The Tsunami Dragon commands the waves, its roar summoning tidal forces that engulf its enemies',
    class: 'Breaker',
    classBonus: 'Increases damage dealt with area attacks.',
    elementalBonus: 'Boosts water-based abilities.',
    element: 'Water',
    weaknesses: ['Lightning', 'Fire'],
    strengths: ['Earth', 'Ice']
  },

  
];


const arenas = [
  {
    name: 'Volcano Crater',
    description: 'A fierce battlefield surrounded by bubbling lava and molten rocks, where the ground itself burns',
    element: 'Fire',
    imageUrl: 'https://i.pinimg.com/originals/e8/f6/25/e8f6256ab806306b933714cd8c0a7d7a.jpg'
  },

  {
    name: 'Ocean Abyss',
    description: 'A deep underwater arena with bioluminescent creatures lighting the way, creating a hauntingly beautiful battlefield',
    element: 'Water',
    imageUrl: 'https://i.pinimg.com/originals/77/4f/2a/774f2ad4dcdfec18612689c8105a5d3b.jpg'
  },
  {
    name: 'ice tribes ritual grounds',
    description: 'A memento to the ice tribes chiefs .',
    element: 'Water',
    imageUrl: 'https://cdnb.artstation.com/p/assets/images/images/006/894/497/large/kisoo-lee-an-arena.jpg?1502071019'
  },
  
];

const createDemoData = async () => {
  const petsData = [];
  const PETID =[]
  const arenasData = [];
  const ARENAID = []

  console.log("Creating Fire Pets");
  for (const pet of firePets) {
    const petData = await createPet(pet);
    const PetID =petData.id
    if (petData) petsData.push(petData);
    if (PetID) PETID.push(PetID)
  }
  
  console.log("Creating Water Pets");
  for (const pet of waterPets) {
    const petData = await createPet(pet);
    if (petData) petsData.push(petData);
  }
  
  console.log("Creating Arenas");
  for (const arena of arenas) {
    const arenaData = await createArena(arena);
    const arenaID =arenaData.id
    if (arenaData) arenasData.push(arenaData);
    if (arenaID) ARENAID.push(arenaID)
  }

  const demoData = {
    pets: petsData,
    arenas: arenasData,
    petID:PETID,
    arenasIdS:ARENAID,
  };

  const demoDataPath = path.join(__dirname, 'demoData.json');
  fs.writeFileSync(demoDataPath, JSON.stringify(demoData, null, 2));
  console.log(`Demo data saved to ${demoDataPath}`);
};

createDemoData().catch((error) => {
  console.error("Error during demo data creation:", error.message);
});


