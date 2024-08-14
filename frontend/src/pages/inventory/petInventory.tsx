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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import CardComp from "@/components/cardComp";
import InventorySideBar from "./inventorySidebar"
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
import CardLoader from "@/components/loaders/cardLoader";
import {
  GiArchiveResearch,
} from "react-icons/gi";



const PetInventoryPage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch: AppDispatch = useDispatch();
  const { userId } = useParams();

  let [searchParams, setSearchParams] = useSearchParams();
  const [element, setElement] = useState<string[] | null>(null);
  const [petClass, setPetClass] = useState<string | null>(null);
const [petNameValue, setPetNameValue] = useState<string | null>(null);
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
      const searchValueParam = searchParams.get("q");
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
      "petInventory",
      userId,
      userState.userInfo.Id,
      accessTokenState.userAccessToken,
      element,
      petClass,
      petNameValue
    ],
    queryFn: ({ pageParam = 1 }) =>
      getAllUserPetDetails({
        accessToken: accessTokenState.userAccessToken,
        userId: userId,
        page: pageParam,
        limit: 10,
        element: element,
        petClass: petClass,
        petname: petNameValue,
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
            <InventorySideBar
              handleElementParams={handleElementParams}
              handleClassParams={handleClassParams}
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
        
      </>
    </>
  );
};

export default PetInventoryPage;
