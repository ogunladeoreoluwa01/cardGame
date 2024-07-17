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

interface Props {
  xpNeededToNextLevel: number | null;
  experience: number | null;
  elements: string[];
  classy: string;
  illustration: string;
  description: string;
  name: string;
  level: number;
  health: number;
  attack: number;
  defense: number;
  mana: number;
  rarity: string;
  username: string;
  weakAgainst: string[];
  strongAgainst: string[];
  date: Date;
}

const elementData: Record<
  string,
  { color: string; element: string; icon: JSX.Element; effect: string }
> = {
  Fire: {
    color: "#FF4500",
    element: "Fire",
    icon: <GiSmallFire />,
    effect: "Burns enemies over time with fire damage.",
  },
  Water: {
    color: "#00BFFF",
    element: "Water",
    icon: <GiDrop />,
    effect: "Cools and calms, providing defensive and healing abilities.",
  },
  Earth: {
    color: "#8B4513",
    element: "Earth",
    icon: <GiStonePile />,
    effect: "Provides stability and defensive strength.",
  },
  Air: {
    color: "#87CEFA",
    element: "Air",
    icon: <GiTornado />,
    effect: "Brings swift and evasive maneuvers, enhancing agility.",
  },
  Electric: {
    color: "#FFD700",
    element: "Electric",
    icon: <GiLightningTrio />,
    effect: "Electrifies attacks with shocking damage and stunning effects.",
  },
  Nature: {
    color: "#32CD32",
    element: "Nature",
    icon: <GiVineLeaf />,
    effect: "Harmonizes with surroundings, providing healing and growth.",
  },
  Ice: {
    color: "#00FFFF",
    element: "Ice",
    icon: <GiIceBolt />,
    effect: "Freezes enemies and slows their actions.",
  },
  Dark: {
    color: "#8A2BE2",
    icon: <GiMoon />,
    element: "Dark",
    effect: "Obscures vision and deals shadowy damage.",
  },
  Light: {
    color: "#FFF700",
    element: "Light",
    icon: <GiSundial />,
    effect: "Illuminates and heals, providing clarity and purity.",
  },
  Metal: {
    color: "#B0C4DE",
    element: "Metal",
    icon: <GiMetalBar />,
    effect: "Strengthens defenses and enhances durability.",
  },
};

const classData: Record<
  string,
  { color: string; class: string; icon: JSX.Element; effect: string }
> = {
  Guardian: {
    color: "#4CAF50",
    class: "Guardian",
    icon: <GiTurtleShell />,
    effect: "Provides exceptional defense and protection for allies.",
  },
  Breaker: {
    color: "#B0C4DE",
    class: "Breaker",
    icon: <GiPorcupine />,
    effect: "Breaks through enemy defenses with powerful attacks.",
  },
  Predator: {
    color: "#FF5722",
    class: "Predator",
    icon: <GiTigerHead />,
    effect: "Uses speed and ferocity to overwhelm opponents.",
  },
  Nimble: {
    color: "#E91E63",
    class: "Nimble",
    icon: <GiFox />,
    effect: "Dodges attacks and strikes with precision and agility.",
  },
};

const demoDate = new Date()

