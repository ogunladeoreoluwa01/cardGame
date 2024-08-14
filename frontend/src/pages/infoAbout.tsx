import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/types";
import NavBarComp from "@/components/navBarComponent";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button"; // Import Button component
import HeaderComp from "@/components/headerComponent";



const AboutGame: React.FC = () => {

    

    const userState: any | null = useSelector((state: RootState) => state.user);

  return (
    <>
      <section className="">
        <div className="">
          <header
            className={` sticky lg:px-6 px-3 bg-background  w-full py-[0.5px]  top-0 z-50`}
          >
            {" "}
            <HeaderComp userState={userState} />
          </header>
          <main className="px-2  md:px-0   flex   flex-wrap overflow-hidden  ">
           <Outlet/>
          </main>
        </div>
      </section>
    </>
  );
};

export default AboutGame;
