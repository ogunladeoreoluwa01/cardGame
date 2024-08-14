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
import ViewAllListing from "@/services/marketServices/viewAllListing";
import refreshAccessToken from "@/services/authServices/refreshAccessToken";
import { accessTokenAction } from "@/stores/reducers/accessTokenReducer";
import clearAccessToken from "@/stores/actions/accessTokenAction";
import clearRefreshToken from "@/stores/actions/refreshTokenAction";
import logOut from "@/stores/actions/userAction";
import { AppDispatch } from "@/stores";
import { gameSessionAction } from "@/stores/reducers/gameSessionReducer";
import { gameAction } from "@/stores/reducers/gameReducer";
import { liveGameAction } from "@/stores/reducers/liveGameReducer";
import MarketCardComp from "./marketCard";
import { Input } from "@/components/ui/input";

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
  GiArchiveResearch,
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
import MarketPlaceSideBar from "./marketPlaceSideBar";


const PetMarketPage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const dispatch: AppDispatch = useDispatch();

  const userState: any | null = useSelector((state: RootState) => state.user);
  const accessTokenState: any | null = useSelector(
    (state: RootState) => state.accessToken
  );
  const refreshTokenState: any | null = useSelector(
    (state: RootState) => state.refreshToken
  );


let [searchParams, setSearchParams] = useSearchParams();
const [element, setElement] = useState<string[] | null>(null);
const [petClass, setPetClass] = useState<string | null>(null);
const [minInputValue, setMinInputValue] = useState<number | null>(null);
const [maxInputValue, setMaxInputValue] = useState<number | null>(null);
const [petNameValue, setPetNameValue] = useState<string | null>(null);



useEffect(() => {
  const elementParam = searchParams.get("elements");
  const classParam = searchParams.get("class");
  const minValueParam = searchParams.get("mi");
  const maxValueParam = searchParams.get("mx");
  const searchValueParam = searchParams.get("q");

  if (elementParam) {
    setElement([elementParam.toString()]);
  } else {
    setElement(null);
  }

  if (classParam) {
    setPetClass(classParam.toString());
  } else {
    setPetClass(null);
  }

  if (minValueParam) {
    setMinInputValue(parseFloat(minValueParam));
  } else {
    setMinInputValue(null);
  }

  if (maxValueParam) {
    setMaxInputValue(parseFloat(maxValueParam));
  } else {
    setMaxInputValue(null);
  }

  if (searchValueParam) {
    setPetNameValue(searchValueParam.toString());
  } else {
    setPetNameValue(null);
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
    "blackMarket",
    userState.userInfo.Id,
    accessTokenState.userAccessToken,
    element,
    petClass,
    minInputValue,
    maxInputValue,
    petNameValue,
  ],
  queryFn: ({ pageParam = 1 }) => {
    return ViewAllListing({
      accessToken: accessTokenState.userAccessToken,
      page: pageParam,
      limit: 10,
      element: element,
      petClass: petClass,
      minPrice: minInputValue,
      maxPrice: maxInputValue,
      itemname: petNameValue,
    });
  },
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


const handleMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const value = event.target.value;
  const newParams = new URLSearchParams(searchParams);

  // If the input is empty, remove the "mi" parameter
  if (value === "") {
    newParams.delete("mi");
  } else {
    // Set or update the "mi" parameter with the new value
    newParams.set("mi", value);
  }
  setSearchParams(newParams);
};

const handleMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const value = event.target.value;
  const newParams = new URLSearchParams(searchParams);

  // If the input is empty, remove the "mx" parameter
  if (value === "") {
    newParams.delete("mx");
  } else {
    // Set or update the "mx" parameter with the new value
    newParams.set("mx", value);
  }
  setSearchParams(newParams);
};

 const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
   const value = event.target.value;
 const newParams = new URLSearchParams(searchParams);
  if (value === "") {
    newParams.delete("q");
  } else {
    newParams.set("q", value);
  }
  setSearchParams(newParams);

 };

 const handleClearButton = () => {
   setPetNameValue("");
   const newParams = new URLSearchParams(searchParams);
   newParams.delete("elements");
   newParams.delete("class");
   newParams.delete("mi");
   newParams.delete("mx");
   newParams.delete("q");
   setSearchParams(newParams);
  
 };

 

 

  let cardIndex = 0;
  return (
    <>
      <>
        {" "}
        <section className="mx-2  overflow-none flex flex-col justify-start  md:mx-6 ">
          <div className="flex w-full max-w-sm items-center  gap-1.5  md:mx-10 mx-0  ">
            <Label
              htmlFor="petName"
              className="p-1 w-9 h-9 items-center justify-center flex text-2xl bg-primary rounded-[0.55rem]  "
            >
              <GiArchiveResearch />
            </Label>
            <Input
              value={petNameValue ?? ""}
              onChange={handleSearchChange}
              type="text"
              id="petName"
              autoComplete="off"
              placeholder="search"
              pattern="[A-Z,a-z]*" // This pattern only accepts numeric digits
              className=" text-xs h-9  placeholder:top-1 focus-visible:ring-gray-400 border-gray-400 rounded-sm focus:border-none bg-white backdrop-filter bg-opacity-10"
            />
          </div>
          <section className="flex  overflow-auto  flex-wrap justify-around items-start md:mt-4 mt-2 ">
            <MarketPlaceSideBar

              minInputValue={minInputValue}
              maxInputValue={maxInputValue}
              handleElementParams={handleElementParams}
              handleClassParams={handleClassParams}
              handleMinChange={handleMinChange}
              handleMaxChange={handleMaxChange}
              handleClearButton={handleClearButton}
            />

            <ScrollArea className="lg:w-[65vw] flex flex-row justify-center h-[75vh] md:h-[70vh]  w-full md:w-[650px]  md:justify-start items-start  px-auto  rounded-md  md:p-2 ">
              <section className="flex w-[99%] h-full justify-start flex-wrap mb-10  gap-2 md:gap-2 mx-auto ">
                {isFetching && !isFetchingNextPage
                  ? Array(10)
                      .fill(0)
                      .map((_, index) => <CardLoader key={index} />)
                  : data?.pages.map((page, i) => (
                      <React.Fragment key={i}>
                        {page.listing.map((card, index) => {
                          cardIndex += 1; // Increment the post index
                          const isRef = cardIndex % 10 === 9; // Add ref to every 8th, 18th, 28th, etc. post
                          return (
                            <span
                              key={index}
                              ref={isRef ? ref : null}
                              className=""
                            >
                              <MarketCardComp
                                id={card._id}
                                elements={card.petId.petInfo.element}
                                classy={card.petId.petInfo.class}
                                name={card.petId.petInfo.name}
                                illustration={card.petId.petInfo.illustration}
                                level={card.petId.level}
                                health={card.petId.currentHealth}
                                attack={card.petId.currentAttack}
                                defence={card.petId.currentDefense}
                                mana={card.petId.currentManaCost}
                                rarity={card.petId.rarity}
                                sideNote={card.sideNote}
                                isListed={card.petId.isListed}
                                isSystem={card.isSystem}
                                listingDate={card.createdAt}
                                listingNo={card.listingNumber}
                                priceInSilver={card.priceInSilver}
                                sellerId={card.sellerId}
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
      </>
    </>
  );
};

export default PetMarketPage;
