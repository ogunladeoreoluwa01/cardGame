import React from "react";
import {
  useNavigate,
  useParams,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/types";
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import CardComp from "@/components/cardComp";
import { Separator } from "@/components/ui/separator";
import { gold, silver, Badges } from "@/assets";
import getAllUserPetDetails from "@/services/petServices/getAllPetsUser";
import refreshAccessToken from "@/services/authServices/refreshAccessToken";
import { accessTokenAction } from "@/stores/reducers/accessTokenReducer";
import clearAccessToken from "@/stores/actions/accessTokenAction";
import clearRefreshToken from "@/stores/actions/refreshTokenAction";
import logOut from "@/stores/actions/userAction";
import { AppDispatch } from "@/stores";
import { gameSessionAction } from "@/stores/reducers/gameSessionReducer";
import { gameAction } from "@/stores/reducers/gameReducer";
import { liveGameAction } from "@/stores/reducers/liveGameReducer";
import { Input } from "@/components/ui/input";
import NumberCounter from "@/components/numberCounterprop";
import CardLoader from "@/components/loaders/cardLoader";
import { Skeleton } from "@/components/ui/skeleton";
import {
  GiCancel,
  GiTurtleShell,
  GiTigerHead,
  GiFairyWings,
  GiPorcupine,
  GiSmallFire,
  GiDrop,
  GiStonePile,
  GiTornado,
  GiLightningTrio,
  GiIceBolt,
  GiSundial,
  GiMoon,
  GiVineLeaf,
  GiCompass,
  GiMetalBar,
} from "react-icons/gi";
import { IoIosFunnel } from "react-icons/io";
import { ClassCombobox } from "./ClassCombobox";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const petClasses = [
  {
    class: "Guardian",
    label: "Guardian",
    color: "#2E7D32",
    icon: <GiTurtleShell />,
    effect: "Provides exceptional defense and protection for allies.",
  },
  {
    class: "Breaker",
    label: "Breaker",
    color: "#8B4513",
    icon: <GiPorcupine />,
    effect: "Breaks through enemy defenses with powerful attacks.",
  },
  {
    class: "Predator",
    label: "Predator",
    color: "#8B0000",
    icon: <GiTigerHead />,
    effect: "Uses speed and ferocity to overwhelm opponents.",
  },
  {
    class: "Nimble",
    label: "Nimble",
    color: "#AD1457",
    icon: <GiFairyWings />,
    effect: "Dodges attacks and strikes with precision and agility.",
  },
];

const classData: Record<
  string,
  { class: string; color: string; icon: JSX.Element; effect: string }
> = {
  Guardian: {
    class: "Guardian",
    color: "#2E7D32",
    icon: <GiTurtleShell />,
    effect: "Provides exceptional defense and protection for allies.",
  },
  Breaker: {
    class: "Breaker",
    color: "#8B4513",
    icon: <GiPorcupine />,
    effect: "Breaks through enemy defenses with powerful attacks.",
  },
  Predator: {
    class: "Predator",
    color: "#8B0000",
    icon: <GiTigerHead />,
    effect: "Uses speed and ferocity to overwhelm opponents.",
  },
  Nimble: {
    class: "Nimble",
    color: "#AD1457",
    icon: <GiFairyWings />,
    effect: "Dodges attacks and strikes with precision and agility.",
  },
};

const elemArr = [
  { element: "Fire" },
  { element: "Water" },
  { element: "Earth" },
  { element: "Air" },

  { element: "Nature" },
  { element: "Ice" },

  { element: "Light" },
  { element: "Metal" },
  { element: "Shadow" },
  { element: "Lightning" },
];



const elementData: Record<
  string,
  { color: string; icon: JSX.Element; effect: string }
> = {
  Fire: {
    color: "#8B0000",
    icon: <GiSmallFire />,
    effect: "Burns enemies over time with fire damage.",
  },
  Water: {
    color: "#1C86EE",
    icon: <GiDrop />,
    effect: "Cools and calms, providing defensive and healing abilities.",
  },
  Earth: {
    color: "#4B3621",
    icon: <GiStonePile />,
    effect: "Provides stability and defensive strength.",
  },
  Air: {
    color: "#4682B4",
    icon: <GiTornado />,
    effect: "Brings swift and evasive maneuvers, enhancing agility.",
  },
  Lightning: {
    color: "#DAA520",
    icon: <GiLightningTrio />,
    effect: "Electrifies attacks with shocking damage and stunning effects.",
  },
  Nature: {
    color: "#2E8B57",
    icon: <GiVineLeaf />,
    effect: "Harmonizes with surroundings, providing healing and growth.",
  },
  Ice: {
    color: "#008B8B",
    icon: <GiIceBolt />,
    effect: "Freezes enemies and slows their actions.",
  },
  Shadow: {
    color: "#4B0082",
    icon: <GiMoon />,
    effect: "Obscures vision and deals shadowy damage.",
  },
  Light: {
    color: "#B8860B",
    icon: <GiSundial />,
    effect: "Illuminates and heals, providing clarity and purity.",
  },
  Metal: {
    color: "#4F4F4F",
    icon: <GiMetalBar />,
    effect: "Strengthens defenses and enhances durability.",
  },
};


interface FilterProps  {
  handleElementParams: (element: string) => void;
  handleClassParams: (petClass: string) => void;
  handleClearButton: () => void;
}

const InventorySideBar: React.FC<FilterProps> = ({

  
  handleElementParams,
  handleClassParams,
  handleClearButton,
}) => {

    let [searchParams, setSearchParams] = useSearchParams();


    return (
      <>
        <section className=" lg:w-[18vw] md:w-[650px]   w-full h-fit hidden lg:flex flex-wrap flex-col gap-1 p-2 border-[2px] border-gray-400 bg-black backdrop-filter backdrop-blur-lg bg-opacity-10 text-secondary-foreground shadow-sm rounded-lg transition-all duration-300 ease-linear">
          <section className=" flex flex-col flex-wrap w-full gap-2 items-center">
            <h1 className="px-2  font-bold text-left self-start gap-1">
              Elements{" "}
            </h1>
            <section className="flex  flex-row  flex-wrap p-2 gap-[0.15rem]  h-30 ">
              <div
                onClick={() => {
                  handleClearButton();
                }}
                className={`flex  hover:bg-red-700 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg md:hover:bg-opacity-100  scale-[0.94]   w-fit md:hover:scale-100 justify-between h-fit transition-all duration-300 ease-in-out items-center group gap-3 py-[0.35rem] px-3 rounded-sm`}
              >
                <div className="flex gap-3">
                  <div
                    className={`md:h-6 md:w-6 hover:bg-red-700 rotate-[45deg] elementCounts h-6 w-6 text-xl md:text-md flex justify-center items-center backdrop-filter transition-all duration-300 ease-in-out backdrop-blur-lg rounded-sm ${
                      // Replace true with your actual condition
                      true
                        ? "bg-red-500  bg-opacity-90"
                        : "bg-red-500  bg-opacity-10 group-md:hover:bg-opacity-90 group-md:hover:bg-red-700 "
                    }`}
                  >
                    <span className="-rotate-[45deg] text-[1rem]">
                      <GiCancel />
                    </span>
                  </div>
                 
                </div>
              </div>
              {elemArr.map((element, index) => {
                const isActive =
                  searchParams.get("elements") === element.element;
                const backgroundColor = isActive
                  ? elementData[element.element].color
                  : undefined;

                return (
                  <div
                    onClick={() => {
                      handleElementParams(element.element);
                    }}
                    key={index}
                    style={{
                      "--hover-bg-color": elementData[element.element].color,
                      backgroundColor: backgroundColor,
                      order: isActive ? -1 : index, // Set order: active element comes first
                    }}
                    className={`flex bg-white ${
                      isActive ? `scale-[0.94]` : `scale-90`
                    }  md:hover:bg-opacity-100 ${
                      isActive ? "w-full" : "w-fit"
                    }  hover:scale-100 justify-between bg-opacity-10 h-fit transition-all duration-300 ease-in-out items-center group gap-3 py-[0.35rem] px-3 rounded-sm`}
                  >
                    <div className="flex gap-3 ">
                      <div
                        style={{
                          backgroundColor: elementData[element.element].color,
                        }}
                        className={`md:h-6 md:w-6 rotate-[45deg]  h-6 w-6 text-xl md:text-md flex justify-center items-center backdrop-filter transition-all duration-300 ease-in-out backdrop-blur-lg rounded-sm ${
                          isActive
                            ? "bg-primary  bg-opacity-90"
                            : "bg-zinc-400 bg-opacity-10 group-md:hover:bg-opacity-90 group-md:hover:bg-primary"
                        }`}
                      >
                        <span className="-rotate-[45deg] text-[1rem] ">
                          {elementData[element.element].icon}
                        </span>
                      </div>
                      {isActive && (
                        <h1 className="text-md hidden md:inline-block font-bold">
                          {element.element}
                        </h1>
                      )}
                    </div>
                  </div>
                );
              })}
            </section>
            <h1 className="px-2  font-bold text-left self-start gap-1">
              Classes{" "}
            </h1>
            <ClassCombobox />
            
          </section>
        </section>{" "}
        <div className="flex md:hidden left-2 z-20 flex-wrap  gap-3 w-12 h-12 justify-center fixed bottom-14 md:bottom-4  transition-all duration-300 ease-in-out bg-black backdrop-filter backdrop-blur-lg bg-opacity-50 border-[1px]  p-2  items-center rounded-[0.75rem] scale-90 ">
          <Sheet>
            <SheetTrigger asChild>
              <span className="text-2xl text-white hover:scale-110 transition-all duration-300 ease-in-out">
                <IoIosFunnel />
              </span>
            </SheetTrigger>
            <SheetContent className="w-[300px] md:w-[350px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="font-bold mb-2">Elements</SheetTitle>
              </SheetHeader>

              <section className="flex  flex-row  flex-wrap  gap-[0.15rem]  h-30 ">
                <div
                  onClick={() => {
                    handleClearButton();
                  }}
                  className={`flex  hover:bg-red-700 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg md:hover:bg-opacity-100  scale-[0.94]   w-fit md:hover:scale-100 justify-between h-fit transition-all duration-300 ease-in-out items-center group gap-3 py-[0.35rem] px-3 rounded-sm`}
                >
                  <div className="flex gap-3">
                    <div
                      className={`md:h-6 md:w-6 hover:bg-red-700 rotate-[45deg] elementCounts h-6 w-6 text-xl md:text-md flex justify-center items-center backdrop-filter transition-all duration-300 ease-in-out backdrop-blur-lg rounded-sm ${
                        // Replace true with your actual condition
                        true
                          ? "bg-red-500  bg-opacity-90"
                          : "bg-red-500  bg-opacity-10 group-md:hover:bg-opacity-90 group-md:hover:bg-red-700 "
                      }`}
                    >
                      <span className="-rotate-[45deg] text-[1rem]">
                        <GiCancel />
                      </span>
                    </div>
                    {/* <h1 className="text-md   font-bold">
                                Remove Tags
                              </h1> */}
                  </div>
                </div>
                {elemArr.map((element, index) => {
                  const isActive =
                    searchParams.get("elements") === element.element;
                  const backgroundColor = isActive
                    ? elementData[element.element].color
                    : undefined;

                  return (
                    <div
                      onClick={() => {
                        handleElementParams(element.element);
                      }}
                      key={index}
                      style={{
                        "--hover-bg-color": elementData[element.element].color,
                        backgroundColor: backgroundColor,
                        order: isActive ? -1 : index, // Set order: active element comes first
                      }}
                      className={`flex bg-white ${
                        isActive ? `scale-[0.94]` : `scale-90`
                      }  md:hover:bg-opacity-100 ${
                        isActive ? "w-full" : "w-fit"
                      }  hover:scale-100 justify-between bg-opacity-10 h-fit transition-all duration-300 ease-in-out items-center group gap-3 py-[0.35rem] px-3 rounded-sm`}
                    >
                      <div className="flex gap-3 ">
                        <div
                          style={{
                            backgroundColor: elementData[element.element].color,
                          }}
                          className={`md:h-6 md:w-6 rotate-[45deg]  h-6 w-6 text-xl md:text-md flex justify-center items-center backdrop-filter transition-all duration-300 ease-in-out backdrop-blur-lg rounded-sm ${
                            isActive
                              ? "bg-primary  bg-opacity-90"
                              : "bg-zinc-400 bg-opacity-10 group-md:hover:bg-opacity-90 group-md:hover:bg-primary"
                          }`}
                        >
                          <span className="-rotate-[45deg] text-[1rem] ">
                            {elementData[element.element].icon}
                          </span>
                        </div>
                        {isActive && (
                          <h1 className="text-md  font-bold">
                            {element.element}
                          </h1>
                        )}
                      </div>
                    </div>
                  );
                })}
              </section>

             
              <SheetHeader>
                <SheetTitle className="font-bold mt-2 z-[9999]">
                  {" "}
                  Classes
                </SheetTitle>

                <section className="flex mb-2  flex-row    flex-wrap  gap-1">
                  {petClasses.map((petClass, index) => {
                    let isActive = false;
                    if (searchParams.get("class") === petClass.class) {
                      isActive = true;
                    }
                    const backgroundColor =
                      searchParams.get("class") === petClass.class
                        ? classData[petClass.class].color
                        : undefined;

                    return (
                      <div
                        onClick={() => {
                          handleClassParams(petClass.class);
                        }}
                        key={index}
                        style={{
                          "--hover-bg-color": classData[petClass.class].color,
                          backgroundColor: backgroundColor,
                          order: isActive ? -1 : index,
                        }}
                        className={`flex bg-white ${
                          isActive ? `scale-[0.94]` : `scale-90`
                        }  md:hover:bg-opacity-100 ${
                          isActive ? "w-full" : "w-fit"
                        }  hover:scale-100 justify-between bg-opacity-10 h-fit transition-all duration-300 ease-in-out items-center group gap-3 py-[0.35rem] px-3 rounded-sm`}
                      >
                        <div className="flex gap-3 ">
                          <div
                            style={{
                              backgroundColor: classData[petClass.class].color,
                            }}
                            className={`md:h-6 md:w-6 rotate-[45deg]  h-6 w-6 text-xl md:text-md flex justify-center items-center backdrop-filter transition-all duration-300 ease-in-out backdrop-blur-lg rounded-sm ${
                              isActive
                                ? "bg-primary  bg-opacity-90"
                                : "bg-zinc-400 bg-opacity-10 group-md:hover:bg-opacity-90 group-md:hover:bg-primary"
                            }`}
                          >
                            <span className="-rotate-[45deg] text-[1rem] ">
                              {classData[petClass.class].icon}
                            </span>
                          </div>
                          {isActive && (
                            <h1 className="text-md  font-bold">
                              {petClass.class}
                            </h1>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </section>
              </SheetHeader>
              <SheetDescription className="flex flex-col gap-2 py-3"></SheetDescription>
              <SheetFooter></SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </>
    );
};

export default InventorySideBar;
