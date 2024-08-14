import React, { useState, useEffect } from "react";
import { Outlet, useNavigate,Link } from "react-router-dom";
import { Button } from "@/components/ui/button"; // Import Button component


import fireBackground from "@/assets/static/aboutPage/Default_Fire_Arena_Volcanic_CraterDescription_The_Fire_Arena_i_0.jpg";
import fireCreature from "@/assets/static/aboutPage/Default_Fire_Element_PhoenixDescription_The_Phoenix_is_a_majes_0.jpg";
import waterCreature from "@/assets/static/aboutPage/Default_Water_Element_LeviathanDescription_The_Leviathan_is_a_0.jpg";
import waterBackground from "@/assets/static/aboutPage/Default_Description_The_Oceanic_Abyss_arena_is_a_vast_underwat_3.jpg";
import earthCreature from "@/assets/static/aboutPage/Default_Creature_Earth_GolemDescription_Earth_Golems_are_formi_3.jpg";
import earthBackground from "@/assets/static/aboutPage/Default_Arena_Mountain_StrongholdDescription_The_Mountain_Stro_2.jpg";
import airCreature from "@/assets/static/aboutPage/Default_Creature_GriffinDescription_Griffins_are_majestic_crea_1.jpg";
import airBackground from "@/assets/static/aboutPage/Default_Arena_Sky_TempleDescription_The_Sky_Temple_arena_float_2.jpg";
import LightningCreature from "@/assets/static/aboutPage/Default_Creature_ThunderbirdDescription_The_Thunderbird_is_a_m_1.jpg";
import LightningBackground from "@/assets/static/aboutPage/Default_Arena_Stormy_PeakDescription_The_Stormy_Peak_arena_is_2.jpg";
import natureCreature from "@/assets/static/aboutPage/Default_Creature_TreantDescription_Treants_are_ancient_sentien_1.jpg";
import natureBackground from "@/assets/static/aboutPage/Default_Arena_Enchanted_ForestDescription_The_Enchanted_Forest_2.jpg";
import iceCreature from "@/assets/static/aboutPage/Default_Creature_YetiDescription_The_Yeti_or_Abominable_Snowma_3.jpg";
import iceBackground from "@/assets/static/aboutPage/Default_Arena_Frozen_TundraDescription_The_Frozen_Tundrais_a_v_2.jpg";
import darkCreature from "@/assets/static/aboutPage/Default_Creature_Vampire_batsDescription_Vampires_bats_are_un_1.jpg";
import darkBackground from "@/assets/static/aboutPage/Default_Arena_Haunted_CastleDescription_The_Haunted_Castle_are_3.jpg";
import lightCreature from "@/assets/static/aboutPage/Default_Creature_UnicornDescription_Unicorns_are_mythical_crea_0.jpg";
import lightBackground from "@/assets/static/aboutPage/Default_Arena_Radiant_GardenDescription_The_Radiant_Garden_are_3.jpg";
import metalCreature from "@/assets/static/aboutPage/Default_Creature_Iron_GolemDescription_Iron_Golems_are_powerfu_2.jpg";
import metalBackground from "@/assets/static/aboutPage/Default_Arena_Forge_of_TitansDescription_The_Forge_of_Titans_a_3.jpg";
import {
  GiSmallFire,
  GiDrop,
  GiStonePile,
  GiTornado,
  GiLightningTrio,
  GiIceBolt,
  GiSundial,
  GiMoon,
  GiVineLeaf,
  GiMetalBar,
  GiCompass,
  GiGems,
  GiBattleGear,
  GiRollingDices,
  GiSpellBook 
} from "react-icons/gi";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const elementData: Record<
  string,
  {
    color: string;
    arena: string;
    element: string;
    icon: JSX.Element;
    effect: string;
    strengths: string[];
    weaknesses: string[];
    creature: string;
    illustration: string;
    creatureDescription: string;
    elementDescription: string;
  }
