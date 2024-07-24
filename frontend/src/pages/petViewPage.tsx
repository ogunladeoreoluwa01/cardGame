
import fireBackground from "@/assets/static/aboutPage/Default_Fire_Arena_Volcanic_CraterDescription_The_Fire_Arena_i_0.jpg";
import waterBackground from "@/assets/static/aboutPage/Default_Description_The_Oceanic_Abyss_arena_is_a_vast_underwat_3.jpg";
import earthBackground from "@/assets/static/aboutPage/Default_Arena_Mountain_StrongholdDescription_The_Mountain_Stro_2.jpg";
import airBackground from "@/assets/static/aboutPage/Default_Arena_Sky_TempleDescription_The_Sky_Temple_arena_float_2.jpg"
import electricBackground from "@/assets/static/aboutPage/Default_Arena_Stormy_PeakDescription_The_Stormy_Peak_arena_is_2.jpg";
import natureBackground from "@/assets/static/aboutPage/Default_Arena_Enchanted_ForestDescription_The_Enchanted_Forest_2.jpg";
import iceBackground from "@/assets/static/aboutPage/Default_Arena_Frozen_TundraDescription_The_Frozen_Tundrais_a_v_2.jpg";
import darkBackground from "@/assets/static/aboutPage/Default_Arena_Haunted_CastleDescription_The_Haunted_Castle_are_3.jpg";
import lightBackground from "@/assets/static/aboutPage/Default_Arena_Radiant_GardenDescription_The_Radiant_Garden_are_3.jpg";
import metalBackground from "@/assets/static/aboutPage/Default_Arena_Forge_of_TitansDescription_The_Forge_of_Titans_a_3.jpg";
import styles from "../styles/styles";







import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import DateConverter from '@/components/dateConverterComponent';
import NumberCounter from "@/components/numberCounterprop";
import {
  GiTurtleShell,
  GiTigerHead,
  GiFox,
  GiPorcupine,
  GiSmallFire,
  GiDrop,
  GiStonePile,
  GiTornado,
  GiLightningTrio,
  GiIceBolt,
  GiStarCycle,
  GiSundial,
  GiMoon,
  GiVineLeaf,
  GiMagicSwirl,
  GiBouncingSword,
  GiVibratingShield,
  GiMetalBar,
  GiMineralHeart,
} from "react-icons/gi";



const backgroundImages: Record<string, string> = {
  Fire: fireBackground,
  Water: waterBackground,
  Earth: earthBackground,
  Air: airBackground,
  Electric: electricBackground,
  Nature: natureBackground,
  Ice: iceBackground,
  Shadow: darkBackground,
  Light: lightBackground,
  Metal: metalBackground,
};

const elementData: Record<
  string,
  {
    color: string;
    element: string;
    icon: JSX.Element;
    effect: string;
    description: string;
  }
> = {
  Fire: {
    color: "#8B0000",
    element: "Fire",
    icon: <GiSmallFire />,
    effect: "Burns enemies over time with fire damage.",
    description:
      "Harness the destructive power of fire. Fire elements unleash intense heat and flame, causing continuous damage and igniting opponents. They excel in offensive strategies with high damage output.",
  },
  Water: {
    color: "#1C86EE",
    element: "Water",
    icon: <GiDrop />,
    effect: "Cools and calms, providing defensive and healing abilities.",
    description:
      "Control the flow of water to heal and protect. Water elements are versatile, providing both restorative abilities and defensive measures. They excel in support roles with healing and protective spells.",
  },
  Earth: {
    color: "#4B3621",
    element: "Earth",
    icon: <GiStonePile />,
    effect: "Provides stability and defensive strength.",
    description:
      "Command the raw power of the earth to create formidable defenses. Earth elements are known for their resilience and ability to fortify allies. They excel in defensive strategies and crowd control.",
  },
  Air: {
    color: "#4682B4",
    element: "Air",
    icon: <GiTornado />,
    effect: "Brings swift and evasive maneuvers, enhancing agility.",
    description:
      "Harness the winds to enhance speed and agility. Air elements are masters of evasion and rapid movement, allowing them to outmaneuver enemies and strike with precision. They excel in hit-and-run tactics.",
  },
  Electric: {
    color: "#DAA520",
    element: "Electric",
    icon: <GiLightningTrio />,
    effect: "Electrifies attacks with shocking damage and stunning effects.",
    description:
      "Unleash the raw power of electricity to shock and stun. Electric elements are known for their high burst damage and ability to incapacitate opponents with stunning effects. They excel in disrupting enemy strategies.",
  },
  Nature: {
    color: "#2E8B57",
    element: "Nature",
    icon: <GiVineLeaf />,
    effect: "Harmonizes with surroundings, providing healing and growth.",
    description:
      "Bask in the harmony of nature to nurture and heal. Nature elements foster growth and recovery, enhancing allies' resilience and restoring their vitality. They excel in support roles with regenerative abilities.",
  },
  Ice: {
    color: "#008B8B",
    element: "Ice",
    icon: <GiIceBolt />,
    effect: "Freezes enemies and slows their actions.",
    description:
      "Command the chilling force of ice to freeze and slow. Ice elements excel in crowd control, impairing enemy movement and actions with freezing effects. They are effective in both offensive and defensive roles.",
  },
  Shadow: {
    color: "#4B0082",
    icon: <GiMoon />,
    element: "Dark",
    effect: "Obscures vision and deals shadowy damage.",
    description:
      "Harness the dark energies of the shadow realm. Shadow elements are adept at inflicting debilitating effects and dealing damage from the darkness. They excel in stealth and debuffing enemies.",
  },
  Light: {
    color: "#B8860B",
    element: "Light",
    icon: <GiSundial />,
    effect: "Illuminates and heals, providing clarity and purity.",
    description:
      "Wield the power of light to heal and illuminate. Light elements offer restorative magic and clarity, purging darkness and providing support to allies. They excel in healing and protective roles.",
  },
  Metal: {
    color: "#4F4F4F",
    element: "Metal",
    icon: <GiMetalBar />,
    effect: "Strengthens defenses and enhances durability.",
    description:
      "Command the strength of metal to fortify and enhance. Metal elements are known for their durability and ability to improve defenses. They excel in bolstering allies and resisting damage.",
  },
};


const classData: Record<
  string,
  {
    color: string;
    class: string;
    icon: JSX.Element;
    effect: string;
    description: string;
  }
> = {
  Guardian: {
    color: "#2E7D32",
    class: "Guardian",
    icon: <GiTurtleShell />,
    effect: "Provides exceptional defense and protection for allies.",
    description:
      "The Guardian is the stalwart defender, shielding allies with unparalleled defensive skills. Guardians are essential for protecting the team from harm and withstanding enemy assaults.",
  },
  Breaker: {
    color: "#8B4513",
    class: "Breaker",
    icon: <GiPorcupine />,
    effect: "Breaks through enemy defenses with powerful attacks.",
    description:
      "The Breaker specializes in dismantling enemy defenses with sheer power. Breakers excel in offensive tactics, delivering crushing blows that can shatter even the most fortified defenses.",
  },
  Predator: {
    color: "#8B0000",
    class: "Predator",
    icon: <GiTigerHead />,
    effect: "Uses speed and ferocity to overwhelm opponents.",
    description:
      "The Predator is a fierce and swift attacker, leveraging speed and aggression to overwhelm foes. Predators excel in striking quickly and decisively, making them formidable in combat.",
  },
  Nimble: {
    color: "#AD1457",
    class: "Nimble",
    icon: <GiFox />,
    effect: "Dodges attacks and strikes with precision and agility.",
    description:
      "The Nimble class is characterized by its agility and precision. Nimble characters excel at avoiding attacks and delivering accurate strikes, making them elusive and deadly opponents.",
  },
};


