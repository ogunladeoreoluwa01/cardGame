import React from "react";
import {
  useNavigate,
  useParams,
  useSearchParams,
  useLocation,
  Outlet,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/types";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { gold, silver, Badges } from "@/assets"; // Import Button component
import NavBarComp from "@/components/navBarComponent";
import HeaderComp from "@/components/headerComponent";
import NumberCounter from "@/components/numberCounterprop";
import { useQuery } from "@tanstack/react-query";
import fetchUserById from "@/services/userServices/getUserById";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Skeleton } from "@/components/ui/skeleton";
import {
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

const ItemMarketPage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isPet, setIsPet] = useState(false);
  const [isItem, setIsItem] = useState(false);
  const [isDeck, setIsDeck] = useState(false);
  const [isUser, setIsUser] = useState(false);
  let [searchParams, setSearchParams] = useSearchParams();
  const [element, setElement] = useState<string[] | null>(null);
  const [petClass, setPetClass] = useState<string | null>(null);

  useEffect(() => {
    const elementParam = searchParams.get("elements");
    const classParam = searchParams.get("class");
    if (elementParam) {
      setElement([elementParam.toString()]);
      console.log([elementParam.toString()]);
    } else {
      setElement(null);
    }

    if (classParam) {
      setPetClass(classParam.toString());
      console.log(classParam.toString());
    } else {
      setPetClass(null);
    }
  }, [searchParams]);

  useEffect(() => {
    const pathSegments = location.pathname.split("/");
    const lastSegment = pathSegments[pathSegments.length - 1];
    if (lastSegment === "pet") {
      setIsPet(true);
      setIsItem(false);
      setIsDeck(false);
    } else if (lastSegment === "item") {
      setIsPet(false);
      setIsItem(true);
      setIsDeck(false);
    } else if (lastSegment === "deck") {
      setIsPet(false);
      setIsItem(false);
      setIsDeck(true);
    }
  }, [location.pathname]);

  const { userId } = useParams();
  const userState: any | null = useSelector((state: RootState) => state.user);
  const accessTokenState: any | null = useSelector(
    (state: RootState) => state.accessToken
  );
  const refreshTokenState: any | null = useSelector(
    (state: RootState) => state.refreshToken
  );

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["user", userId],
    queryFn: () =>
      fetchUserById({
        userId: userId,
      }),
  });

  useEffect(() => {
    if (userState.userInfo._id === userId) {
      setIsUser(true);
    }
  }, [userState.userInfo._id, userId]);

  useEffect(() => {
    if (!userState.userInfo || !refreshTokenState.userRefreshToken) {
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
    <>
      <div className="h-screen inventoryBg overflow-none">
        <header className="w-full  h-fit relative  backdrop-blur-sm overflow-hidden ">
          <div className="w-full lg:px-6 px-4  h-[50px] bg-accent-foreground backdrop-filter backdrop-blur-md blur-sm opacity-[0.02] bg-opacity-10"></div>
          <nav className="lg:px-6 px-4 absolute top-0 w-full backdrop-blur-sm overflow-hidden ">
            <HeaderComp userState={userState} />
          </nav>
          <nav className=" px-3  flex justify-between items-center border-b  py-2 bg-white backdrop-filter backdrop-blur-lg bg-opacity-20 ">
            <ul className="flex md:gap-1 gap-3  items-center">
              <li
                onClick={() => {
                  navigate(`/inventory/${userId}/pet`);
                }}
                className="flex cursor-pointer md:min-w-16 w-fit hover:scale-105 gap-1 group font-md items-center"
              >
                {" "}
                <div
                  className={`md:h-2 md:w-2 h-2 w-2  rotate-[45deg] text-xl md:text-md  flex justify-center items-center backdrop-filter transition-all duration-300 ease-in-out backdrop-blur-lg rounded-[2px] ${
                    isPet
                      ? "bg-primary border-[1.7px] border-white bg-opacity-90"
                      : "bg-zinc-400 bg-opacity-10 group-hover:bg-opacity-90 group-hover:bg-primary"
                  }`}
                >
                  {/*    */}
                </div>
                <span
                  className={`transition-all duration-300 ease-in-out ${
                    isPet
                      ? "text-white font-semibold"
                      : "text-muted-foreground hover:text-white"
                  }`}
                >
                  Pets
                </span>
              </li>
              {false && (
                <li
                  onClick={() => {
                    navigate(`/inventory/${userId}/item`);
                  }}
                  className="flex cursor-pointer md:min-w-16 w-fit hover:scale-105 gap-1 group font-md items-center"
                >
                  {" "}
                  <div
                    className={`md:h-2 md:w-2 h-2 w-2  rotate-[45deg] text-xl md:text-md  flex justify-center items-center backdrop-filter transition-all duration-300 ease-in-out backdrop-blur-lg rounded-[2px] ${
                      isItem
                        ? "bg-primary border-[1.7px] border-white bg-opacity-90"
                        : "bg-zinc-400 bg-opacity-10 group-hover:bg-opacity-90 group-hover:bg-primary"
                    }`}
                  >
                    {/*    */}
                  </div>
                  <span
                    className={`transition-all duration-300 ease-in-out ${
                      isItem
                        ? "text-white font-semibold"
                        : "text-muted-foreground hover:text-white"
                    }`}
                  >
                    Items
                  </span>
                </li>
              )}

              {isUser && (
                <li
                  onClick={() => {
                    navigate(`/inventory/${userId}/deck`);
                  }}
                  className="flex cursor-pointer md:min-w-16 w-fit hover:scale-105 gap-1 group font-md items-center"
                >
                  {" "}
                  <div
                    className={`md:h-2 md:w-2 h-2 w-2  rotate-[45deg] text-xl md:text-md  flex justify-center items-center backdrop-filter transition-all duration-300 ease-in-out backdrop-blur-lg rounded-[2px] ${
                      isDeck
                        ? "bg-primary border-[1.7px] border-white bg-opacity-90"
                        : "bg-zinc-400 bg-opacity-10 group-hover:bg-opacity-90 group-hover:bg-primary"
                    }`}
                  >
                    {/*    */}
                  </div>
                  <span
                    className={`transition-all duration-300 ease-in-out ${
                      isDeck
                        ? "text-white font-semibold"
                        : "text-muted-foreground hover:text-white"
                    }`}
                  >
                    Deck
                  </span>
                </li>
              )}
            </ul>

            {userState.userInfo._id.toString() === userId.toString() && (
              <ul className="flex gap-2 items-center">
                <li>
                  <div className="flex   justify-center items-center gap-1 min-w-10">
                    <img
                      src={gold}
                      alt=""
                      className="w-[1.2rem] h-[1.2rem] rounded-full "
                      fetchpriority="high"
                      loading="lazy"
                    />
                    {isLoading ? (
                      <>
                        <div className="spinner center">
                          <div className="spinner-blade"></div>
                          <div className="spinner-blade"></div>
                          <div className="spinner-blade"></div>
                          <div className="spinner-blade"></div>
                          <div className="spinner-blade"></div>
                          <div className="spinner-blade"></div>
                          <div className="spinner-blade"></div>
                          <div className="spinner-blade"></div>
                          <div className="spinner-blade"></div>
                          <div className="spinner-blade"></div>
                          <div className="spinner-blade"></div>
                          <div className="spinner-blade"></div>
                        </div>
                      </>
                    ) : (
                      <p className=" uppercase text-sm text-center font-bold">
                        {" "}
                        <NumberCounter
                          number={data?.userInfo?.profile?.Aureus}
                        />
                      </p>
                    )}
                  </div>
                </li>
                <li>
                  <div className="flex   justify-center items-center gap-1 min-w-10">
                    <img
                      src={silver}
                      alt=""
                      className="w-[1.2rem] h-[1.2rem] rounded-full "
                      fetchPriority="high"
                      loading="lazy"
                    />
                    {isLoading ? (
                      <>
                        <div className="spinner center">
                          <div className="spinner-blade"></div>
                          <div className="spinner-blade"></div>
                          <div className="spinner-blade"></div>
                          <div className="spinner-blade"></div>
                          <div className="spinner-blade"></div>
                          <div className="spinner-blade"></div>
                          <div className="spinner-blade"></div>
                          <div className="spinner-blade"></div>
                          <div className="spinner-blade"></div>
                          <div className="spinner-blade"></div>
                          <div className="spinner-blade"></div>
                          <div className="spinner-blade"></div>
                        </div>
                      </>
                    ) : (
                      <p className=" uppercase text-sm text-center font-bold">
                        {" "}
                        <NumberCounter
                          number={data?.userInfo?.profile?.Argentum}
                        />
                      </p>
                    )}
                  </div>
                </li>
              </ul>
            )}
          </nav>
        </header>

        <main className="  ">
          {!isLoading ? (
            <section className="md:mx-16 mx-2 my-1 flex justify-between items-center gap-3 px-3">
              <span className="text-lg text-mute-forground font-bold">
                {data?.userInfo?.username}'s inventory{" "}
              </span>

              <span className="flex items-center gap-3">
                {element &&
                  element.map((el, index) => (
                    <div
                      key={index}
                      style={{ backgroundColor: elementData[el].color }}
                      className="w-7 h-7 p-1 flex items-center justify-center rounded-sm rotate-[45deg] text-xl border-white border-[1px]"
                    >
                      <span className="-rotate-[45deg] text-[0.9rem]">
                        {elementData[el].icon}
                      </span>
                    </div>
                  ))}

                {petClass && (
                  <div
                    style={{ backgroundColor: classData[petClass].color }}
                    className="w-7 h-7 p-1 rotate-[45deg] flex items-center justify-center text-white rounded-sm border-[1px] border-white"
                  >
                    <span className="-rotate-[45deg] text-[0.9rem]">
                      {classData[petClass].icon}
                    </span>
                  </div>
                )}

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <img
                        src={Badges[data.userInfo.playerRank]}
                        alt={data.userInfo.username}
                        className="w-10 h-10 object-center object-cover rounded-sm"
                        fetchpriority="high"
                        loading="lazy"
                      />
                    </TooltipTrigger>
                    <TooltipContent className="py-1 rounded-sm ">
                      {data.userInfo.playerRank}{" "}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </span>
            </section>
          ) : (
            <div className="md:mx-16 mx-2  my-1 flex items-center justify-between space-x-4">
              <div className="space-y-1">
                <Skeleton className="h-4 w-[150px] bg-muted" />
                <Skeleton className="h-4 w-[200px] bg-muted" />
              </div>
              <Skeleton className="h-10 w-10 rounded-sm bg-muted" />
            </div>
          )}

          <Outlet />
        </main>

        <NavBarComp
          accessTokenState={accessTokenState}
          refreshTokenState={refreshTokenState}
          userState={userState}
        />
      </div>
    </>
  );
};

export default ItemMarketPage;
