import React from "react";
import { Outlet,useNavigate} from "react-router-dom";
import NavBarComp from "./components/navBarComponent";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/types";
import {useState ,useEffect} from  "react"
import { useToast } from "@/components/ui/use-toast";
import HeaderComp from"@/components/headerComponent"
import DashInventoryComp from "@/components/dashInventoryComponent";
import { Button } from "@/components/ui/button"; // Import Button component
import LeaderBoards from "@/components/leaderBoardComponent";
const Layout: React.FC = () => {
const { toast } = useToast();
  const navigate =useNavigate()
const userState: any | null = useSelector((state: RootState) => state.user);
   const accessTokenState: any | null = useSelector(
     (state: RootState) => state.accessToken
   );
   const refreshTokenState: any | null = useSelector(
     (state: RootState) => state.refreshToken
   );
 useEffect(() => {
   if (
     !userState.userInfo ||
     !refreshTokenState.userRefreshToken
   ) {
     toast({
       variant: "warning",
       description: "user needs to login",
     });
     navigate("/login");
   }
 }, [
   navigate,
   userState.userInfo,
   refreshTokenState.userRefreshToken,
   accessTokenState.userAccessToke,
 ]);

  return (
    <div>
      <section className="">
        <div className="mb-[5rem]">
          <header className="lg:px-6 px-4 ">
            {" "}
            <HeaderComp />
          </header>
          <main className="lg:px-6 px-4 flex gap-8 flex-wrap overflow-hidden">
            <div className="">
              <Outlet />
            </div>

            <section className="flex flex-col gap-2 items-center">
              <div className="hidden lg:inline-block">
                <DashInventoryComp />
              </div>
              <LeaderBoards />
            </section>
          </main>
        </div>
        <NavBarComp
          userState={userState}
          accessTokenState={accessTokenState}
          refreshTokenState={refreshTokenState}
        />
      </section>
    </div>
  );
};

export default Layout;
