import * as React from "react";

import { Progress } from "@/components/ui/progress";
import DeckCardComp from "./deckCardComp";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import DeckCardLoader from "./deckCardLoader";
import { GiRapidshareArrow, GiCardPick } from "react-icons/gi";
import EditButton from "./swapButton";

interface CardInfoProp {
  id: string;
  elements: string[];
  classy: string;
  name: string;
  illustration: string;
  level: number;
  health: number;
  attack: number;
  defense: number;
  decription: string;
  mana: number;
  rarity: string;
  isListed: boolean;
  isSystem: boolean;
}

interface Props {
  secondaryCardInfo: CardInfoProp | null;
  primaryCardInfo: CardInfoProp | null;
}

const CardInpsectDrawer: React.FC<Props> = ({
  secondaryCardInfo,
  primaryCardInfo,
}) => {
  console.log(secondaryCardInfo, primaryCardInfo);

const getRarityBanner = (rarity: string) => {
  switch (rarity) {
    case "Rustic":
      return "rustic-card rustic-text";

    case "Arcane":
      return "arcane-card arcane-text";

    case "Mythic":
      return "mythic-card mythic-text";

    case "Exalted":
      return "exalted-card exalted-text";

    case "Ethereal":
      return "ethereal-card ethereal-text";

    default:
      return "bg-primary";
  }
};
const getRarityText = (rarity: string) => {
  switch (rarity) {
    case "Rustic":
      return " rustic-text";

    case "Arcane":
      return " arcane-text";

    case "Mythic":
      return " mythic-text";

    case "Exalted":
      return " exalted-text";

    case "Ethereal":
      return " ethereal-text";

    default:
      return "bg-primary";
  }
};

const calculateValue = (value:number,maxValue:number) => {
  const calculatedPercent =
        (value / maxValue) * 100;
      if (calculatedPercent > 100) {
        return 100;
      } else {
        return calculatedPercent;
      }
    
}
 
    


   
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="w-[47%] flex items-center gap-2 justify-center text-md capitalize"
        >
          {" "}
          <GiCardPick /> Card Inspect
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-2 justify-center">
              {" "}
              <GiCardPick className="text-2xl" /> Card Inspect
            </DrawerTitle>
            <DrawerDescription className="flex items-center gap-2 justify-center">
              Inspect the details of the selected cards.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex flex-col md:flex-row items-center justify-center space-x-2">
              <section className="flex flex-col items-center  justify-center gap-2 md:hidden">
                <div className="flex flex-col gap-1 justify-center items-center">
                  <span className="text-md w-full text-center">
                    {primaryCardInfo?.name || "No Name"}
                  </span>
                  <div
                    className={`font-bold text-2xl w-[95px] rounded-[0.75rem] p-[0.1rem] ${getRarityBanner(
                      primaryCardInfo?.rarity || "Unknown"
                    )}`}
                  >
                    <div className="bg-muted rounded-[0.75rem]">
                      <p
                        className={`text-muted-foreground rounded-[0.75rem] text-base text-center font-bold ${getRarityText(
                          primaryCardInfo?.rarity || "Unknown"
                        )}`}
                      >
                        {primaryCardInfo?.rarity || "Unknown"}
                      </p>
                    </div>
                  </div>
                </div>
                <span className="pb-2    text-xl  text-emerald-700">
                  <GiRapidshareArrow className="rotate-180" />
                </span>
              </section>
              <div className=" hidden md:flex justify-center flex-col gap-2 items-center">
                <span className="pt-2  text-2xl  text-emerald-700">
                  <GiRapidshareArrow className="rotate-180" />
                </span>
                <section className="">
                  {!primaryCardInfo ? (
                    <DeckCardLoader />
                  ) : (
                    <DeckCardComp
                      id={primaryCardInfo.id}
                      elements={primaryCardInfo.elements}
                      classy={primaryCardInfo.classy}
                      name={primaryCardInfo.name}
                      illustration={primaryCardInfo.illustration}
                      level={primaryCardInfo.level}
                      health={primaryCardInfo.health}
                      attack={primaryCardInfo.attack}
                      defense={primaryCardInfo.defense}
                      mana={primaryCardInfo.mana}
                      rarity={primaryCardInfo.rarity}
                      description={primaryCardInfo.decription} // Adjust this based on your data model
                      isListed={primaryCardInfo.isListed}
                      isSystem={primaryCardInfo.isSystem}
                    />
                  )}
                </section>
              </div>

              <section className="flex-col flex items-center justify-center md:w-[40vw] w-full">
                {/* Att */}
                <div className="flex flex-col items-center justify-center">
                  <h1 className="font-bold text-sm "> ATT</h1>
                  <div className="flex md:w-[40vw] w-[90vw] flex-col items-center justify-center gap-[0.05rem] ">
                    <div className="flex w-full items-center justify-center h-3 ">
                      <span className="px-1 inline  text-muted-foreground max-w-[10%] font-bold text-xs">
                        {primaryCardInfo?.attack || 0}
                      </span>
                      <Progress
                        value={calculateValue(
                          primaryCardInfo?.attack || 0,
                          1500
                        )}
                        className="w-[80%] h-2 md:h-[0.35rem] bg-white backdrop-filter backdrop-blur-lg bg-opacity-10"
                        indicatorColor="bg-emerald-700"
                      />
                    </div>
                    <div className="flex md:w-[40vw] w-[90vw] items-center justify-center  h-3">
                      <span className="px-1 inline  text-muted-foreground max-w-[10%] font-bold text-xs">
                        {secondaryCardInfo?.attack || 0}
                      </span>
                      <Progress
                        value={calculateValue(
                          secondaryCardInfo?.attack || 0,
                          1500
                        )}
                        className="w-[80%] h-2 md:h-[0.35rem] bg-white backdrop-filter backdrop-blur-lg bg-opacity-10"
                        indicatorColor="bg-amber-600"
                      />
                    </div>
                  </div>
                </div>
                {/* def */}
                <div className="flex flex-col items-center justify-center">
                  <h1 className="font-bold text-sm "> DEF</h1>
                  <div className="flex md:w-[40vw] w-[90vw] flex-col items-center justify-center gap-[0.05rem] ">
                    <div className="flex w-full items-center justify-center h-3 ">
                      <span className="px-1 inline  text-muted-foreground max-w-[10%] font-bold text-xs">
                        {primaryCardInfo?.defense || 0}
                      </span>
                      <Progress
                        value={calculateValue(
                          primaryCardInfo?.defense || 0,
                        1300
                        )}
                        className="w-[80%] h-2 md:h-[0.35rem] bg-white backdrop-filter backdrop-blur-lg bg-opacity-10"
                        indicatorColor="bg-emerald-700"
                      />
                    </div>
                    <div className="flex md:w-[40vw] w-[90vw] items-center justify-center  h-3">
                      <span className="px-1 inline  text-muted-foreground max-w-[10%] font-bold text-xs">
                        {secondaryCardInfo?.defense || 0}
                      </span>
                      <Progress
                        value={calculateValue(
                          secondaryCardInfo?.defense || 0,
                          1300
                        )}
                        className="w-[80%] h-2 md:h-[0.35rem] bg-white backdrop-filter backdrop-blur-lg bg-opacity-10"
                        indicatorColor="bg-amber-600"
                      />
                    </div>
                  </div>
                </div>
                {/* hp */}

                <div className="flex flex-col items-center justify-center">
                  <h1 className="font-bold text-sm "> HP</h1>
                  <div className="flex md:w-[40vw] w-[90vw] flex-col items-center justify-center gap-[0.05rem] ">
                    <div className="flex w-full items-center justify-center h-3 ">
                      <span className="px-1 inline  text-muted-foreground max-w-[10%] font-bold text-xs">
                        {primaryCardInfo?.health || 0}
                      </span>
                      <Progress
                        value={calculateValue(
                          primaryCardInfo?.health || 0,
                          2500
                        )}
                        className="w-[80%] h-2 md:h-[0.35rem] bg-white backdrop-filter backdrop-blur-lg bg-opacity-10"
                        indicatorColor="bg-emerald-700"
                      />
                    </div>
                    <div className="flex md:w-[40vw] w-[90vw] items-center justify-center  h-3">
                      <span className="px-1 inline  text-muted-foreground max-w-[10%] font-bold text-xs">
                        {secondaryCardInfo?.health || 0}
                      </span>
                      <Progress
                        value={calculateValue(
                          secondaryCardInfo?.health || 0,
                          2500
                        )}
                        className="w-[80%] h-2 md:h-[0.35rem] bg-white backdrop-filter backdrop-blur-lg bg-opacity-10"
                        indicatorColor="bg-amber-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Mp */}
                <div className="flex flex-col items-center justify-center">
                  <h1 className="font-bold text-sm "> MP</h1>
                  <div className="flex md:w-[40vw] w-[90vw] flex-col items-center justify-center gap-[0.05rem] ">
                    <div className="flex w-full items-center justify-center h-3 ">
                      <span className="px-1 inline  text-muted-foreground max-w-[10%] font-bold text-xs">
                        {primaryCardInfo?.mana || 0}
                      </span>
                      <Progress
                        value={calculateValue(primaryCardInfo?.mana || 0, 200)}
                        className="w-[80%] h-2 md:h-[0.35rem] bg-white backdrop-filter backdrop-blur-lg bg-opacity-10"
                        indicatorColor="bg-emerald-700"
                      />
                    </div>
                    <div className="flex md:w-[40vw] w-[90vw] items-center justify-center  h-3">
                      <span className="px-1 inline  text-muted-foreground max-w-[10%] font-bold text-xs">
                        {secondaryCardInfo?.mana || 0}
                      </span>
                      <Progress
                        value={calculateValue(
                          secondaryCardInfo?.mana || 0,
                          500
                        )}
                        className="w-[80%] h-2 md:h-[0.35rem] bg-white backdrop-filter backdrop-blur-lg bg-opacity-10"
                        indicatorColor="bg-amber-600"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <div className=" hidden md:flex justify-center flex-col gap-2  items-center">
                <span className="pt-2  text-2xl  text-amber-600">
                  <GiRapidshareArrow />
                </span>
                <section className=" ">
                  {!secondaryCardInfo ? (
                    <DeckCardLoader />
                  ) : (
                    <DeckCardComp
                      id={secondaryCardInfo.id}
                      elements={secondaryCardInfo.elements}
                      classy={secondaryCardInfo.classy}
                      name={secondaryCardInfo.name}
                      illustration={secondaryCardInfo.illustration}
                      level={secondaryCardInfo.level}
                      health={secondaryCardInfo.health}
                      attack={secondaryCardInfo.attack}
                      defense={secondaryCardInfo.defense}
                      mana={secondaryCardInfo.mana}
                      rarity={secondaryCardInfo.rarity}
                      description={secondaryCardInfo.description} // Adjust this based on your data model
                      isListed={secondaryCardInfo.isListed}
                      isSystem={secondaryCardInfo.isSystem}
                    />
                  )}
                </section>
              </div>
              <section className="flex flex-col items-center  justify-center gap-2 md:hidden">
                <span className="pt-2  text-xl  text-amber-600">
                  <GiRapidshareArrow />
                </span>
                <div className="flex flex-col gap-1 justify-center items-center">
                  <span className="text-md w-full text-center">
                    {secondaryCardInfo?.name || "No Name"}
                  </span>
                  <div
                    className={`font-bold text-2xl w-[95px] rounded-[0.75rem] p-[0.1rem] ${getRarityBanner(
                      secondaryCardInfo?.rarity || "Unknown"
                    )}`}
                  >
                    <div className="bg-muted rounded-[0.75rem]">
                      <p
                        className={`text-muted-foreground rounded-[0.75rem] text-base text-center font-bold ${getRarityText(
                          secondaryCardInfo?.rarity || "Unknown"
                        )}`}
                      >
                        {secondaryCardInfo?.rarity || "Unknown"}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <EditButton
                primaryCard={primaryCardInfo?.id}
                secondaryCard={secondaryCardInfo?.id}
                width={"w-full"}
              />
            </DrawerClose>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>

            <DrawerClose asChild className="invisible">
              <Button className="invisible" variant="outline">
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CardInpsectDrawer;
