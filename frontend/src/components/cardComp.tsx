
import React, { useState, useEffect } from "react";
import phynix from "@/assets/static/download.jpeg";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  GiPoisonGas,
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
  weakAgainst: string[];
  strongAgainst: string[];
}

const elementData: Record<
  string,
  { color: string; icon: JSX.Element; effect: string }
> = {
  Fire: {
    color: "#FF4500",
    icon: <GiSmallFire />,
    effect: "Burns enemies over time with fire damage.",
  },
  Water: {
    color: "#00BFFF",
    icon: <GiDrop />,
    effect: "Cools and calms, providing defensive and healing abilities.",
  },
  Earth: {
    color: "#8B4513",
    icon: <GiStonePile />,
    effect: "Provides stability and defensive strength.",
  },
  Air: {
    color: "#87CEFA",
    icon: <GiTornado />,
    effect: "Brings swift and evasive maneuvers, enhancing agility.",
  },
  Electric: {
    color: "#FFD700",
    icon: <GiLightningTrio />,
    effect: "Electrifies attacks with shocking damage and stunning effects.",
  },
  Nature: {
    color: "#32CD32",
    icon: <GiVineLeaf />,
    effect: "Harmonizes with surroundings, providing healing and growth.",
  },
  Ice: {
    color: "#00FFFF",
    icon: <GiIceBolt />,
    effect: "Freezes enemies and slows their actions.",
  },
  Dark: {
    color: "#8A2BE2",
    icon: <GiMoon />,
    effect: "Obscures vision and deals shadowy damage.",
  },
  Light: {
    color: "#FFF700",
    icon: <GiSundial />,
    effect: "Illuminates and heals, providing clarity and purity.",
  },
  Metal: {
    color: "#B0C4DE",
    icon: <GiMetalBar />,
    effect: "Strengthens defenses and enhances durability.",
  },
};

const classData: Record<
  string,
  { color: string; icon: JSX.Element; effect: string }
> = {
  Guardian: {
    color: "#4CAF50",
    icon: <GiTurtleShell />,
    effect: "Provides exceptional defense and protection for allies.",
  },
  Breaker: {
    color: "#B0C4DE",
    icon: <GiPorcupine />,
    effect: "Breaks through enemy defenses with powerful attacks.",
  },
  Predator: {
    color: "#FF5722",
    icon: <GiTigerHead />,
    effect: "Uses speed and ferocity to overwhelm opponents.",
  },
  Nimble: {
    color: "#E91E63",
    icon: <GiFox />,
    effect: "Dodges attacks and strikes with precision and agility.",
  },
};

