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
import CardComp from "@/components/cardComp"
import BattlePetsCard from "@/components/battlePetsCard";
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
          <UserStatsComponent />
          <XpSectionComp />

          <CardComp />
          <BattlePetsCard />
        </section>
      </section>
    </>
  );
};

export default Dashboard;
