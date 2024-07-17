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

const GameCardComp: React.FC<Props> = ({
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
  strongAgainst = ["Water", "Fire", "Nature"],
}) => {

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
  }, []);

  useEffect(() => {
    if (classData[classy]) {
      setClassStyle(classData[classy]);
    }
  }, []);

  useEffect(() => {
    setWeakAgainstStyles(weakAgainst.map((el) => elementData[el]));
  }, []);
  useEffect(() => {
    setStrongAgainstStyles(strongAgainst.map((el) => elementData[el]));
  }, []);

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
      className={` card  w-[160px] h-[260px]   text-white rounded-[0.2rem] p-[0.2rem] relative overflow-hidden ${rarityStyle}`}
    >
      <CardContent className="w-full  h-full bg-muted p-0 relative bg-black  ">
        <img
          src={illustration}
          alt={name}
          fetchPriority="auto"
          loading="lazy"
          className="w-full h-full  object-center text-center shimmer opacity-50 "
        />
        <>
          <div className="absolute top-2 right-2 flex flex-col items-end gap-1 ">
            <div className="flex items-center  rounded gap-2 justify-evenly w-full bg-black bg-opacity-85">
              <p className="font-medium flex gap-1 scale-[0.85]   text-sm items-center justify-center w-1/4">
                <span className="text-[#ff47e0] text-md ">
                  <GiMineralHeart />
                </span>
                {health}
              </p>
              <p className="font-medium gap-1 scale-[0.85]  text-sm flex items-center  justify-center w-1/4">
                <span className="text-[#FFD700] text-md ">
                  <GiStarCycle />
                </span>
                {level}
              </p>
            </div>
            {elementStyles.map((el, index) => (
              <p
                key={index}
                style={{ color: el.color }}
                className="p-1 font-bold w-[25px]  bg-black bg-opacity-85  rounded-full h-[25px] text-center flex items-center justify-center"
              >
                {el.icon}
              </p>
            ))}
            <p
              style={{ color: classStyle.color }}
              className="p-1 font-bold w-[25px]  bg-black bg-opacity-85  rounded-full h-[25px] text-center flex items-center justify-center"
            >
              {classStyle.icon}
            </p>
          </div>

          <div className=" absolute bottom-[0.08rem] left-1/2 -translate-x-[50%] font-bold w-[98%] flex flex-col items-start">
            <h1 className=" border-b border-white w-full text-center text-sm">
              {name}
            </h1>
            <div className="absolute bottom-10 left-2  flex flex-col gap-2  ">
              {strongAgainstStyles.map((el, index) => (
                <p
                  key={index}
                  style={{ color: el.color }}
                  className="p-1 font-bold w-[22px]  bg-black bg-opacity-60  rounded-full h-[22px]  text-center  flex items-center justify-center"
                >
                  {el.icon}
                </p>
              ))}
            </div>
            <div className="flex items-center justify-evenly w-full  bg-black bg-opacity-85">
              <p className="font-medium scale-[0.8]  flex gap-1 text-sm items-center justify-center w-1/4">
                <span className="text-[#DC143C] text-md">
                  <GiBouncingSword />
                </span>
                {attack}
              </p>
              <p className="font-medium scale-[0.8]   flex gap-1 text-sm items-center justify-center w-1/4">
                <span className="text-[#228B22] text-md ">
                  <GiVibratingShield />
                </span>
                {defense}
              </p>
              <p className="font-medium scale-[0.8]   gap-1 text-sm flex items-center  justify-center w-1/4">
                <span className="text-[#4169E1] text-md ">
                  <GiMagicSwirl />
                </span>
                {mana}
              </p>
            </div>
          </div>
        </>
      </CardContent>
    </Card>
  );
};

export default GameCardComp;
