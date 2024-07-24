import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"; // Import Button component
import NumberCounter from "./numberCounterprop";
import DashInventoryComp from "@/components/dashInventoryComponent";


interface UserStatsProps {
  profileImage: string | null;
  secondaryImage: string | null;
  userFullName: string | null;
  handle: string | null;
  duelsLost: number ;
  duelsWon: number ;
  bio: string | null;
}

const UserStatsComp: React.FC<UserStatsProps> = ({
  profileImage = "https://i.pinimg.com/originals/fe/d7/eb/fed7eb3859b2970331de5574fc3ec6c0.jpg",
  secondaryImage = "https://i.pinimg.com/originals/21/6b/f1/216bf168f17efdf1fea5e9cd99150b99.gif",
  userFullName = "Edward Evans",
  handle = "evans99",
  duelsLost = 100,
  duelsWon = 200,
  bio = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam. ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
}) => {
  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const [duelIndex, setDuelIndex] = useState(0);
  const [numOfDuels, setNumOfDuels] = useState(0);

  useEffect(() => {
    // Calculate duelIndex as percentage
    if (duelsLost !== 0) {
      const calculatedDuelIndex = (duelsWon / duelsLost) * 0.4;
      setDuelIndex(calculatedDuelIndex);
    } else {
      // Handle case where duelsLost is 0 to prevent division by zero
      setDuelIndex(duelsWon === 0 ? 0 : 100); // If duelsWon is 0 and duelsLost is 0, duelIndex should logically be 0
    }

    // Calculate total number of duels
    setNumOfDuels(duelsWon + duelsLost);
  }, [duelsLost, duelsWon]);

  const toggleBio = () => {
    setIsBioExpanded(!isBioExpanded);
  };

  const bioThreshold = 150; // Set a threshold for the bio text length

 
  

  return (
    <section className="flex flex-col gap-2 flex-wrap">
      <section className="flex gap-2 flex-wrap">
        <section className="lg:w-[50vw] w-full lg:h-[14rem] p-[0.2rem] h-[10rem] rounded-[0.75rem] bg-primary">
          <img
            src={secondaryImage}
            alt="User Avatar"
            className="object-center object-cover w-full h-full rounded-[0.75rem]"
            fetchpriority="high"
            loading="lazy"
          />
        </section>

        <section className="flex flex-row md:w-full px-3 lg:px-0 sm:w-0 lg:w-0 lg:flex-col gap-2 justify-center">
          <section className="w-[10rem]  lg:w-[10rem] lg:h-[10rem] p-1 h-[10rem] rounded-[0.75rem] bg-primary">
            <img
              src={profileImage}
              alt="User Avatar"
              className="object-center object-cover w-full h-full rounded-[0.75rem]"
              fetchpriority="high"
              loading="lazy"
            />
          </section>
          <div className="lg:hidden hidden md:inline-block ">
            <DashInventoryComp />
          </div>

          <section className="w-[10rem] md:w-[25vw] lg:w-[10rem] lg:h-[3.5rem] h-[10rem] p-2 flex flex-col justify-start rounded-[0.75rem] bg-muted">
            <h1 className="font-bold text-ellipsis overflow-hidden w-full h-[24px]">
              {userFullName}
            </h1>
            <p className="text-sm text-muted-foreground text-ellipsis overflow-hidden w-full h-[24px]">
              {handle}
            </p>
            <span className="mt-2 lg:hidden inline-block w-full h-[0.2px] rounded-lg bg-foreground"></span>
            <div className="mt-3 lg:hidden inline-block">
              <h1 className="font-bold normal-nums flex items-center justify-between text-ellipsis overflow-hidden w-full h-[24px]">
                {duelIndex}{" "}
                <p className="text-sm font-light text-muted-foreground">
                  Duel Index
                </p>
              </h1>

              <h1 className="font-bold normal-nums items-center flex justify-between text-ellipsis overflow-hidden w-full h-[24px]">
                <NumberCounter number={numOfDuels} />{" "}
                <p className="text-sm font-light text-muted-foreground">
                  No of Duels
                </p>
              </h1>
              <h1 className="font-bold normal-nums items-center flex justify-between text-ellipsis overflow-hidden w-full h-[24px]">
                <NumberCounter number={duelsWon} />{" "}
                <p className="text-sm font-light text-muted-foreground">
                  Duels Won
                </p>
              </h1>
            </div>
          </section>
        </section>
      </section>
      <section className="flex gap-1">
        <section className="lg:w-[50vw] w-full h-auto p-3 rounded-[0.75rem] bg-muted">
          <h1 className="font-bold normal-nums flex justify-between text-ellipsis overflow-hidden w-full h-[24px]">
            Bio
          </h1>
          <p
            className={`text-sm leading-[1rem] font-light text-muted-foreground transition-all duration-300 ${
              !isBioExpanded ? "line-clamp-3" : ""
            }`}
          >
            {bio}
          </p>
          {bio.length > bioThreshold && (
            <Button
              variant="outline"
              onClick={toggleBio}
              size="sm"
              className=" text-sm mt-2"
            >
              {isBioExpanded ? "See Less" : "See More"}
            </Button>
          )}
        </section>
        <section className="lg:flex flex-col gap-2 hidden">
          <section className="w-[10rem] bg-muted rounded-[0.75rem] p-2 h-[2.5rem]">
            <h1 className="font-bold normal-nums flex items-center justify-between text-ellipsis overflow-hidden w-full h-[24px]">
              {duelIndex}{" "}
              <p className="text-sm font-light text-muted-foreground">
                Duel Index
              </p>
            </h1>
          </section>
          <section className="w-[10rem] bg-muted rounded-[0.75rem] p-2 h-[2.5rem]">
            <h1 className="font-bold normal-nums flex items-center justify-between text-ellipsis overflow-hidden w-full h-[24px]">
              <NumberCounter number={numOfDuels} />{" "}
              <p className="text-sm font-light text-muted-foreground">
                No of Duels
              </p>
            </h1>
          </section>
          <section className="w-[10rem] bg-muted rounded-[0.75rem] p-2 h-[2.5rem]">
            <h1 className="font-bold normal-nums flex items-center justify-between text-ellipsis overflow-hidden w-full h-[24px]">
              <NumberCounter number={duelsWon} />{" "}
              <p className="text-sm font-light text-muted-foreground">
                Duels Won
              </p>
            </h1>
          </section>
        </section>
      </section>
    </section>
  );
};

export default UserStatsComp;
