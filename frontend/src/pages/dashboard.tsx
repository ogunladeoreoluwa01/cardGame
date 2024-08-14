import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/types";
import { AppDispatch } from "@/stores";
import { useToast } from "@/components/ui/use-toast";
import UserStatsComponent from "@/components/dashBoard/userStatsComponent";
import XpSectionComp from "@/components/dashBoard/xpSectionComp";
import CardComp from "@/components/cardComp";
import { useQuery } from "@tanstack/react-query";
import fetchUserById from "@/services/userServices/getUserById";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const userState: any | null = useSelector((state: RootState) => state.user);
  const accessTokenState: any | null = useSelector(
    (state: RootState) => state.accessToken
  );
  const refreshTokenState: any | null = useSelector(
    (state: RootState) => state.refreshToken
  );

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["user", userState.userInfo._id],
    queryFn: () =>
      fetchUserById({
        userId: userState?.userInfo?._id, // Replace with actual userId
      }),
  });

  if (isError) {
    toast({
      variant: "destructive",
      description: "error",
    });
  }

  console.log(data);

  useEffect(() => {
    if (!userState.userInfo || !refreshTokenState.userRefreshToken) {
      toast({
        variant: "warning",
        description: "User needs to login",
      });
      navigate("/login");
    }
  }, [
    navigate,
    userState.userInfo,
    refreshTokenState.userRefreshToken,
    accessTokenState.userAccessToken,
  ]);

  return (
    <>
      {isError ? (
        <p>sumthin aint right </p>
      ) : (
        <section className="flex flex-wrap  ">
          {/* main */}

          <section className="flex flex-col lg:gap-5 md:gap-3 gap-2 ">
            {isLoading ? (
              <Skeleton className="w-[92vw] md:w-[60vw]  h-[20rem] rounded-xl" />
            ) : (
              <div>
                <UserStatsComponent user={data} />
                <XpSectionComp
                  xpNeededToNextLevel={
                    data?.userInfo?.profile?.xpNeededToNextLevel
                  }
                  experience={data?.userInfo?.profile?.experience}
                  level={data?.userInfo?.profile?.level}
                />
                <section className="mt-4 lg:w-[60vw] w-full md:w-[650px] md:mx-auto  flex flex-col gap-2 ">
                  <p className=" text-md font-bold space-y-2    inline-block ">
                    Current Deck
                  </p>
                  <div className="lg:w-[63vw] mx-auto w-full md:w-[650px]  flex flex-wrap   justify-center md:justify-start items-center gap-2 md:gap-4">
                    {data?.userInfo?.pets?.currentDeck.map((card, index) => (
                      <CardComp
                        key={index}
                        id={card._id}
                        elements={card.petInfo.element}
                        classy={card.petInfo.class}
                        name={card.petInfo.name}
                        illustration={card.petInfo.illustration}
                        level={card.level}
                        health={card.currentHealth}
                        attack={card.currentAttack}
                        defence={card.currentDefense}
                        mana={card.currentManaCost}
                        rarity={card.rarity}
                        description={card.petInfo.description}
                        isListed={card.isListed}
                        isSystem={card.isSystemOwned}
                      />
                    ))}
                  </div>
                </section>
              </div>
            )}
          </section>
        </section>
      )}
    </>
  );
};

export default Dashboard;
