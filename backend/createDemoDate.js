const axios = require('axios');
const fs = require('fs');
const path = require('path');




const createArena = async (arena) => {
  try {
    const response = await axios.post('http://localhost:5000/api/demo/arena', arena);
    console.log(`Created arena: ${response.data.name}`);
    return { name: response.data.name, id: response.data._id };
  } catch (error) {
    console.error(`Error creating arena: ${arena.name}`, error.response?.data || error.message);
  }
};





const arenas = [
  {
    name: 'Volcano Crater',
    description: 'A fierce battlefield surrounded by bubbling lava and molten rocks, where the ground itself burns.',
    element: 'Fire',
    imageUrl: 'https://i.pinimg.com/originals/e8/f6/25/e8f6256ab806306b933714cd8c0a7d7a.jpg'
  },

  {
    name: 'Ocean Abyss',
    description: 'A deep underwater arena with bioluminescent creatures lighting the way, creating a hauntingly beautiful battlefield.',
    element: 'Water',
    imageUrl: 'https://i.pinimg.com/originals/77/4f/2a/774f2ad4dcdfec18612689c8105a5d3b.jpg'
  },

  {
    name: 'Ice Tribes Ritual Grounds',
    description: 'A memento to the ice tribes chiefs, a frozen battlefield with ancient markings and sacred totems.',
    element: 'Ice',
    imageUrl: 'https://cdnb.artstation.com/p/assets/images/images/006/894/497/large/kisoo-lee-an-arena.jpg?1502071019'
  },

  {
    name: 'Sunlit Glade',
    description: 'A radiant forest clearing where sunlight pierces through the canopy, enhancing the power of light and nature.',
    element: 'Light',
    imageUrl: 'https://i.pinimg.com/originals/39/51/c0/3951c054e7d40913c35d2357b24d8f87.jpg'
  },

  {
    name: 'Shadowed Crypt',
    description: 'A dark and eerie underground crypt, where shadows cling to every corner and silence reigns.',
    element: 'Shadow',
    imageUrl: 'https://i.pinimg.com/originals/a9/12/f9/a912f96dd3f013739c091f66b13fd9f7.jpg'
  },

  {
    name: 'Glistening Cavern',
    description: 'A hidden cavern filled with glistening minerals and precious gems, enhancing earth and metal-based powers.',
    element: 'Metal',
    imageUrl: 'https://i.pinimg.com/originals/ab/55/75/ab55757b968d17745fd613899c964f24.jpg'
  },

  {
    name: 'Tempest Arena',
    description: 'An arena constantly battered by fierce winds and lightning storms, where the air crackles with energy.',
    element: 'Lightning',
    imageUrl: 'https://i.pinimg.com/originals/1e/cd/69/1ecd6940d17e7ea8d2a7446cb02f7082.jpg'
  },

  {
    name: 'Crystal Falls',
    description: 'A beautiful waterfall cascading over crystal formations, where water and nature elements harmonize.',
    element: 'Nature',
    imageUrl: 'https://i.pinimg.com/originals/1f/86/86/1f8686b7616720623cfedbb0d77b144c.jpg'
  },

  {
    name: 'Mountain Pass',
    description: 'A rugged mountain pass with steep cliffs and rocky terrain, ideal for earth and predator classes.',
    element: 'Earth',
    imageUrl: 'https://i.pinimg.com/originals/f6/13/55/f61355a7beeb2a03367275820b15ebb8.jpg'
  },

  {
    name: 'Sky Arena',
    description: 'An open arena high above the clouds where air and nimble classes thrive in the open space.',
    element: 'Air',
    imageUrl: 'https://i.pinimg.com/originals/5e/76/e8/5e76e89a16d4a1ac837f6337502cfc56.jpg'
  },

  {
    name: 'Stormwatch Keep',
    description: 'A fortified keep constantly exposed to violent storms and lightning, perfect for lightning and guardian classes.',
    element: 'Lightning',
    imageUrl: 'https://i.pinimg.com/originals/49/07/2e/49072e665575deba0720982f2f8bc8a9.jpg'
  },
];


const createDemoData = async () => {
 
  const arenasData = [];
  const ARENAID = []
  
  console.log("Creating Arenas");
  for (const arena of arenas) {
    const arenaData = await createArena(arena);
    const arenaID =arenaData.id
    if (arenaData) arenasData.push(arenaData);
    if (arenaID) ARENAID.push(arenaID)
  }

  const demoData = {
   
    arenas: arenasData,
    
    arenasIdS:ARENAID,
  };

  const demoDataPath = path.join(__dirname, 'demoData.json');
  fs.writeFileSync(demoDataPath, JSON.stringify(demoData, null, 2));
  console.log(`Demo data saved to ${demoDataPath}`);
};

createDemoData().catch((error) => {
  console.error("Error during demo data creation:", error.message);
});


