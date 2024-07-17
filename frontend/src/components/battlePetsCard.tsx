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
  illustration: string;
  name: string;
  rarity: string;
}





const BattlePetsCard: React.FC<Props> = ({
  illustration = "https://i.pinimg.com/originals/92/b8/41/92b841ca44cc515099196aceae3479f9.jpg",
  name = "Shadow Lion",
  rarity = "Mythic",
}) => {

  const [rarityStyle, setRarityStyle] = useState("bg-primary");
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
      className={`card  w-[250px] h-[350px]  p-[0.35rem] relative overflow-hidden  bg-black`}
    >
      <CardContent className={`w-full  h-full  bg-muted p-0 relative ${rarityStyle} rounded-t-[0.5rem] rounded-b-[1.5rem] flex flex-col items-center`}>
        <CardHeader className="py-1 px-2 w-full bg-red-500 rounded-sm border-2 border-white font-serif font-bold capitalize">
          Lorem
        </CardHeader>
        <img
          src={illustration}
          alt={name}
          fetchPriority="auto"
          loading="lazy"
          className="w-[98%] mt-1 border-white  h-[150px] object-cover  text-center  border-2 "
        />
        <CardHeader className="py-0 mt-1 px-2 w-full bg-red-500 rounded-full border-2 border-white font-serif font-medium capitalize">
          Lorem
        </CardHeader>
        <div
          
          className="w-[98%] my-1 h-[120px] object-cover  text-center border-2 border-white bg-white "
        >
        </div>
      </CardContent>
    </Card>
  );
};

export default BattlePetsCard;