const CardComp: React.FC<Props> = ({
  elements = ["Dark", "Light"],
  classy = "Breaker",
  illustration = "https://i.pinimg.com/originals/92/b8/41/92b841ca44cc515099196aceae3479f9.jpg",
  description = " majestic and fearsome creature of the night, shrouded in darkness and possessing an aura of mystery and power. It harnesses the elements of darkness and light to strike fear and confusion into its enemies.",
  name = "Shadow Lion",
  level = 100,
  health = 1000,
  attack = 100,
  defense = 100,
  mana = 100,
  rarity = "Mythic",
  weakAgainst = ["Water", "Ice", "Electric"],
  strongAgainst = ["Light", "Fire", "Nature"],
}) => {
  const [hover, setHover] = useState(false);
  const [elementStyles, setElementStyles] = useState<
    { color: string; icon: JSX.Element; effect: string }[]
  >([]);
  const [classStyle, setClassStyle] = useState<{
    color: string;
    icon: JSX.Element | null;
    effect: string;
  }>({
    color: "#4CAF50",
    icon: null,
    effect: "",
  });
  const [rarityStyle, setRarityStyle] = useState("bg-primary");
  const [weakAgainstStyles, setWeakAgainstStyles] = useState<
    { color: string; icon: JSX.Element; effect: string }[]
  >([]);
  const [strongAgainstStyles, setStrongAgainstStyles] = useState<
    { color: string; icon: JSX.Element; effect: string }[]
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
        break;
      case "Arcane":
        setRarityStyle("arcane-card");
        break;
      case "Mythic":
        setRarityStyle("mythic-card");
        break;
      case "Exalted":
        setRarityStyle("exalted-card");
        break;
      case "Ethereal":
        setRarityStyle("ethereal-card");
        break;
      default:
        setRarityStyle("bg-primary");
        break;
    }
  }, [rarity]);

  return (
    <Card
      className={`md:w-[250px] card md:h-[360px] w-[220px] h-[320px]   text-white rounded-[0.2rem] p-[0.35rem] relative overflow-hidden ${rarityStyle}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <CardContent className="w-full  h-full bg-muted p-0 relative bg-black  ">
        <img
          src={illustration}
          alt={name}
          fetchPriority="auto"
          loading="lazy"
          className="w-full h-full  object-center text-center shimmer opacity-50 "
        />
        {!hover && (
          <>
            <div className="absolute bottom-10 left-2 flex-col flex gap-2 ">
              {strongAgainstStyles.map((el, index) => (
                <p
                  key={index}
                  style={{ color: el.color }}
                  className="p-1 font-bold w-[30px]  bg-black bg-opacity-60  rounded-full h-[30px] text-center flex items-center justify-center"
                >
                  {el.icon}
                </p>
              ))}
            </div>
            <div className="absolute top-2 right-2 flex flex-col items-end gap-2 ">
              <div className="flex items-center p-1  rounded gap-3 justify-evenly w-full bg-black bg-opacity-80">
                <p className="font-medium flex gap-1 scale-[0.8] md:scale-100  text-sm items-center justify-center w-1/4">
                  <span className="text-[#ff47e0] text-lg ">
                    <GiMineralHeart />
                  </span>
                  {health}
                </p>
                <p className="font-medium gap-1 scale-[0.8] md:scale-100  text-sm flex items-center  justify-center w-1/4">
                  <span className="text-[#FFD700] text-lg ">
                    <GiStarCycle />
                  </span>
                  {level}
                </p>
              </div>
              {elementStyles.map((el, index) => ( 
                <p
                  key={index}
                  style={{ color: el.color }}
                  className="p-1 font-bold w-[30px]  bg-black bg-opacity-60  rounded-full h-[30px] text-center flex items-center justify-center"
                >
                  {el.icon}
                </p>
              ))}
              <p
                style={{ color: classStyle.color }}
                className="p-1 font-bold w-[30px]  bg-black bg-opacity-60  rounded-full h-[30px] text-center flex items-center justify-center"
              >
                {classStyle.icon}
              </p>
            </div>

            <div className=" absolute bottom-[0.1rem] left-[0.3rem] font-bold w-[95%] flex flex-col items-start">
              <h1 className="my-1 border-b border-white w-full text-center">
                {name}
              </h1>
              <div className="flex items-center justify-evenly w-full py-1 bg-black bg-opacity-80">
                <p className="font-medium scale-[0.8] md:scale-100 flex gap-1 text-sm items-center justify-center w-1/4">
                  <span className="text-[#DC143C] text-lg">
                    <GiBouncingSword />
                  </span>
                  {attack}
                </p>
                <p className="font-medium scale-[0.8] md:scale-100  flex gap-1 text-sm items-center justify-center w-1/4">
                  <span className="text-[#228B22] text-lg ">
                    <GiVibratingShield />
                  </span>
                  {defense}
                </p>
                <p className="font-medium scale-[0.8] md:scale-100  gap-1 text-sm flex items-center  justify-center w-1/4">
                  <span className="text-[#4169E1] text-lg ">
                    <GiMagicSwirl />
                  </span>
                  {mana}
                </p>
              </div>
            </div>
          </>
        )}
        {hover && (
          <div className="absolute inset-0 bg-black bg-opacity-80 font-medium   hidden md:flex items-start justify-center text-white text-sm p-2 animate-slide-up">
            <div className="flex flex-col">
              <h1 className="my-1 mb-2 border-b font-bold border-white w-full text-center ">
                {name}
              </h1>
              <p className="text-sm leading-[0.95rem] font-bold ">
                {description}
              </p>
            </div>

            <div className="absolute bottom-2 left-2 w-full p-2 flex flex-col items-start  ">
              {elementStyles.map((el, index) => (
                <p
                  key={index}
                  style={{ color: el.color }}
                  className="text-lg flex  gap-2 justify-center items-start"
                >
                  {el.icon}
                  <span className="text-xs text-white font-bold">
                    {el.effect}
                  </span>
                </p>
              ))}
              <p
                style={{ color: classStyle.color }}
                className="text-lg flex items-start  gap-2 justify-center"
              >
                {classStyle.icon}
                <span className="text-xs text-white font-bold">
                  {classStyle.effect}
                </span>
              </p>

              <p className=" mx-auto text-white text-xs  mt-2 font-bold border-white  text-center ">
                Weak Against
              </p>
              <span className="flex justify-center mt-1">
                {weakAgainstStyles.map((el, index) => (
                  <span
                    key={index}
                    style={{ color: el.color }}
                    className="text-lg flex items-start  gap-2 justify-center"
                  >
                    <br />
                    {el.icon}
                  </span>
                ))}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CardComp;
