import React, { useState, useEffect } from "react";
import NumberCounter from "@/components/numberCounterprop";
import { Progress } from "@/components/ui/progress";




interface UserXpProp {
  xpNeededToNextLevel: number;
  experience: number ;
  level: number ;

}

const 
XpSectionComp: React.FC<UserXpProp> = ({
  xpNeededToNextLevel,
  experience,
  level,
}) => {
  const [percent, setPercent] = useState(0);
;

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
      <section>
        <section className="lg:w-[63vw]  w-full flex gap-2 items-center my-2">
          <p className=" text-xs w-fit bg-muted  max-w-[3.3rem] px-1  normal-nums  text-muted-foreground inline-block rounded-[0.35rem]">
            lvl.
            <NumberCounter number={level} />
          </p>
          <Progress value={percent} className="lg:w-[98%] md:w-[93%] w-[90%]" />
        </section>
      </section>
    </>
  );
};

export default XpSectionComp;
