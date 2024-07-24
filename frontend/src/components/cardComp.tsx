import React, { useState, useEffect } from "react";
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
  defence: number;
  mana: number;
  rarity: string;
}

const elementData: Record<
  string,
  { color: string; icon: JSX.Element; effect: string }
> = {
  Fire: {
    color: "#8B0000",
    icon: <GiSmallFire />,
    effect: "Burns enemies over time with fire damage.",
  },
  Water: {
    color: "#1C86EE",
    icon: <GiDrop />,
    effect: "Cools and calms, providing defensive and healing abilities.",
  },
  Earth: {
    color: "#4B3621",
    icon: <GiStonePile />,
    effect: "Provides stability and defensive strength.",
  },
  Air: {
    color: "#4682B4",
    icon: <GiTornado />,
    effect: "Brings swift and evasive maneuvers, enhancing agility.",
  },
  Electric: {
    color: "#DAA520",
    icon: <GiLightningTrio />,
    effect: "Electrifies attacks with shocking damage and stunning effects.",
  },
  Nature: {
    color: "#2E8B57",
    icon: <GiVineLeaf />,
    effect: "Harmonizes with surroundings, providing healing and growth.",
  },
  Ice: {
    color: "#008B8B",
    icon: <GiIceBolt />,
    effect: "Freezes enemies and slows their actions.",
  },
  Dark: {
    color: "#4B0082",
    icon: <GiMoon />,
    effect: "Obscures vision and deals shadowy damage.",
  },
  Light: {
    color: "#B8860B",
    icon: <GiSundial />,
    effect: "Illuminates and heals, providing clarity and purity.",
  },
  Metal: {
    color: "#4F4F4F",
    icon: <GiMetalBar />,
    effect: "Strengthens defenses and enhances durability.",
  },
};

const classData: Record<
  string,
  { color: string; icon: JSX.Element; effect: string }
> = {
  Guardian: {
    color: "#2E7D32",
    icon: <GiTurtleShell />,
    effect: "Provides exceptional defense and protection for allies.",
  },
  Breaker: {
    color: "#8B4513",
    icon: <GiPorcupine />,
    effect: "Breaks through enemy defenses with powerful attacks.",
  },
  Predator: {
    color: "#8B0000",
    icon: <GiTigerHead />,
    effect: "Uses speed and ferocity to overwhelm opponents.",
  },
  Nimble: {
    color: "#AD1457",
    icon: <GiFox />,
    effect: "Dodges attacks and strikes with precision and agility.",
  },
};



const CardComp: React.FC<Props> = ({
  elements = ["Dark", "Light"],
  classy = "Breaker",
  illustration = "https://i.pinimg.com/originals/92/b8/41/92b841ca44cc515099196aceae3479f9.jpg",
  description = "A majestic and fearsome creature of the night, shrouded in darkness and possessing an aura of mystery and power. It harnesses the elements of darkness and light to strike fear and confusion into its enemies.",
  name = "Shadow Lion",
  level = 100,
  health = 1000,
  attack = 100,
  defence = 100,
  mana = 100,
  rarity = "Ethereal",
}) => {
  const [rarityStyle, setRarityStyle] = useState("bg-primary");
  const [classStyle, setClassStyle] = useState<{
    color: string;
    icon: JSX.Element | null;
    effect: string;
  }>({
    color: "#4CAF50",
    icon: null,
    effect: "",
  });
  const [elementStyles, setElementStyles] = useState<
    { color: string; icon: JSX.Element; effect: string }[]
  >([]);

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

  
  useEffect(() => {
    setElementStyles(elements.map((el) => elementData[el]));
  }, []);

  useEffect(() => {
    if (classData[classy]) {
      setClassStyle(classData[classy]);
    }
  }, [classy]);

  return (
    <Card
      className={`card saturate-150 w-[300px] h-[400px] md:w-[200px] md:h-[300px] p-1  md:p-[0.22rem] relative overflow-hidden ${rarityStyle} font-mono`}
    >
      <div
        className={`w-[3rem] h-[2rem] md:w-[2.25rem] md:h-[1.45rem] flex p-1 md:p-[0.21rem]   justify-center items-center absolute top-0 -right-[2px] md:right-0 z-30  ${rarityStyle} rounded-full`}
      >
        <h1 className="w-full h-full cardBg rounded-full md:text-sm  flex text-white   justify-center items-center ">
          {level}
        </h1>
      </div>
      <CardContent
        className={`w-full mx-auto h-full bg-muted p-0 relative bg-black cardBg rounded-t-[0.5rem] rounded-b-[1.5rem] flex flex-col items-center`}
      >
        <h1 className="absolute top-4 left-1/2 line-clamp-1 md:text-sm text-md  -translate-x-1/2 text-white z-20  px-2 py-1 w-[98%] text-center h-8">
          {name}
        </h1>
        <div className="w-full h-[270px] md:h-[210px] bg-black rounded-t-[0.5rem] relative">
          <div className="flex flex-col text-white absolute top-2 gap-1 left-1 z-20">
            <span className="flex items-center gap-1 text-[#B22222] w-fit backdrop-blur-sm">
              <GiMineralHeart />{" "}
              <p className="text-white md:text-xs">{health}</p>
            </span>
          </div>
          <div className="flex flex-col text-white absolute bottom-2 gap-1 left-1 z-20">
            <span className="flex items-center gap-1 text-[#FF4500] w-fit backdrop-blur-sm">
              <GiBouncingSword />{" "}
              <p className="text-white md:text-xs">{attack}</p>
            </span>
            <span className="flex items-center gap-1 text-[#4682B4] w-fit backdrop-blur-sm">
              <GiVibratingShield />{" "}
              <p className="text-white md:text-xs">{defence}</p>
            </span>
            <span className="flex items-center gap-1 text-[#6A5ACD] w-fit backdrop-blur-sm">
              <GiMagicSwirl /> <p className="text-white md:text-xs">{mana}</p>
            </span>
          </div>
          <img
            src={illustration}
            alt={name}
            fetchpriority="auto"
            loading="lazy"
            className="w-full h-full object-center text-center rounded-t-[0.5rem] opacity-50"
          />
        </div>
        <div className="w-full rounded-b-[0.5rem] relative p-2 h-[80px] object-cover border-white border-t-[3px] cardBg">
          <div className="-top-5 md:-top-4 left-1/2 -translate-x-[50%] text-white absolute flex justify-center items-center gap-2">
            {elementStyles.map((el, index) => (
              <div
                key={index}
                style={{ backgroundColor: el.color }}
                className="md:w-7 md:h-7 w-10 h-10 p-1 flex items-center justify-center rounded-full text-xl border-white border-2"
              >
                {el.icon}
              </div>
            ))}
            <div
              style={{ backgroundColor: classStyle.color }}
              className="md:w-7 md:h-7 w-10 h-10 p-1 flex items-center  text-white justify-center rounded-full text-xl border-white border-2"
            >
              {classStyle.icon}
            </div>
          </div>
          <p className="mt-5 md:mt-2 text-[0.8rem] md:text-[0.7rem] text-white tracking-tighter leading-3 md:line-clamp-4">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardComp;