import React from "react";
import { Outlet,useNavigate } from "react-router-dom";
import NavBarComp from "./components/navBarComponent";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/types";
import {useState ,useEffect} from  "react"
import { useToast } from "@/components/ui/use-toast";
import HeaderComp from"@/components/headerComponent"
import DashInventoryComp from "@/components/dashInventoryComponent";
import { Button } from "@/components/ui/button"; // Import Button component
import LeaderBoards from "@/components/leaderBoardComponent";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import fetchUserById from "@/services/userServices/getUserById";



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

    const { isLoading, isError, data, error } = useQuery({
      queryKey: ["user", userState.userInfo._id],
      queryFn: () =>
        fetchUserById({
          userId: userState?.userInfo?._id, // Replace with actual userId
        }),
    });

  return (
    <div>
      <section className="">
        <div className="mb-[5rem]">
          <header className="w-full  h-fit relative mb-2 md:mb-4  overflow-hidden ">
            <div className={`w-full lg:px-6 px-2 h-[50px] `}></div>
            <nav className="lg:px-6 px-2 absolute top-0 w-full  overflow-hidden ">
              <HeaderComp userState={userState} />
            </nav>
          </header>
          <main className="lg:px-6 px-2 w-full flex gap-8 flex-wrap overflow-hidden">
            
              <Outlet />
            

            <section className="flex flex-col flex-wrap gap-2 items-center">
              {isLoading ? (
                <Skeleton className="lg:min-w-[27vw]  md:w-fit w-full  h-[10rem] rounded-xl" />
              ) : (
                <div className="hidden lg:inline-block">
                  <DashInventoryComp
                    username={data?.userInfo?.username}
                    allPets={data?.userInfo?.pets?.allPets}
                    inventory={data?.userInfo?.inventory}
                    Argentum={data?.userInfo?.profile?.Argentum}
                    Aureus={data?.userInfo?.profile?.Aureus}
                    userId={data?.userInfo?._id}
                  />
                </div>
              )}

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
