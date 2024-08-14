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
import { useQuery } from "@tanstack/react-query";
import DeckCardComp from "./deckCardComp";

import getUserCurrentDeck from "@/services/petServices/getUserCurrentDeck";
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
interface Props {
  secondaryCard: string | null;
  HandleSecondaryCard: (petId: string, cardInfo: cardInfoProp) => void;
  secondaryCardInfo: cardInfoProp | null;
}

const UserCurrentDeckComp: React.FC<Props> = ({
  secondaryCard,
  HandleSecondaryCard,
  secondaryCardInfo,
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useParams();

  const dispatch: AppDispatch = useDispatch();

  const accessTokenState: any | null = useSelector(
    (state: RootState) => state.accessToken
  );
  const refreshTokenState: any | null = useSelector(
    (state: RootState) => state.refreshToken
  );

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["userCurrentDeck", accessTokenState.userAccessToken],
    queryFn: () =>
      getUserCurrentDeck({
        accessToken: accessTokenState.userAccessToken,
        targetUserId: userId,
      }),
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
    if (isError && error) {
      (async () => {
        try {
          const errorMessage = JSON.parse(error.message);

          if (errorMessage.errorCode === 440) {
            await refresh();
          } else {
            toast({
              variant: "destructive",
              description: `Error ${errorMessage.errorCode}: ${errorMessage.errorMessage}`,
            });
          }
        } catch (parseError: any) {
          toast({
            variant: "destructive",
            description: parseError.toString(),
          });
        }
      })();
    }
  }, [isError, error, refresh, toast]);

  return (
    <>
      <section className=" flex flex-col justify-center">
        <h1 className="font-bold text-md md:ml-4">
          Your Current Deck{" "}
          {isPending ? (
            <>
              <div className="spinner center mx-1">
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
            <p className=" uppercase text-sm text-center inline font-bold mx-1">
              {" "}
              {data?.currentDeck.length}
            </p>
          )}
          /
          {isPending ? (
            <>
              <div className="spinner center mx-1">
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
            <p className=" uppercase text-sm inline text-center font-bold mx-1">
              {" "}
              {data?.maxDeckSize}
            </p>
          )}
        </h1>
        <ScrollArea className=" h-[300px]   bg-black backdrop-filter backdrop-blur-lg bg-opacity-10 w-full  rounded-md  p-2 ">
          <section className="flex w-[99%] h-full justify-start  gap-2 md:gap-2 mx-auto ">
            {isPending
              ? Array(10)
                  .fill(0)
                  .map((_, index) => <DeckCardLoader key={index} />)
              : data?.currentDeck.map((card, index) => (
                  <span
                    onClick={() => {
                      HandleSecondaryCard(card._id, {
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
                    key={index}
                    className={`w-[175px]  flex justify-center transition-all duration-300 ease-in-out items-center  relative h-[280px] rounded-md shadow-lg ${
                      secondaryCard === card._id
                        ? "bg-amber-300 border-4 border-amber-400 saturate-150"
                        : "saturate-[1] md:saturate-[0.2] hover:saturate-100"
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
                ))}
          </section>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>
    </>
  );
};

export default UserCurrentDeckComp;
