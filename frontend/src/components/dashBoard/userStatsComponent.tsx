import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"; // Import Button component
import NumberCounter from "@/components/numberCounterprop";
import DashInventoryComp from "@/components/dashInventoryComponent";
import { Badges } from "@/assets";
import { IUser } from "@/types";



interface UserStatsProps {
  user: IUser;
}

const UserStatsComp: React.FC<UserStatsProps> = ({
  user,
}) => {
  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const [duelIndex, setDuelIndex] = useState(0);
  const [numOfDuels, setNumOfDuels] = useState(0);

  useEffect(() => {
    // Calculate duelIndex as percentage
    if ( user.userInfo?.userStats?.duelsLost !== 0) {
      const calculatedDuelIndex =
        ( user.userInfo?.userStats?.duelsWon /
           user.userInfo?.userStats?.duelsLost) *
        0.4;
      setDuelIndex(calculatedDuelIndex);
    } else {
      // Handle case where duelsLost is 0 to prevent division by zero
      setDuelIndex( user.userInfo?.userStats?.duelsWon === 0 ? 0 : 100); // If duelsWon is 0 and duelsLost is 0, duelIndex should logically be 0
    }

    // Calculate total number of duels
    setNumOfDuels(
       user.userInfo?.userStats?.duelsWon +
         user.userInfo?.userStats?.duelsLost
    );
  }, [ user.userInfo?.userStats?.duelsWon,  user.userInfo?.userStats?.duelsLost]);

  const toggleBio = () => {
    setIsBioExpanded(!isBioExpanded);
  };

  const bioThreshold = 150; // Set a threshold for the bio text length

 
  

  return (
    <section className="flex flex-col gap-2 flex-wrap">
      <section className="flex gap-2 flex-wrap">
        <section className="lg:w-[50vw] w-full lg:h-[14rem] p-[0.2rem] h-[10rem] rounded-[0.75rem] bg-primary">
          <img
            src={user.userInfo?.profile?.coverImage}
            alt="User Avatar"
            className="object-center object-cover w-full h-full rounded-[0.75rem]"
            fetchPriority="high"
            loading="lazy"
          />
        </section>

        <section className="flex flex-row md:w-full md:px-3 lg:px-0 sm:w-0 lg:w-0 lg:flex-col w-full gap-2 justify-between md:justify-center">
          <section className="w-[50vw]  lg:w-[10rem] lg:h-[10rem] p-[0.2rem] h-[10rem] rounded-[0.75rem] bg-primary">
            <img
              src={user.userInfo?.profile?.avatar}
              alt="User Avatar"
              className="object-center object-cover w-full h-full rounded-[0.75rem]"
              fetchPriority="high"
              loading="lazy"
            />
          </section>
          <div className="lg:hidden hidden md:inline-block ">
            <DashInventoryComp
              username={user?.userInfo?.username}
              allPets={user?.userInfo?.pets?.allPets}
              inventory={user?.userInfo?.inventory}
              Argentum={user?.userInfo?.profile?.Argentum}
              Aureus={user?.userInfo?.profile?.Aureus}
            />
          </div>

          <section className="w-[43vw] md:w-[25vw] lg:w-[10rem] lg:h-[3.5rem] h-[10rem] p-2 flex flex-col justify-start rounded-[0.75rem] bg-muted">
            <section className=" flex justify-between items-center ">
              <div className="flex flex-col">
                <h1 className="font-bold text-ellipsis overflow-hidden  w-[5rem] h-fit ">
                  {user.userInfo?.profile?.fullName}
                </h1>
                <p className="text-sm text-muted-foreground text-ellipsis   w-[5rem] overflow-hidden  h-fit ">
                  {user.userInfo?.username}
                </p>
              </div>

              <img
                src={Badges[user.userInfo.playerRank]}
                alt={user.userInfo.username}
                className="w-10 h-10 object-center object-cover rounded-sm"
                fetchPriority="high"
                loading="lazy"
              />
            </section>

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
                <NumberCounter number={user.userInfo?.userStats?.duelsLost} />{" "}
                <p className="text-sm font-light text-muted-foreground">
                  Duels Won
                </p>
              </h1>
            </div>
          </section>
        </section>
      </section>
      <section className="flex items-start   flex-wrap w-full gap-2 transition-all duration-300">
        <section className="lg:w-[50vw] min-h-[8.5rem] w-full md:h-auto p-3 rounded-[0.75rem] bg-muted transition-all duration-300">
          <h1 className="font-bold normal-nums flex justify-between text-ellipsis overflow-hidden w-full h-[24px]">
            Bio
          </h1>
          <p
            className={`text-sm leading-[1rem] font-light text-muted-foreground transition-all duration-300 ${
              !isBioExpanded ? "line-clamp-3" : ""
            }`}
          >
            {user.userInfo?.profile?.bio}
          </p>
          {user.userInfo?.profile?.bio.length > bioThreshold && (
            <Button onClick={toggleBio} size="sm" className=" text-sm mt-2">
              {isBioExpanded ? "See Less" : "See More"}
            </Button>
          )}
        </section>
        <div className="lg:hidden inline-block md:hidden w-full">
          <DashInventoryComp
            username={user?.userInfo?.username}
            allPets={user?.userInfo?.pets?.allPets}
            inventory={user?.userInfo?.inventory}
            Argentum={user?.userInfo?.profile?.Argentum}
            Aureus={user?.userInfo?.profile?.Aureus}
          />
        </div>
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
              <NumberCounter number={user.userInfo?.userStats?.duelsWon} />{" "}
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
