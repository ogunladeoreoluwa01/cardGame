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
import { Button } from "@/components/ui/button";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import DeckCardComp from "./deckCardComp";

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
import DeckCardLoader from "./deckCardLoader";
import { Skeleton } from "@/components/ui/skeleton";
import UserCurrentDeckComp from "./currenPlayersDeck";
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
import { IoIosFunnel } from "react-icons/io";
import { Pet } from "../../types";
import { ClassComboboxDemo } from "./ClassCombobox";
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

import CardInpectDrawer from "./inspectDrawer";

import EditButton from "./swapButton";

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

interface cardInfoProp {
  id: string;
  elements: string[];
  classy: string;
  name: string;
  illustration: string;
  level: number;
  health: number;
  attack: number;
  defense: number;
  mana: number;
  rarity: string;
  description: string;
  isListed: boolean;
  isSystem: boolean;
}

const DeckInventoryPage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { userId } = useParams();
  const dispatch: AppDispatch = useDispatch();
  const [primaryCard, setPrimaryCard] = useState<string | null>(null);
  const [primaryCardInfo, setPrimaryCardInfo] = useState<cardInfoProp | null>(
    null
  );
  const [secondaryCardInfo, setSecondaryCardInfo] =
    useState<cardInfoProp | null>(null);

  const [secondaryCard, setSecondaryCard] = useState<string | null>(null);

  const userState: any | null = useSelector((state: RootState) => state.user);
  const accessTokenState: any | null = useSelector(
    (state: RootState) => state.accessToken
  );
  const refreshTokenState: any | null = useSelector(
    (state: RootState) => state.refreshToken
  );

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
      userState.userInfo._id,
      accessTokenState.userAccessToken,
    ],
    queryFn: ({ pageParam = 1 }) =>
      getAllUserPetDetails({
        accessToken: accessTokenState.userAccessToken,
        userId: userId,
        page: pageParam,
        limit: 10,
        petcategory: "available-pets",

        // petcategory:,
      }),
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.pagination;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
  });

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

  useEffect(() => {
    if (userState.userInfo._id !== userId) {
      navigate(`/inventory/${userId}/pet`);
      toast({
        variant: "warning",
        description: "you cannot access what is not yours",
      });
    }
  }, [userState.userInfo._id, userId]);

  useEffect(() => {
    if (isError && error) {
      (async () => {
        try {
          const errorMessage = JSON.parse(error.message);
          // console.error(
          //   `Error ${errorMessage.errorCode}: ${errorMessage.errorMessage}`
          // );

          if (errorMessage.errorCode === 440) {
            await refresh();
          } else {
            toast({
              variant: "destructive",
              description: `Error ${errorMessage.errorCode}: ${errorMessage.errorMessage}`,
            });
          }
        } catch (parseError: any) {
          // console.error("Error parsing error message:", parseError);
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

  const HandlePrimaryCard = (petId: string, cardInfo: cardInfoProp) => {
    if (primaryCard == petId) {
      setPrimaryCard(null);
      setPrimaryCardInfo(null);
    } else {
      setPrimaryCard(petId);
      setPrimaryCardInfo(cardInfo);
    }
  };

  const HandleSecondaryCard = (petId: string, cardInfo: cardInfoProp) => {
    if (secondaryCard == petId) {
      setSecondaryCard(null);
    } else {
      setSecondaryCard(petId);
      setSecondaryCardInfo(cardInfo);
    }
  };

  let cardIndex = 0;
  return (
    <>
      <section className="mx-2 md:mx-4 flex flex-col gap-2 ">
        <UserCurrentDeckComp
          secondaryCard={secondaryCard}
          HandleSecondaryCard={HandleSecondaryCard}
          secondaryCardInfo={secondaryCardInfo}
        />
        <section className="flex items-center justify-around ">
          <CardInpectDrawer
            secondaryCardInfo={secondaryCardInfo}
            primaryCardInfo={primaryCardInfo}
          />{" "}
          <EditButton primaryCard={primaryCard} secondaryCard={secondaryCard} />
        </section>
        <section className=" flex flex-col justify-center">
          <h1 className="font-bold text-md md:ml-4">Available Pets</h1>
          <ScrollArea className=" h-[295px]   bg-black backdrop-filter backdrop-blur-lg bg-opacity-10 w-full  rounded-md  p-2 ">
            <section className="flex w-[99%] h-full justify-start  gap-2 md:gap-2 mx-auto ">
              {isFetching && !isFetchingNextPage
                ? Array(10)
                    .fill(0)
                    .map((_, index) => <DeckCardLoader key={index} />)
                : data?.pages.map((page, i) => (
                    <React.Fragment key={i}>
                      {page.pets.map((card: Pet, index: number) => {
                        cardIndex += 1; // Increment the post index
                        const isRef = cardIndex % 10 === 9; // Add ref to every 8th, 18th, 28th, etc. post
                        return (
                          <span
                            key={card?._id}
                            ref={isRef ? ref : null}
                            onClick={() => {
                              HandlePrimaryCard(card._id, {
                                id: card._id,
                                elements: card.petInfo.element,
                                classy: card.petInfo.class,
                                name: card.petInfo.name,
                                illustration: card.petInfo.illustration,
                                level: card.level,
                                health: card.currentHealth,
                                attack: card.currentAttack,
                                defense: card.currentDefense,
                                mana: card.currentManaCost,
                                description: card.petInfo.description,
                                rarity: card.rarity,
                                isListed: card.isListed,
                                isSystem: card.isSystemOwned,
                              });
                            }}
                            className={`w-[175px]  flex justify-center items-center  relative h-[280px] rounded-md transition-all duration-300 ease-in-out shadow-lg ${
                              primaryCard === card._id
                                ? "bg-emerald-500 border-4 border-emerald-400 saturate-150"
                                : " saturate-[1] md:saturate-[0.2] hover:saturate-100 "
                            }`}
                          >
                            <DeckCardComp
                              id={card._id}
                              elements={card.petInfo.element}
                              classy={card.petInfo.class}
                              name={card.petInfo.name}
                              illustration={card.petInfo.illustration}
                              level={card.level}
                              health={card.currentHealth}
                              attack={card.currentAttack}
                              defense={card.currentDefense}
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
                    .map((_, index) => <DeckCardLoader key={index} />)
                : null}
            </section>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </section>
      </section>
    </>
  );
};

export default DeckInventoryPage;
