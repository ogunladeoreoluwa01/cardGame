import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import HeaderComp from "@/components/headerComponent";
import NavBarComp from "@/components/navBarComponent";
import CreateDuelButtons from "@/components/createDuelButtons";
import { gameAction } from "@/stores/reducers/gameReducer";
import {liveGameAction} from "@/stores/reducers/liveGameReducer"
import { AppDispatch } from "@/stores";
import { JoinDuelWithKey } from "@/components/joinDuelButtonComp";

const DuelsPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();
  const userState: any | null = useSelector((state: RootState) => state.user);
  const accessTokenState: any | null = useSelector(
    (state: RootState) => state.accessToken
  );
  const refreshTokenState: any | null = useSelector(
    (state: RootState) => state.refreshToken
  );
  const [gameState, setGameState] = useState<any>(null);

  useEffect(() => {
    if (gameState) {
      dispatch(gameAction.setGameState(gameState));
       localStorage.setItem("game", JSON.stringify(gameState));
       dispatch(liveGameAction.setLiveGameState(gameState));
       localStorage.setItem("liveGame", JSON.stringify(gameState));
      setTimeout(() => {
        navigate(
          `/games-page/${gameState._id}/duelJoinKey/${gameState.duelJoinKey}`
        );
      }, 1000); // 1000 milliseconds = 3 seconds
    }
  }, [gameState, dispatch, navigate]);

  return (
    <>
      <section className="">
        <main className="background-container">
          <header className="lg:px-6 px-4 sticky z-50">
            <HeaderComp />
          </header>
          <section className="overlay">
            <section className="content">
              <h1 className="text-4xl font-mono font-bold my-5">Duels Page</h1>
              <section className="flex justify-center gap-5 md:gap-[7rem] items-center  flex-wrap">
                <div className="flex flex-col w-[250px]  ">
                  <p className="my-6 font-normal">wanna create a duel </p>
                  <CreateDuelButtons setGameState={setGameState} />
                </div>
                <JoinDuelWithKey setGameState={setGameState} />
              </section>
            </section>
          </section>
        </main>
      </section>
      <NavBarComp
        userState={userState}
        accessTokenState={accessTokenState}
        refreshTokenState={refreshTokenState}
      />
    </>
  );
};

export default DuelsPage;
