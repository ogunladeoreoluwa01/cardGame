import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/types";
import {AppDispatch} from "@/stores"
import { useToast } from "@/components/ui/use-toast";
import UserStatsComponent from "@/components/userStatsComponent";
import XpSectionComp from "@/components/xpSectionComp";
import DashInventoryComp from "@/components/dashInventoryComponent";
import { Button } from "@/components/ui/button"; // Import Button component
import LeaderBoards from "@/components/leaderBoardComponent";



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
      <section className="flex flex-wrap  ">
        {/* main */}
        <section className="flex flex-col lg:gap-5 md:gap-3 gap-2 ">
          <UserStatsComponent
            profileImage={userState.userInfo?.profile?.avatar}
            secondaryImage={userState.userInfo?.profile?.coverImage}
            userFullName={userState.userInfo?.profile?.fullName}
            handle={userState.userInfo?.username}
            duelsLost={userState.userInfo?.userStats?.duelsLost}
            duelsWon={userState.userInfo?.userStats?.duelsWon}
            bio={userState.userInfo?.profile?.bio}
          />
          <XpSectionComp
            xpNeededToNextLevel={
              userState?.userInfo?.profile?.xpNeededToNextLevel
            }
            experience={userState?.userInfo?.profile?.experience}
            level={userState?.userInfo?.profile?.level}

          />
        </section>
      </section>
    </>
  );
};

export default Dashboard;
