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

import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import CardComp from "@/components/cardComp";

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
import NumberCounter from "@/components/numberCounterprop";
import CardLoader from "@/components/loaders/cardLoader";
import { Skeleton } from "@/components/ui/skeleton";
import {
  GiTurtleShell,
  GiTigerHead,
  GiCancel,
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

const PetInventoryPage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch: AppDispatch = useDispatch();
  const { userId } = useParams();

  let [searchParams, setSearchParams] = useSearchParams();
  const [element, setElement] = useState<string[] | null>(null);
  const [petClass, setPetClass] = useState<string | null>(null);

  const userState: any | null = useSelector((state: RootState) => state.user);
  const accessTokenState: any | null = useSelector(
    (state: RootState) => state.accessToken
  );
  const refreshTokenState: any | null = useSelector(
    (state: RootState) => state.refreshToken
  );

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

  const refresh = useCallback(async () => {
    toast({
      variant: "warning",
      description: "Refreshing access token",
    });

    try {
      const response = await refreshAccessToken({
        refreshToken: refreshTokenState.userRefreshToken,
      });
      dispatch(accessTokenAction.setUserAccessToken(response.accessToken));
      return response.accessToken;
    } catch (err: any) {
      toast({
        variant: "destructive",
        description: err.errorMessage,
      });

      if (err.errorCode === 403) {
        dispatch(clearAccessToken());
        dispatch(clearRefreshToken());
        dispatch(logOut());
        localStorage.removeItem("account");
        localStorage.removeItem("refreshToken");
        dispatch(liveGameAction.resetLiveGameState());
        localStorage.removeItem("game");
        dispatch(gameAction.resetGameState());
        localStorage.removeItem("liveGame");
        dispatch(gameSessionAction.clearSessionId());
        localStorage.removeItem("gameSession");
        toast({
          variant: "warning",
          description: "User logged out",
        });
        navigate("/login");
      }
    }
  }, [dispatch, navigate, refreshTokenState.userRefreshToken, toast]);

  const {
    data,
    error,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    status,
  } = useInfiniteQuery({
    initialPageParam: 0,
    queryKey: [
      "petInventory",
      userId,
      userState.userInfo.Id,
      accessTokenState.userAccessToken,
      element,
      petClass,
    ],
    queryFn: ({ pageParam = 1 }) =>
      getAllUserPetDetails({
        accessToken: accessTokenState.userAccessToken,
        userId: userId,
        page: pageParam,
        limit: 10,
        element: element,
        petClass: petClass,

        // petcategory:,
      }),
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.pagination;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
  });

  useEffect(() => {
    if (isError && error) {
      (async () => {
        try {
          const errorMessage = JSON.parse(error.message);
          console.error(
            `Error ${errorMessage.errorCode}: ${errorMessage.errorMessage}`
          );

          if (errorMessage.errorCode === 440) {
            await refresh();
          } else {
            toast({
              variant: "destructive",
              description: `Error ${errorMessage.errorCode}: ${errorMessage.errorMessage}`,
            });
          }
        } catch (parseError: any) {
          console.error("Error parsing error message:", parseError);
          toast({
            variant: "destructive",
            description: parseError.toString(),
          });
        }
      })();
    }
  }, [isError, error, refresh, toast]);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

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

  const handleElementParams = (element: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (newParams.get("elements") === element) {
      newParams.delete("elements");
    } else {
      newParams.set("elements", element);
    }
    setSearchParams(newParams);
  };

  const handleClassParams = (petClass: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (newParams.get("class") === petClass) {
      newParams.delete("class");
    } else {
      newParams.set("class", petClass);
    }
    setSearchParams(newParams);
  };


  const handleClearButton = () =>{
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("elements");
    newParams.delete("class");
    setSearchParams(newParams);
  }
  let cardIndex = 0;
  return (
    <>
      <>
        {" "}
        <section className="mx-2  overflow-none  md:mx-6 ">
          <section className="flex  overflow-auto  flex-wrap justify-around items-start md:mt-4 mt-2 ">
            <section className=" lg:w-[18vw] md:w-[650px]  hidden w-full h-fit md:flex flex-wrap flex-col gap-1 p-2 border-[2px] border-gray-400 bg-black backdrop-filter backdrop-blur-lg bg-opacity-10 text-secondary-foreground shadow-sm rounded-lg">
              {isFetching && !isFetchingNextPage ? (
                <section className="flex  flex-row    justify-between  flex-wrap p-2 gap-[0.25rem]">
                  {Array(10)
                    .fill(0)
                    .map((_, index) => (
                      <Skeleton
                        className="w-[200px] h-[28px] bg-muted rounded-sm"
                        key={index}
                      />
                    ))}
                </section>
              ) : (
                <section className=" flex flex-col flex-wrap w-full gap-2 items-center">
                  <section className="flex  flex-row   flex-wrap p-2 gap-[0.15rem] h-30">
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
                    {data?.pages?.[0]?.elementCounts.map((element, index) => {
                      let isActive = false;
                      if (searchParams.get("elements") === element.element) {
                        isActive = true;
                      }
                      const backgroundColor =
                        searchParams.get("elements") === element.element
                          ? elementData[element.element].color
                          : undefined;

                      return (
                        <div
                          onClick={() => {
                            handleElementParams(element.element);
                          }}
                          key={index}
                          style={{
                            "--hover-bg-color":
                              elementData[element.element].color,
                            backgroundColor: backgroundColor,
                            order: isActive ? -1 : index,
                          }}
                          className={`flex bg-white ${
                            isActive ? `scale-[0.94]` : `scale-90`
                          }  md:hover:bg-opacity-100 ${
                            isActive ? "w-full" : "w-fit"
                          }  md:hover:bg-opacity-100   hover:scale-100 justify-between bg-opacity-10 h-fit transition-all duration-300 ease-in-out items-center group gap-3 py-[0.35rem] px-3 rounded-sm`}
                        >
                          <div className="flex gap-3">
                            <div
                              style={{
                                backgroundColor:
                                  elementData[element.element].color,
                              }}
                              className={`md:h-6 md:w-6 rotate-[45deg]  h-6 w-6 text-xl md:text-md flex justify-center items-center backdrop-filter transition-all duration-300 ease-in-out backdrop-blur-lg rounded-sm ${
                                // Replace true with your actual condition
                                true
                                  ? "bg-primary bg-opacity-90"
                                  : "bg-zinc-400 bg-opacity-10 group-md:hover:bg-opacity-90 group-md:hover:bg-primary"
                              }`}
                            >
                              <span className="-rotate-[45deg] text-[1rem]">
                                {elementData[element.element].icon}
                              </span>
                            </div>
                            {isActive && (
                              <>
                                <h1 className="text-md hidden md:inline-block  font-bold">
                                  {element.element}
                                </h1>
                              </>
                            )}
                          </div>
                          {isActive && (
                            <>
                              <NumberCounter number={element.count} />
                            </>
                          )}
                        </div>
                      );
                    })}
                  </section>
                  <ClassCombobox />
                </section>
              )}
            </section>

            <ScrollArea className="lg:w-[65vw] flex flex-row justify-center h-[75vh] md:h-[70vh]  w-full md:w-[650px]  md:justify-start items-start  px-auto  rounded-md  md:p-2 ">
              <section className="flex w-[99%] h-full justify-start flex-wrap mb-10  gap-2 md:gap-2 mx-auto ">
                {isFetching && !isFetchingNextPage
                  ? Array(10)
                      .fill(0)
                      .map((_, index) => <CardLoader key={index} />)
                  : data?.pages.map((page, i) => (
                      <React.Fragment key={i}>
                        {page.pets.map((card, index) => {
                          cardIndex += 1; // Increment the post index
                          const isRef = cardIndex % 10 === 9; // Add ref to every 8th, 18th, 28th, etc. post
                          return (
                            <span
                              key={index}
                              ref={isRef ? ref : null}
                              className="w-[170px] relative h-[275px] justify-self-start    md:w-[200px]  md:h-[300px]"
                            >
                              <CardComp
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
                            </span>
                          );
                        })}
                      </React.Fragment>
                    ))}
                {isFetching && !isFetchingNextPage
                  ? Array(5)
                      .fill(0)
                      .map((_, index) => <CardLoader key={index} />)
                  : null}
              </section>
            </ScrollArea>
          </section>
        </section>
        <div className="flex md:hidden flex-wrap  gap-3 w-12 h-12 justify-center fixed bottom-14 md:bottom-4  transition-all duration-300 ease-in-out bg-black backdrop-filter backdrop-blur-lg bg-opacity-50 border-[1px]  p-2  items-center rounded-[0.75rem] scale-90">
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

              <section className="flex mb-2  flex-row  justify-between  flex-wrap md:flex-col gap-1">
                <div
                  onClick={() => {
                    handleClearButton();
                  }}
                  className={`flex bg-muted scale-100  md:hover:bg-opacity-100 w-full md:hover:scale-100 justify-between h-fit transition-all duration-300 ease-in-out items-center group gap-3 py-[0.35rem] px-3 rounded-sm`}
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
                    <h1 className="text-md   font-bold">Remove Tags</h1>
                  </div>
                </div>
                {isFetching && !isFetchingNextPage ? (
                  Array(10)
                    .fill(0)
                    .map((_, index) => (
                      <Skeleton
                        className="w-full bg-muted h-[28px] rounded-sm"
                        key={index}
                      />
                    ))
                ) : (
                  <>
                    {data?.pages?.[0]?.elementCounts.map((element, index) => {
                      let isActive = false;
                      if (searchParams.get("elements") === element.element) {
                        isActive = true;
                      }
                      const backgroundColor =
                        searchParams.get("elements") === element.element
                          ? elementData[element.element].color
                          : undefined;

                      return (
                        <>
                          <div
                            onClick={() => {
                              handleElementParams(element.element);
                            }}
                            key={index}
                            style={{
                              "--hover-bg-color":
                                elementData[element.element].color,
                              backgroundColor: backgroundColor,
                              order: isActive ? -1 : index,
                            }}
                            className={`flex bg-muted ${
                              isActive ? `scale-100` : ``
                            }  md:hover:bg-opacity-100 w-full md:hover:scale-100 justify-between bg-opacity-10 h-fit transition-all duration-300 ease-in-out items-center group gap-3 py-[0.35rem] px-3 rounded-sm`}
                          >
                            <div className="flex gap-3">
                              <div
                                style={{
                                  backgroundColor:
                                    elementData[element.element].color,
                                }}
                                className={`md:h-6 md:w-6 rotate-[45deg] elementCounts h-6 w-6 text-xl md:text-md flex justify-center items-center backdrop-filter transition-all duration-300 ease-in-out backdrop-blur-lg rounded-sm ${
                                  // Replace true with your actual condition
                                  true
                                    ? "bg-primary bg-opacity-90"
                                    : "bg-zinc-400 bg-opacity-10 group-md:hover:bg-opacity-90 group-md:hover:bg-primary"
                                }`}
                              >
                                <span className="-rotate-[45deg] text-[1rem]">
                                  {elementData[element.element].icon}
                                </span>
                              </div>
                              <h1 className="text-md   font-bold">
                                {element.element}
                              </h1>
                            </div>
                            <NumberCounter number={element.count} />
                          </div>
                        </>
                      );
                    })}
                  </>
                )}
              </section>

              <SheetHeader>
                <SheetTitle className="font-bold mt-2 z-[9999]">
                  {" "}
                  Classes
                </SheetTitle>
                <section className="flex mb-2  flex-row  justify-between  flex-wrap md:flex-col gap-1">
                  {isFetching && !isFetchingNextPage ? (
                    Array(4)
                      .fill(0)
                      .map((_, index) => (
                        <Skeleton
                          className="w-full bg-muted h-[28px] rounded-sm"
                          key={index}
                        />
                      ))
                  ) : (
                    <>
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
                          <>
                            <div
                              onClick={() => {
                                handleClassParams(petClass.class);
                              }}
                              key={index}
                              style={{
                                "--hover-bg-color":
                                  classData[petClass.class].color,
                                backgroundColor: backgroundColor,
                                order: isActive ? -1 : index,
                              }}
                              className={`flex bg-muted ${
                                isActive ? `scale-100` : ``
                              }  md:hover:bg-opacity-100 w-full md:hover:scale-100 justify-between h-fit transition-all duration-300 ease-in-out items-center group gap-3 py-[0.35rem] px-3 rounded-sm`}
                            >
                              <div className="flex gap-3">
                                <div
                                  style={{
                                    backgroundColor:
                                      classData[petClass.class].color,
                                  }}
                                  className={`md:h-6 md:w-6 rotate-[45deg] elementCounts h-6 w-6 text-xl md:text-md flex justify-center items-center backdrop-filter transition-all duration-300 ease-in-out backdrop-blur-lg rounded-sm ${
                                    // Replace true with your actual condition
                                    true
                                      ? "bg-primary bg-opacity-90"
                                      : "bg-zinc-400 bg-opacity-10 group-md:hover:bg-opacity-90 group-md:hover:bg-primary"
                                  }`}
                                >
                                  <span className="-rotate-[45deg] text-[1rem]">
                                    {classData[petClass.class].icon}
                                  </span>
                                </div>
                                <h1 className="text-md   font-bold">
                                  {petClass.class}
                                </h1>
                              </div>
                            </div>
                          </>
                        );
                      })}
                    </>
                  )}
                  <div
                    onClick={() => {
                      handleClassParams();
                    }}
                    className={`flex bg-muted scale-100  md:hover:bg-opacity-100 w-full md:hover:scale-100 justify-between h-fit transition-all duration-300 ease-in-out items-center group gap-3 py-[0.35rem] px-3 rounded-sm`}
                  >
                    <div className="flex gap-3">
                      <div
                        className={`md:h-6 md:w-6 hover:bg-red-700 rotate-[45deg] elementCounts h-6 w-6 text-xl md:text-md flex justify-center items-center backdrop-filter transition-all duration-300 ease-in-out backdrop-blur-lg rounded-sm ${
                          // Replace true with your actual condition
                          true
                            ? "bg-red-500 bg-opacity-90"
                            : "bg-red-500 bg-opacity-10 group-md:hover:bg-opacity-90 group-md:hover:bg-red-700"
                        }`}
                      >
                        <span className="-rotate-[45deg] text-[1rem]">
                          <GiCancel />
                        </span>
                      </div>
                    </div>
                  </div>
                </section>
              </SheetHeader>
              <SheetDescription className="flex flex-col gap-2 py-3"></SheetDescription>
              <SheetFooter></SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </>
    </>
  );
};

export default PetInventoryPage;