> = {
  Fire: {
    color: "#8B0000",
    arena: fireBackground,
    element: "Fire",
    icon: <GiSmallFire />,
    effect:
      "Burns enemies over time with searing flames, causing continuous fire damage that intensifies with each passing second.",
    strengths: ["Nature", "Ice"],
    weaknesses: ["Water", "Earth"],
    creature: "Phoenix",
    illustration: fireCreature,
    creatureDescription:
      "The Phoenix is a legendary firebird that is eternally reborn from its own ashes. It embodies the cycle of life, death, and rebirth, with its fiery plumage radiating both beauty and destruction.",
    elementDescription:
      "Fire is the element of passion, energy, and transformation. It is both a creator and a destroyer, representing the power to bring light and warmth, as well as to burn and obliterate. Masters of Fire wield intense flames to scorch their enemies, leaving nothing but ashes in their wake.",
  },
  Water: {
    color: "#1C86EE",
    arena: waterBackground,
    element: "Water",
    icon: <GiDrop />,
    effect:
      "Cools and calms the battlefield, providing defensive barriers and restorative healing that flows like a gentle stream.",
    strengths: ["Fire", "Lightning"],
    weaknesses: ["Lightning", "Earth"],
    creature: "Mermaid",
    illustration: waterCreature,
    creatureDescription:
      "Mermaids are enchanting sea creatures with the upper body of a human and the lower body of a fish. They are known for their mesmerizing voices and their ability to heal and protect the waters they inhabit.",
    elementDescription:
      "Water symbolizes adaptability, tranquility, and life itself. It has the power to soothe and heal, to cleanse and purify. Those who command Water can summon torrents and waves, using its fluid nature to shield allies and drown foes in a deluge of power.",
  },
  Earth: {
    color: "#4B3621",
    arena: earthBackground,
    element: "Earth",
    icon: <GiStonePile />,
    effect:
      "Provides unmatched stability and defensive strength, forming unbreakable barriers of stone and soil that withstand any assault.",
    strengths: ["Lightning", "Fire"],
    weaknesses: ["Water", "Nature"],
    creature: "Earth Golem",
    illustration: earthCreature,
    creatureDescription:
      "Earth Golems are formidable, rock-based guardians crafted from the very bedrock of the earth. Their immense strength and resilience make them the ultimate defenders, standing unyielding against any threat.",
    elementDescription:
      "Earth represents endurance, solidity, and the foundational forces of nature. It is the essence of strength and persistence. Earth wielders can manipulate rocks and soil, creating fortresses of protection and unleashing powerful quakes to disrupt their enemies.",
  },
  Air: {
    color: "#4682B4",
    arena: airBackground,
    element: "Air",
    icon: <GiTornado />,
    effect:
      "Brings swift and evasive maneuvers, enhancing agility and allowing rapid, unpredictable strikes like the wind itself.",
    strengths: ["Earth", "Nature"],
    weaknesses: ["Lightning", "Ice"],
    creature: "Griffin",
    illustration: airCreature,
    creatureDescription:
      "Griffins are majestic creatures with the body of a lion and the head and wings of an eagle. They are symbols of vigilance and strength, soaring through the skies with unparalleled grace and power.",
    elementDescription:
      "Air embodies freedom, movement, and the unseen forces of the sky. It is the breath of life and the winds of change. Masters of Air harness the breeze to move with unmatched speed, creating whirlwinds and gusts that confound and scatter their enemies.",
  },
  Lightning: {
    color: "#DAA520",
    arena: LightningBackground,
    element: "Lightning",
    icon: <GiLightningTrio />,
    effect:
      "Electrifies attacks with shocking damage, unleashing bolts of lightning that stun and paralyze foes, leaving them vulnerable.",
    strengths: ["Water", "Air"],
    weaknesses: ["Earth", "Metal"],
    creature: "Thunderbird",
    illustration: LightningCreature,
    creatureDescription:
      "The Thunderbird is a mythic avian creature capable of summoning storms and wielding the power of lightning. Its mighty wings stir the skies, and its call heralds thunder and rain.",
    elementDescription:
      "Lightningity represents raw energy, innovation, and the unpredictable power of the storm. It is the spark of life and the pulse of the universe. Those who control Lightningity can channel immense voltage to shock, paralyze, and devastate their adversaries.",
  },
  Nature: {
    color: "#2E8B57",
    arena: natureBackground,
    element: "Nature",
    icon: <GiVineLeaf />,
    effect:
      "Harmonizes with the surroundings, fostering growth and healing through a deep connection with the natural world.",
    strengths: ["Earth", "Water"],
    weaknesses: ["Fire", "Air"],
    creature: "Treant",
    illustration: natureCreature,
    creatureDescription:
      "Treants are ancient, sentient trees that act as guardians of the forest. With their immense size and wisdom, they nurture the woodland and protect it from harm.",
    elementDescription:
      "Nature is the essence of life, growth, and the interconnected web of all living things. It symbolizes renewal and balance. Nature's champions can summon the forces of flora and fauna, healing allies and ensnaring enemies with the power of the wild.",
  },
  Ice: {
    color: "#008B8B",
    arena: iceBackground,
    element: "Ice",
    icon: <GiIceBolt />,
    effect:
      "Freezes enemies solid and slows their movements, encasing them in frost and sapping their strength with the chill of winter.",
    strengths: ["Air", "Water"],
    weaknesses: ["Fire", "Lightning"],
    creature: "Yeti",
    illustration: iceCreature,
    creatureDescription:
      "The Yeti, or Abominable Snowman, is a mysterious creature of the frozen mountains. Known for its tremendous strength and elusive nature, it thrives in the harshest of cold environments.",
    elementDescription:
      "Ice signifies stillness, clarity, and the formidable power of the cold. It is the quiet strength that can halt anything in its path. Ice users can freeze their surroundings, creating barriers and weapons of frost that immobilize and weaken their enemies.",
  },
  Shadow: {
    color: "#4B0082",
    arena: darkBackground,
    element: "Dark",
    icon: <GiMoon />,
    effect:
      "Obscures vision and deals shadowy damage, invoking fear and disorientation with the power of darkness and night.",
    strengths: ["Light", "Ice"],
    weaknesses: ["Light"],
    creature: "Vampire",
    illustration: darkCreature,
    creatureDescription:
      "Vampires are undead beings that feed on the life force of the living. They possess great strength, speed, and the ability to manipulate shadows, making them fearsome nocturnal predators.",
    elementDescription:
      "Darkness embodies mystery, fear, and the unknown. It is the shadow that conceals and the void that absorbs all light. Masters of Dark can blend into the night, striking terror into the hearts of their enemies with shadowy assaults and deceptive tactics.",
  },
  Light: {
    color: "#B8860B",
    arena: lightBackground,
    element: "Light",
    icon: <GiSundial />,
    effect:
      "Illuminates and heals, providing clarity, purification, and radiant energy that dispels darkness and restores vitality.",
    strengths: ["Shadow", "Nature"],
    weaknesses: ["Shadow", "Metal"],
    creature: "Unicorn",
    illustration: lightCreature,
    creatureDescription:
      "Unicorns are mythical creatures depicted as white horses with a single, spiraling horn. They symbolize purity, grace, and possess powerful healing abilities that can cure any ailment.",
    elementDescription:
      "Light represents purity, enlightenment, and the life-giving energy of the sun. It is the beacon of hope and the force that vanquishes shadows. Light wielders can heal wounds, banish darkness, and illuminate the path to victory with their radiant powers.",
  },
  Metal: {
    color: "#4F4F4F",
    arena: metalBackground,
    element: "Metal",
    icon: <GiMetalBar />,
    effect:
      "Strengthens defenses and enhances durability, creating unbreakable armor and weapons forged from the hardest metals.",
    strengths: ["Lightning", "Light"],
    weaknesses: ["Nature", "Water"],
    creature: "Iron Golem",
    illustration: metalCreature,
    creatureDescription:
      "Iron Golems are powerful constructs made entirely of metal. They are known for their incredible strength, resilience, and unwavering loyalty to their creators, serving as both protectors and warriors.",
    elementDescription:
      "Metal symbolizes resilience, discipline, and the enduring power of crafted materials. It is the element of industry and protection. Metal users can manipulate metallic substances, forging formidable armor and weapons to defend against any threat.",
  },
};
const getElementData = (elementName) => {
  return elementData[elementName];
};

