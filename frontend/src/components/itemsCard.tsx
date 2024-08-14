import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { GiUpgrade, GiFlatPawPrint, GiMonsterGrasp } from "react-icons/gi";
import { FaBoxOpen } from "react-icons/fa";

interface Props {
  type: string;
  illustration: string;
  description: string;
  name: string;
  effectType: string;
}

const typeData: Record<
  string,
  { color: string; icon: JSX.Element; effect: string }
> = {
  pet: {
    color: "#8B0000",
    icon: <GiFlatPawPrint />,
    effect: "Potions that enhance a user's pet's abilities.",
  },
  account: {
    color: "#B8860B",
    icon: <GiUpgrade />,
    effect: "Potions that provide boosts to the user.",
  },
  lootbox: {
    color: "#4B0082",
    icon: <FaBoxOpen />,
    effect: "Random items that can provide various benefits.",
  },
};

const ItemCardComp: React.FC<Props> = ({
  type = "pet",
  illustration = "https://cdna.artstation.com/p/assets/images/images/027/573/114/large/leo-cooper-roze.jpg?1591908001",
  description = "Random items that can provide various benefits.",
  name = "level",
  effectType = "tier4",
}) => {
  const [effectTypeStyle, setEffectTypeStyle] = useState("bg-primary");
  const [effectStyle, setEffectStyle] = useState<{
    color: string;
    icon: JSX.Element | null;
    effect: string;
  }>({
    color: "#4CAF50",
    icon: null,
    effect: "",
  });

  useEffect(() => {
    switch (effectType) {
      case "tier1":
        setEffectTypeStyle("rustic-card");
        break;
      case "tier2":
        setEffectTypeStyle("arcane-card");
        break;
      case "tier3":
        setEffectTypeStyle("mythic-card");
        break;
      case "tier4":
        setEffectTypeStyle("exalted-card");
        break;
      case "tier5":
        setEffectTypeStyle("ethereal-card");
        break;
      default:
        setEffectTypeStyle("bg-primary");
        break;
    }
  }, [effectType]);

  useEffect(() => {
    if (typeData[type]) {
      setEffectStyle(typeData[type]);
    }
  }, [type]);

  return (
    <Card
      className={`card saturate-150 w-[170px] h-[275px]   md:w-[200px]  md:h-[300px]     p-[0.22rem] relative overflow-hidden ${effectTypeStyle} font-mono`}
    >
      <CardContent
        className={`w-full mx-auto h-full bg-muted p-0 relative bg-black cardBg rounded-t-[0.5rem] rounded-b-[1.5rem] flex flex-col items-center`}
      >
        <div
          className={`w-[2.15rem]  h-[1.35rem] flex   p-[0.21rem]   justify-center items-center absolute -top-1 -right-[3px]   z-30  ${effectTypeStyle} rounded-full`}
        >
          <h1 className="w-full h-full cardBg rounded-full text-sm  flex text-white   justify-center items-center ">
            2
          </h1>
        </div>
        <h1 className="absolute top-5 md:top-4 left-1/2 line-clamp-1 text-sm text-md  -translate-x-1/2 text-white z-20  px-2 py-1 w-[98%] text-center h-8">
          {name}
        </h1>
        <div className="w-full h-[185px]  md:h-[210px] bg-black rounded-t-[0.5rem] relative">
          <img
            src={illustration}
            alt={name}
            fetchpriority="auto"
            loading="lazy"
            className="w-full h-full object-center text-center rounded-t-[0.5rem] opacity-50"
          />
          <div className="bottom-2 left-2 text-white absolute flex justify-center items-center gap-2">
            <div
              style={{ backgroundColor: effectStyle.color }}
              className=" w-[1.85rem] rotate-[45deg]  h-[1.85rem]  p-1 flex items-center  text-white justify-center rounded-sm text-xl border-white border-[1px]"
            >
              <span className="-rotate-[45deg] text-[0.9rem]">
                {effectStyle.icon}
              </span>
            </div>
          </div>
        </div>
        <div className="w-full rounded-b-[0.5rem] relative p-2 h-[80px] object-cover border-white border-t-2 cardBg">
          <p className="  mt-2   text-[0.7rem] text-white tracking-tighter leading-3  line-clamp-4">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemCardComp;