const demoDate = new Date()

const PetView = () => {

// Define state variables
  const [elements, setElements] = useState(["Fire"]);
  const [classy, setClassy] = useState("Guardian");
  const [illustration, setIllustration] = useState("https://i.pinimg.com/originals/16/ee/c1/16eec1ba2375e94335144ebce70f0632.jpg");
  const [description, setDescription] = useState("A majestic and wise creature of the forest, embodying the essence of nature and balance. It wields the powers of growth and healing, restoring life and harmony wherever it roams.");
  const [name, setName] = useState("Verdant Dragon");
  const [level, setLevel] = useState(85);
  const [health, setHealth] = useState(1200);
  const [attack, setAttack] = useState(90);
  const [defense, setDefense] = useState(150);
  const [mana, setMana] = useState(200);
  const [rarity, setRarity] = useState("Ethereal");
  const [weakAgainst, setWeakAgainst] = useState(["Fire", "Ice", "Metal"]);
  const [strongAgainst, setStrongAgainst] = useState(["Water", "Earth", "Electric"]);
  const [username, setUsername] = useState("forest_keeper");
  const [date, setDate] = useState(new Date()); // Replace with your `demoDate`
  const [xpNeededToNextLevel, setXpNeededToNextLevel] = useState(80000);
  const [experience, setExperience] = useState(45000);



  const [elementStyles, setElementStyles] = useState<
    { color: string; element: string; icon: JSX.Element; effect: string; description: string; }[]
  >([]);
  const [classStyle, setClassStyle] = useState<{
    color: string;
    class: string;
    icon: JSX.Element | null;
    effect: string;
    description: string;
  }>({
    color: "#4CAF50",
    class: "Guardian",
    icon: null,
    effect: "",
  });
  const [percent, setPercent] = useState(0);
  const [rarityStyle, setRarityStyle] = useState("bg-primary");
  const [textStyle, setTextStyle] = useState("bg-primary");
  const [weakAgainstStyles, setWeakAgainstStyles] = useState<
    { color: string; element: string; icon: JSX.Element; effect: string }[]
  >([]);
  const [strongAgainstStyles, setStrongAgainstStyles] = useState<
    { color: string; element: string; icon: JSX.Element; effect: string }[]
  >([]);
 

  useEffect(() => {
    setElementStyles(elements.map((el) => elementData[el]));
  }, [elements]);

  useEffect(() => {
    if (classData[classy]) {
      setClassStyle(classData[classy]);
    }
  }, [classy]);

  useEffect(() => {
    setWeakAgainstStyles(weakAgainst.map((el) => elementData[el]));
  }, [weakAgainst]);

  useEffect(() => {
    setStrongAgainstStyles(strongAgainst.map((el) => elementData[el]));
  }, [strongAgainst]);

  useEffect(() => {
    switch (rarity) {
      case "Rustic":
        setRarityStyle("rustic-card");
        setTextStyle("rustic-text ");

        break;
      case "Arcane":
        setRarityStyle("arcane-card");
        setTextStyle("arcane-text ");
        break;
      case "Mythic":
        setRarityStyle("mythic-card");
        setTextStyle("mythic-text ");
        break;
      case "Exalted":
        setRarityStyle("exalted-card");
        setTextStyle("exalted-text ");
        break;
      case "Ethereal":
        setRarityStyle("ethereal-card ");
        setTextStyle("ethereal-text ");
        break;
      default:
        setRarityStyle("bg-primary");
        break;
    }
  }, [rarity]);
  useEffect(() => {
    const calculatedPercent = (experience / xpNeededToNextLevel) * 100;
    if (calculatedPercent > 100) {
      setPercent(100);
    } else {
      setPercent(calculatedPercent);
    }
  }, [experience, xpNeededToNextLevel]);
  return (
    <>
      <section
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)),url(${
            backgroundImages[elements[0]]
          })`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
        className="rounded-[0.75rem] text-white lg:w-[820px]  md:w-full  overflow-auto h-[60%] p-3 md:p-6  w-full flex flex-col  gap-3 items-start justify-start "
      >
        <section className=" flex gap-10 items-start justify-center flex-col md:flex-row my-6 md:mt-12">
          <section className="w-[25%] flex justify-start items-center flex-wrap flex-col md:flex-row">
            <Card
              className={`w-[150px] h-[150px] text-white rounded-full p-[0.25rem] relative overflow-hidden ${rarityStyle}`}
            >
              <CardContent className="w-full h-full bg-muted p-0 rounded-full relative bg-black">
                <img
                  src={illustration}
                  alt={name}
                  fetchpriority="auto"
                  loading="lazy"
                  className="w-full h-full rounded-full object-center text-center shimmer dark:opacity-50 "
                />
              </CardContent>
            </Card>
          </section>

          <section className="w-[100%] md:w-[70%] flex flex-col md:flex-row items-start gap-4 flex-wrap">
            <section className="w-full flex justify-between items-center">
              <div className=" font-bold text-2xl pb-1">
                {name}

                <p className="text-muted-foreground text-sm  ">@{username}</p>
              </div>
              <div
                className={`font-bold text-2xl w-[90px] rounded-[0.75rem] p-[0.1rem] ${rarityStyle}  `}
              >
                <div className="bg-muted rounded-[0.75rem]">
                  <p
                    className={`text-muted-foreground  rounded-[0.75rem]  text-base text-center  font-bold ${textStyle} `}
                  >
                    {rarity}
                  </p>
                </div>
              </div>
            </section>

            <p className="text-muted-foreground  pb-1">
              {description}{" "}
              <p className="text-muted-foreground text-sm font-bold w-fit  pt-2 ">
                pulled on -{" "}
                <span className="text-white">
                  {" "}
                  <DateConverter date={date} />{" "}
                </span>
              </p>
            </p>

            <h1 className=" font-bold text-lg  ">Experience</h1>
            <section className="w-full">
              <section className=" w-full  items-center   ">
                <div
                  className={`w-full h-3 ${styles.glassEffect}  rounded-[0.25rem] relative overflow-hidden`}
                >
                  <div
                    style={{ width: `${percent}%` }}
                    className={`absolute rounded-[0.75rem] opacity-90 ${rarityStyle} h-3 blur-[0.5px] transition-all duration-700 ease-in-out`}
                  ></div>
                </div>
                <h1 className="  text-[0.6rem] text-center bg-transparent text-muted-foreground mt-1 ">
                  {percent.toFixed()}%
                </h1>
              </section>
            </section>

            <h1 className=" font-bold text-lg ">Stats</h1>
            <div className="flex flex-wrap gap-2 ">
              <div
                className={`flex gap-2  items-center justify-center h-[35px]  p-2 rounded-[0.75rem] rounded-full ${styles.glassEffect}  min-w-[100px] `}
              >
                <div className=" font-bold text-sm uppercase text-white flex gap-1 items-center justify-center ">
                  <span className="text-[#B22222] text-lg">
                    <GiMineralHeart />
                  </span>
                  Hp
                </div>
                <h1 className="text-sm font-medium "> {health} </h1>
              </div>

              <div
                className={`flex gap-2  items-center justify-center h-[35px]  p-2 rounded-[0.75rem] rounded-full ${styles.glassEffect}  min-w-[100px] `}
              >
                <div className=" font-bold text-sm uppercase text-muted-foreground flex gap-1 items-center justify-center ">
                  <span className="text-[#FFD700] text-lg">
                    <GiStarCycle />
                  </span>
                  Lvl
                </div>
                <h1 className="text-sm font-medium ">
                  {" "}
                  <NumberCounter number={level} />{" "}
                </h1>
              </div>
              <div
                className={`flex gap-2  items-center justify-center h-[35px]  p-2 rounded-[0.75rem] rounded-full ${styles.glassEffect}  min-w-[100px] `}
              >
                <div className=" font-bold text-sm uppercase text-muted-foreground flex gap-1 items-center justify-center ">
                  <span className="text-[#FF4500] text-lg">
                    <GiBouncingSword />
                  </span>
                  att
                </div>
                <h1 className="text-sm font-medium "> {attack} </h1>
              </div>
              <div
                className={`flex gap-2  items-center justify-center h-[35px]  p-2 rounded-[0.75rem] rounded-full ${styles.glassEffect}  min-w-[100px] `}
              >
                <div className=" font-bold text-sm uppercase text-muted-foreground flex gap-1 items-center justify-center ">
                  <span className="text-[#4682B4] text-lg">
                    <GiVibratingShield />
                  </span>
                  def
                </div>
                <h1 className="text-sm font-medium "> {defense}</h1>
              </div>
              <div
                className={`flex gap-2  items-center justify-center h-[35px]  p-2 rounded-[0.75rem] rounded-full ${styles.glassEffect}  min-w-[100px] `}
              >
                <div className=" font-bold text-sm uppercase text-muted-foreground flex gap-1 items-center justify-center ">
                  <span className="text-[#6A5ACD] text-lg">
                    <GiMagicSwirl />
                  </span>
                  mp
                </div>
                <h1 className="text-sm font-medium "> {mana} </h1>
              </div>
            </div>
            <section className="flex gap-4 flex-wrap">
              <div>
                <div className="flex flex-col gap-2 ">
                  <div>
                    <div className=" font-bold text-lg  pb-1">Class</div>
                    <div className="flex flex-wrap gap-2 pb-1">
                      <div
                        style={{ backgroundColor: classStyle.color }}
                        className="p-2  px-3 font-bold min-w-[100px] gap-1 h-[35px]   rounded-full  flex items-center justify-center"
                      >
                        {classStyle.icon}
                        {classStyle.class}
                      </div>

                      <p className="text-muted-foreground text-sm  leading-relaxed ">
                        {classStyle.effect},<br />
                        {classStyle.description}
                      </p>
                    </div>
                  </div>
                </div>
                <h1 className=" font-bold text-lg  pb-2">Elements</h1>
                <div className="flex flex-wrap md:gap-3 gap-2 ">
                  {elementStyles.map((el, index) => (
                    <div className="flex flex-wrap gap-2 pb-1">
                      <div
                        key={index}
                        style={{ backgroundColor: el.color }}
                        className="p-2 font-bold gap-1 min-w-[100px] h-[35px]  rounded-full text-center flex items-center justify-center"
                      >
                        {el.icon}
                        {el.element}
                      </div>
                      <p className="text-muted-foreground text-sm  leading-relaxed ">
                        {el.effect},<br />
                        {el.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="flex gap-4 flex-wrap">
              <div>
                <h1 className=" font-bold text-lg  pb-2">
                  Elements Strong Against
                </h1>
                <div className="flex flex-wrap md:gap-3 gap-2">
                  {strongAgainstStyles.map((el, index) => (
                    <div
                      key={index}
                      style={{ backgroundColor: el.color }}
                      className="p-2 font-bold gap-1 min-w-[100px] h-[35px] ${styles.glassEffect}  rounded-full text-center flex items-center justify-center"
                    >
                      {el.icon}
                      {el.element}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="flex gap-4 flex-wrap">
              <div>
                <h1 className=" font-bold text-lg  pb-2 ">
                  Elements weak Against
                </h1>
                <div className="flex flex-wrap md:gap-3 gap-2">
                  {weakAgainstStyles.map((el, index) => (
                    <div
                      key={index}
                      style={{ backgroundColor: el.color }}
                      className="p-2 font-bold gap-1 min-w-[100px] h-[35px] ${styles.glassEffect}  rounded-full text-center flex items-center justify-center"
                    >
                      {el.icon}
                      {el.element}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </section>
        </section>
      </section>
    </>
  );
};

export default PetView;
