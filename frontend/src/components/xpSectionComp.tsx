import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import NumberCounter from "./numberCounterprop";
import CardComp from "@/components/cardComp";

const creatures = [
  {
    elements: ["Dark"],
    classy: "Breaker",
    illustration:
      "https://i.pinimg.com/originals/2b/1c/9a/2b1c9aa79943e73394a075341031d996.jpg",
    description:
      "A fearsome warrior of the shadows, wielding dark powers to break through enemy defenses. Its presence alone instills fear.",
    name: "Dark Knight",
    level: 75,
    health: 900,
    attack: 120,
    defence: 80,
    mana: 70,
    rarity: "Ethereal",
  },
  {
    elements: ["Light"],
    classy: "Breaker",
    illustration:
      "https://i.pinimg.com/originals/c1/c2/a4/c1c2a484a5c69b4529a3cc21030bf8d4.jpg",
    description:
      "A majestic dragon imbued with the power of light, shattering enemy lines with radiant strikes.",
    name: "Light Dragon",
    level: 80,
    health: 950,
    attack: 110,
    defence: 85,
    mana: 90,
    rarity: "Ethereal",
  },
  {
    elements: ["Fire"],
    classy: "Guardian",
    illustration:
      "https://i.pinimg.com/originals/14/e2/1c/14e21c6b9851054135c3e97a9c383bbd.jpg",
    description:
      "A powerful beast engulfed in flames, its fiery wrath protects its territory and allies.",
    name: "Flame Guardian",
    level: 90,
    health: 1200,
    attack: 90,
    defence: 150,
    mana: 80,
    rarity: "Rustic",
  },
  {
    elements: ["Water"],
    classy: "Nimble",
    illustration:
      "https://i.pinimg.com/originals/2f/09/ec/2f09ecb1d5320e75b71b490a9b5ad67f.jpg",
    description:
      "A swift and elusive creature of the seas, using its agility and water manipulation to outmaneuver foes.",
    name: "Aqua Sprite",
    level: 85,
    health: 800,
    attack: 70,
    defence: 60,
    mana: 150,
    rarity: "Arcane",
  },
  {
    elements: ["Nature"],
    classy: "Predator",
    illustration:
      "https://i.pinimg.com/originals/d9/eb/61/d9eb613834fd97c1a9893ba457e06607.jpg",
    description:
      "A formidable hunter from the forest, blending into its surroundings and striking with deadly precision.",
    name: "Forest Stalker",
    level: 95,
    health: 950,
    attack: 110,
    defence: 90,
    mana: 70,
    rarity: "Mythic",
  },
  {
    elements: ["Air"],
    classy: "Breaker",
    illustration:
      "https://i.pinimg.com/originals/dc/63/7b/dc637b19e22e3bfc3d0134eaed61de4d.jpg",
    description:
      "A creature of the skies, using its powerful wings and speed to dominate the air and break enemy lines.",
    name: "Sky Serpent",
    level: 92,
    health: 850,
    attack: 105,
    defence: 85,
    mana: 95,
    rarity: "Exalted",
  },
  {
    elements: ["Electric"],
    classy: "Guardian",
    illustration:
      "https://i.pinimg.com/originals/f8/f4/f7/f8f4f7e2c32898f4a740dfa3232f141c.jpg",
    description:
      "A fearsome guardian that channels the power of lightning to defend its domain and allies.",
    name: "Thunder Guardian",
    level: 88,
    health: 1100,
    attack: 95,
    defence: 120,
    mana: 85,
    rarity: "Exalted",
  },
  {
    elements: ["Ice"],
    classy: "Nimble",
    illustration:
      "https://i.pinimg.com/originals/13/e9/92/13e992297ec623a2980cd343e47940c1.jpg",
    description:
      "A nimble and cold-hearted creature, freezing anything that crosses its path with chilling precision.",
    name: "Frost Wraith",
    level: 86,
    health: 800,
    attack: 75,
    defence: 65,
    mana: 140,
    rarity: "Arcane",
  },
  {
    elements: ["Earth"],
    classy: "Predator",
    illustration:
      "https://i.pinimg.com/originals/ed/db/af/eddbaf25828ed704f6a49fc657c03c9e.jpg",
    description:
      "A mighty beast of the mountains, using its rocky scales for defense and causing earthquakes to crush foes",
    name: "Earth Wyvern",
    level: 91,
    health: 930,
    attack: 115,
    defence: 80,
    mana: 75,
    rarity: "Mythic",
  },
  {
    elements: ["Metal"],
    classy: "Breaker",
    illustration:
      "https://i.pinimg.com/originals/0c/1c/34/0c1c34953d37597ff0ce57cce0882556.jpg",
    description:
      "A heavily armored creature, using its metallic body to break through the strongest defenses.",
    name: "Iron Golem",
    level: 93,
    health: 1050,
    attack: 100,
    defence: 110,
    mana: 90,
    rarity: "Exalted",
  },
];

interface UserXpProp {
  xpNeededToNextLevel: number | null;
  experience: number | null;
  level: number | null;
  Aureus: number | null;
  Argentum: number | null;
}

const XpSectionComp: React.FC<UserXpProp> = ({
  xpNeededToNextLevel,
  experience,
  level,
  Aureus,
  Argentum,
}) => {
  const [percent, setPercent] = useState(0);

  // Provide dummy data if props are not provided
  if (!xpNeededToNextLevel || !experience || !level) {
    xpNeededToNextLevel = 100000;
    experience = 90300;
    level = 30;
    Aureus = 400;
    Argentum = 500;
  }

  useEffect(() => {
    const calculatedPercent = (experience / xpNeededToNextLevel) * 100;
    if (calculatedPercent > 100){
      setPercent(100)
    }
    else{
      setPercent(calculatedPercent);
    }
    
  }, [experience, xpNeededToNextLevel]);

  return (
    <>
      <section className="my-1 flex lg:w-[50vw] gap-5 w-full justify-center">
        <Button size="sm" className="mt-2  w-24 ">
          {" "}
          Challenge
        </Button>
        <Button size="sm" className="mt-2  w-24 ">
          {" "}
          Message
        </Button>
        <Button size="sm" className="mt-2  w-24 ">
          {" "}
          Follow
        </Button>
      </section>
      <section>
        <section className="lg:w-[50vw] w-full flex gap-8 items-center">
          <p className="md:text-sm text-xs w-[4vw] text-muted-foreground inline-block number">
            lvl.
            <NumberCounter number={level} />
          </p>
          <div className="lg:w-[95%] md:w-[93%] w-[85%] h-3 bg-muted rounded-[0.25rem] relative overflow-hidden">
            <h1 className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[0.6rem] z-20 ">
              {percent.toFixed(2)}%
            </h1>
            <div
              style={{ width: `${percent}%` }}
              className="absolute rounded-[0.75rem] bg-primary h-3 blur-[0.5px] transition-all duration-700 ease-in-out"
            ></div>
          </div>
        </section>
        <div className="lg:w-[50vw] w-full flex flex-wrap justify-center md:justify-start items-center gap-4">
          {creatures.map((creature, index) => (
            <CardComp
              key={index}
              elements={creature.elements}
              classy={creature.classy}
              illustration={creature.illustration}
              description={creature.description}
              name={creature.name}
              level={creature.level}
              health={creature.health}
              attack={creature.attack}
              defence={creature.defence}
              mana={creature.mana}
              rarity={creature.rarity}
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default XpSectionComp;