const AboutElement: React.FC = () => {

  const [activeElement, setActiveElement] = useState("");



  useEffect(() => {
    getElementData(activeElement);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveElement(entry.target.id);
           
          }
        });
      },
      { threshold: 0.5 } // Adjust threshold as needed
    );

    const sections = document.querySelectorAll("section");
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains("hidden1")) {
            entry.target.classList.add("show1");
          } else if (entry.target.classList.contains("hidden2")) {
            entry.target.classList.add("show2");
          }
        } else {
          if (entry.target.classList.contains("hidden1")) {
            entry.target.classList.remove("show1");
          } else if (entry.target.classList.contains("hidden2")) {
            entry.target.classList.remove("show2");
          }
        }
      });
    });

    // Select both hidden1 and hidden2 elements
    const hiddenElements = document.querySelectorAll(".hidden1, .hidden2");

    // Observe each element
    hiddenElements.forEach((el) => observer.observe(el));

    // Cleanup the observer on component unmount
    return () => {
      hiddenElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <>
      <section className="md:px-2  px-0   flex   flex-wrap overflow-hidden  ">
        {Object.keys(elementData).map((element, index) => {
          return (
            <section
              id={elementData[element].element}
              className={`w-full  h-screen relative bg-black   `}
            >
              <img
                src={elementData[element].arena}
                alt=""
                className="w-full h-full opacity-20 object-cover"
                fetchpriority="high"
                loading="lazy"
              />

              <div
                className={`
                      ${index % 2 === 0 ? "flex-row-reverse" : ""}  
                     
                  absolute z-0 p-4 top-1/2 left-1/2 -translate-x-[50%] -translate-y-[65%] md:-translate-y-[50%] flex gap-5 flex-wrap items-start justify-center w-full
                  
                  `}
              >
                <Card
                  style={{ backgroundColor: elementData[element].color }}
                  className={` hidden md:inline-block  md:w-[210px] card md:h-[310px] w-[150px] h-[250px] text-white rounded-[0.2rem] p-[0.35rem] relative overflow-hidden  ${
                    index % 2 === 0 ? "hidden1" : "hidden2"
                  }`}
                >
                  <CardContent className="w-full h-full bg-muted p-0 z-0 relative bg-black">
                    <img
                      src={elementData[element].illustration}
                      alt="hello"
                      fetchpriority="high"
                      loading="lazy"
                      className="w-full h-full object-fill text-center shimmer opacity-80"
                    />
                  </CardContent>
                </Card>
                <div
                  className={` ${
                    index % 2 === 0 ? "hidden2" : "hidden1"
                  } w-full md:w-[60%] h-[300px] text-sm text-white rounded-lg flex flex-col gap-1 bg-transparent border-transparent `}
                >
                  <div
                    style={{ backgroundColor: elementData[element].color }}
                    className="p-2 font-bold w-[100px] gap-1 h-[35px] text-white   rounded-full text-center flex items-center justify-center"
                  >
                    
                       <span className="text-lg">
                        {elementData[element].icon}
                        </span>
                    {elementData[element].element}
                  </div>
                  <p className="text-muted-foreground  pb-2 ">
                    {" "}
                    {elementData[element].elementDescription}{" "}
                    {elementData[element].effect}
                  </p>
                  <h1>
                    {" "}
                    <strong>{elementData[element].creature}</strong>{" "}
                  </h1>
                  <p className="text-muted-foreground  pb-2 ">
                    A common creature of the {elementData[element].element}{" "}
                    element {elementData[element].creatureDescription}
                  </p>

                  <p className="mb-1 p-0">
                    <strong>Strengths</strong>{" "}
                  </p>
                  <div className="flex flex-wrap md:gap-2 gap-2 mb-1">
                    {elementData[element].strengths.map((strength, index) => (
                      <Button
                        key={index}
                        className="p-2 font-bold hover:bg-elementColor  bg-opacity-70 hover:scale-105 transition-all duration-300 ease w-[100px] hover:bg-elementColor hover:text-white gap-1 h-[35px] rounded-full text-center flex items-center justify-center bg-black"
                        style={{ color: elementData[strength].color }}
                        onClick={() => {
                          const elementSection = document.getElementById(
                            elementData[strength].element
                          );
                          if (elementSection) {
                            elementSection.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                          }
                        }}
                      >
                        <span className="text-lg">
                         {elementData[strength].icon}
                        </span>
                        
                        {elementData[strength].element}
                      </Button>
                    ))}
                  </div>
                  <p className="mb-1  p-0">
                    <strong>Weaknesses:</strong>{" "}
                  </p>
                  <div className="flex flex-wrap md:gap-2 gap-2">
                    {elementData[element].weaknesses.map((weakness, index) => (
                      <Button
                        key={index}
                        className="p-2 font-bold hover:bg-elementColor  bg-opacity-70 hover:scale-105 transition-all duration-300 ease w-[100px] hover:bg-elementColor hover:text-white gap-1 h-[35px] rounded-full text-center flex items-center justify-center bg-black"
                        style={{ color: elementData[weakness].color }}
                        onClick={() => {
                          const elementSection = document.getElementById(
                            elementData[weakness].element
                          );
                          if (elementSection) {
                            elementSection.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                          }
                        }}
                      >
                        <span className="text-lg">
                          {elementData[weakness].icon}
                        </span>
                        {elementData[weakness].element}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          );
        })}
        <div className="flex justify-center items-center w-full  ">
          <div className="flex flex-wrap gap-3 justify-center fixed bottom-3 md:bottom-4  transition-all duration-300 ease-in-out bg-white backdrop-filter backdrop-blur-lg bg-opacity-10 p-2  items-center w-fit rounded-[0.75rem] scale-90">
            <Sheet>
              <SheetTrigger asChild>
                <span className="text-2xl text-white hover:scale-110 transition-all duration-300 ease-in-out">
                  <GiCompass />
                </span>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle className="font-bold">The Elemenets</SheetTitle>
                </SheetHeader>
                <div className="flex flex-wrap gap-3 py-3">
                  {Object.keys(elementData).map((element) => {
                    let isActive = false;
                    if (elementData[element].element === activeElement) {
                      isActive = true;
                    } else {
                      isActive = false;
                    }

                    const elementColor = elementData[element].color;
                    return (
                      <Button
                        key={element}
                        className={`p-2 font-bold hover:bg-elementColor shadow-md bg-muted hover:scale-105 transition-all duration-300 ease min-w-[100px]  hover:text-white gap-1 h-[35px] rounded-full text-center flex items-center justify-center ${
                          isActive ? "text-white" : ""
                        } ${isActive ? "" : ""}`}
                        style={{
                          backgroundColor: isActive ? elementColor : undefined,
                          color: isActive ? "white" : elementColor,
                        }}
                        onClick={() => {
                          const elementSection = document.getElementById(
                            elementData[element].element
                          );
                          if (elementSection) {
                            elementSection.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                          }
                        }}
                      >
                        <span className="text-lg">
                          {elementData[element].icon}
                        </span>

                        {elementData[element].element}
                      </Button>
                    );
                  })}
                </div>
                <SheetHeader>
                  <SheetTitle className="font-bold"> About The Game</SheetTitle>
                </SheetHeader>
                <SheetDescription className="flex flex-col gap-2 py-3">
                  <Link
                    to="/about-game/element"
                    className="text-md flex items-center scale-105 justify-between p-2 rounded-sm font-bold bg-transparent bg-gradient-to-r from-red-400 via-yellow-400 to-blue-400 transition-all duration-300 ease-in-out dark:text-white text-black hover:text-white"
                  >
                    Elements
                    <span className="text-xl">
                      <GiGems />
                    </span>
                  </Link>
                  <Link
                    to="/about-game/Class"
                    className="text-md flex items-center hover:scale-105 justify-between p-2 rounded-sm font-bold bg-transparent hover:bg-gradient-to-r from-gray-400 to-gray-600 transition-all duration-300 ease-in-out dark:text-white text-black hover:text-white"
                  >
                    Class
                    <span className="text-xl">
                      <GiBattleGear />
                    </span>
                  </Link>
                  <Link
                    to="/about-game/how-to-play"
                    className="text-md flex items-center hover:scale-105 justify-between p-2 rounded-sm font-bold bg-transparent hover:bg-gradient-to-r from-green-400 to-teal-400 transition-all duration-300 ease-in-out dark:text-white text-black hover:text-white"
                  >
                    How to Play
                    <span className="text-xl">
                      <GiRollingDices />
                    </span>
                  </Link>
                  <Link
                    to="/about-game/general-knowledge"
                    className="text-md flex items- hover:scale-105 justify-between p-2 rounded-sm font-bold bg-transparent hover:bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 ease-in-out dark:text-white text-black hover:text-white"
                  >
                    General Knowledge
                    <span className="text-xl">
                      <GiSpellBook />
                    </span>
                  </Link>
                </SheetDescription>
                <SheetFooter></SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutElement;
