import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import NumberCounter from "./numberCounterprop";

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
      </section>
    </>
  );
};

export default XpSectionComp;