const PetView: React.FC<Props> = ({
  elements = ["Nature"],
  classy = "Guardian",
  illustration = "https://i.pinimg.com/originals/16/ee/c1/16eec1ba2375e94335144ebce70f0632.jpg",
  description = "A majestic and wise creature of the forest, embodying the essence of nature and balance. It wields the powers of growth and healing, restoring life and harmony wherever it roams.",
  name = "Verdant Dragon",
  level = 85,
  health = 1200,
  attack = 90,
  defense = 150,
  mana = 200,
  rarity = "Ethereal",
  weakAgainst = ["Fire", "Ice", "Metal"],
  strongAgainst = ["Water", "Earth", "Electric"],
  username = "forest_keeper",
  date = demoDate,
  xpNeededToNextLevel = 80000,
  experience = 45000,
}) => {
  const [elementStyles, setElementStyles] = useState<
    { color: string; element: string; icon: JSX.Element; effect: string }[]
  >([]);
  const [classStyle, setClassStyle] = useState<{
    color: string;
    class: string;
    icon: JSX.Element | null;
    effect: string;
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
      <section className="rounded-[0.75rem] lg:w-[820px] md:w-full bg-muted h-fit p-3 md:p-6  w-full flex flex-col  gap-3 items-start justify-start ">
        <section className=" flex gap-10 items-start justify-center flex-col md:flex-row my-6 md:mt-12">
          <section className="w-[25%] flex justify-start items-center flex-wrap flex-col md:flex-row">
            <Card
              className={`w-[150px] h-[150px] text-white rounded-full p-[0.25rem] relative overflow-hidden ${rarityStyle}`}
            >
              <CardContent className="w-full h-full bg-muted p-0 rounded-full relative bg-black">
                <img
                  src={illustration}
                  alt={name}
                  fetchPriority="auto"
                  loading="lazy"
                  className="w-full h-full rounded-full object-center text-center shimmer dark:opacity-50 "
                />
              </CardContent>
            </Card>

            <div className="flex flex-col gap-4 mt-4">
              <div className="md:flex flex-col gap-2 hidden">
                <div>
                  <div className=" font-bold text-lg pb-1">Class</div>
                  <div className="flex flex-wrap gap-3">
                    <div
                      style={{ color: classStyle.color }}
                      className="p-2 font-bold w-[100px] gap-1 h-[35px] bg-black dark:bg-opacity-30 bg-opacity-10   rounded-full text-center flex items-center justify-center"
                    >
                      {classStyle.icon}
                      {classStyle.class}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="w-[100%] md:w-[70%] flex flex-col md:flex-row items-start gap-4 flex-wrap">
            <section className="w-full flex justify-between items-center">
              <div className=" font-bold text-2xl pb-1">
                {name}

                <p className="text-muted-foreground text-sm  ">@{username}</p>
              </div>
              <div
                className={`font-bold text-2xl   w-[90px] rounded-[0.75rem] p-[0.1rem] ${rarityStyle}  `}
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

            <p className="text-muted-foreground  pb-2">
              {description}{" "}
              <p className="text-muted-foreground text-sm font-bold w-fit  pt-2 ">
                pulled on - <DateConverter date={date} />{" "}
              </p>
            </p>

            <h1 className=" font-bold text-lg pb-1 ">Experience</h1>
            <section className="w-full">
              <section className=" w-full  items-center bg-muted  ">
                <div className="w-full h-3 bg-black dark:bg-opacity-30 bg-opacity-10 rounded-[0.25rem] relative overflow-hidden">
                  <div
                    style={{ width: `${percent}%` }}
                    className={`absolute rounded-[0.75rem] opacity-90 ${rarityStyle} h-3 blur-[0.5px] transition-all duration-700 ease-in-out`}
                  ></div>
                </div>
                <h1 className="  text-[0.6rem] text-center text-muted-foreground mt-1 ">
                  {percent.toFixed()}%
                </h1>
              </section>
            </section>

            <div className="flex flex-col gap-2 md:hidden">
              <div>
                <div className=" font-bold text-lg  pb-1">Class</div>
                <div className="flex flex-wrap gap-3">
                  <div
                    style={{ color: classStyle.color }}
                    className="p-2 font-bold w-[100px] gap-1 h-[35px] bg-black dark:bg-opacity-30 bg-opacity-10 rounded-full text-center flex items-center justify-center"
                  >
                    {classStyle.icon}
                    {classStyle.class}
                  </div>
                </div>
              </div>
            </div>

            <h1 className=" font-bold text-lg ">Stats</h1>
            <div className="flex flex-wrap gap-2">
              <div className="flex flex-col  items-center  px-4 py-2 rounded-[0.75rem] bg-black dark:bg-opacity-30 bg-opacity-10 w-[100px] ">
                <div className=" font-bold text-sm uppercase text-muted-foreground flex gap-1 items-center justify-center ">
                  <span className="text-[#ff47e0] text-lg">
                    <GiMineralHeart />
                  </span>
                  health
                </div>
                <h1 className="text-sm font-medium "> {health} </h1>
              </div>

              <div className="flex flex-col  items-center  px-4 py-2 rounded-[0.75rem] bg-black dark:bg-opacity-30 bg-opacity-10 w-[100px] ">
                <div className=" font-bold text-sm uppercase text-muted-foreground flex gap-1 items-center justify-center ">
                  <span className="text-[#FFD700] text-lg">
                    <GiStarCycle />
                  </span>
                  LEVEL
                </div>
                <h1 className="text-sm font-medium ">
                  {" "}
                  <NumberCounter number={level} />{" "}
                </h1>
              </div>
              <div className="flex flex-col  items-center  px-4 py-2 rounded-[0.75rem] bg-black dark:bg-opacity-30 bg-opacity-10 w-[100px] ">
                <div className=" font-bold text-sm uppercase text-muted-foreground flex gap-1 items-center justify-center ">
                  <span className="text-[#DC143C] text-lg">
                    <GiBouncingSword />
                  </span>
                  attack
                </div>
                <h1 className="text-sm font-medium "> {attack} </h1>
              </div>
              <div className="flex flex-col  items-center  px-4 py-2 rounded-[0.75rem] bg-black dark:bg-opacity-30 bg-opacity-10 w-[100px] ">
                <div className=" font-bold text-sm uppercase text-muted-foreground flex gap-1 items-center justify-center ">
                  <span className="text-[#228B22] text-lg">
                    <GiVibratingShield />
                  </span>
                  defense
                </div>
                <h1 className="text-sm font-medium "> {defense}</h1>
              </div>
              <div className="flex flex-col  items-center  px-4 py-2 rounded-[0.75rem] bg-black dark:bg-opacity-30 bg-opacity-10 w-[100px] ">
                <div className=" font-bold text-sm uppercase text-muted-foreground flex gap-1 items-center justify-center ">
                  <span className="text-[#4169E1] text-lg">
                    <GiMagicSwirl />
                  </span>
                  mana
                </div>
                <h1 className="text-sm font-medium "> {mana} </h1>
              </div>
            </div>
            <section className="flex gap-4 flex-wrap">
              <div>
                <h1 className=" font-bold text-lg  pb-2">Elements</h1>
                <div className="flex flex-wrap md:gap-3 gap-2 ">
                  {elementStyles.map((el, index) => (
                    <div
                      key={index}
                      style={{ color: el.color }}
                      className="p-2 font-bold gap-1 w-[100px] h-[35px] bg-black dark:bg-opacity-30 bg-opacity-10 rounded-full text-center flex items-center justify-center"
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
                <h1 className=" font-bold text-lg  pb-2">
                  Elements Strong Against
                </h1>
                <div className="flex flex-wrap md:gap-3 gap-2">
                  {strongAgainstStyles.map((el, index) => (
                    <div
                      key={index}
                      style={{ color: el.color }}
                      className="p-2 font-bold gap-1 w-[100px] h-[35px] bg-black dark:bg-opacity-30 bg-opacity-10 rounded-full text-center flex items-center justify-center"
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
                      style={{ color: el.color }}
                      className="p-2 font-bold gap-1 w-[100px] h-[35px] bg-black dark:bg-opacity-30 bg-opacity-10 rounded-full text-center flex items-center justify-center"
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
