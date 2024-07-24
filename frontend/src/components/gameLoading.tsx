import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/copyButton";
import { GiExitDoor } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/types";
import ClosePendingDuelButton from "./closeDuelButton";


interface Props {
  isPlayer1: boolean;
}



const GameLoad: React.FC<Props> = ({isPlayer1}) => {
  const initialGameState = useSelector((state: RootState) => state.ongoingGame);

  const [player1RankStyle, setPlayer1RankStyle] = useState("bg-primary");
  const [player2RankStyle, setPlayer2RankStyle] = useState("bg-primary");
  const [joinLink, setJoinLink] = useState("");

  const updateRankStyle = (
    rank: string,
    setRankStyle: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const rankStyles: Record<string, string> = {
      Unranked: "UnrankedStyle",
      Rustic: "RusticStyle",
      Arcane: "ArcaneStyle",
      Mythic: "MythicStyle",
      Exalted: "ExaltedStyle",
      Ethereal: "EtherealStyle",
    };
    setRankStyle(rankStyles[rank] || "bg-primary");
  };

  useEffect(() => {
    if (initialGameState?.gameState) {
      setJoinLink(
        `http://localhost:5173/join-game/${initialGameState.gameState.duelJoinKey}`
      );
      const { player1, player2 } = initialGameState.gameState.players;
      if (player1?.rank) {
        updateRankStyle(player1.rank, setPlayer1RankStyle);
      }
      if (player2?.rank) {
        updateRankStyle(player2.rank, setPlayer2RankStyle);
      }
    }
  }, [initialGameState]);

  return (
    <main className="relative w-full h-screen ">
      <div className="absolute w-full h-screen blur-sm gameLoadingBg bg-black bg-opacity-60"></div>
      <div className="absolute w-full h-screen bg-black bg-opacity-60"></div>
      <div className="flex relative justify-between items-center inset-0 z-10 w-full h-screen backdrop-blur-3xl flex-col">
        {isPlayer1?(<div className="w-full flex justify-end absolute top-8 right-8 ">
          <ClosePendingDuelButton/>
        </div>):null}
        

        <div className="flex-1 flex items-center justify-center flex-col">
          <h1 className="font-bold text-white text-3xl text-center">
            Waiting for a <br /> worthy opponent...
          </h1>

          <div className="flex justify-center md:justify-evenly md:gap-20 gap-2 items-center mt-10">
            <div className="flex items-center justify-center flex-col">
              <div
                className={`md:w-32 w-20 md:h-32 h-20 object-cover rounded-full drop-shadow-lg p-1 ${player1RankStyle}`}
              >
                <img
                  src={
                    initialGameState?.gameState?.players?.player1?.profileIMG
                  }
                  alt="Player 1"
                  className="w-full h-full object-cover rounded-full drop-shadow-lg"
                  fetchpriority="high"
                  loading="lazy"
                />
              </div>
              <p className="mt-3 text-white md:text-xl text-base font-mono">
                {initialGameState?.gameState?.players?.player1?.username}
              </p>
            </div>

            <h2 className="font-extrabold text-siteViolet text-4xl md:mx-16 mx-8">
              Vs
            </h2>

            <div className="flex items-center justify-center flex-col">
              <div
                className={`md:w-32 w-20 md:h-32 h-20 object-cover rounded-full drop-shadow-lg p-1 ${
                  initialGameState?.gameState?.players?.player2?.username
                    ? player2RankStyle
                    : "rotatingStyles"
                }`}
              >
                <img
                  src={
                    initialGameState?.gameState?.players?.player2?.profileIMG ||
                    "https://i.pinimg.com/originals/29/b8/d2/29b8d250380266eb04be05fe21ef19a7.jpg"
                  }
                  alt="Player 2"
                  className="w-full h-full object-cover rounded-full drop-shadow-lg"
                  fetchpriority="high"
                  loading="lazy"
                />
              </div>
              {initialGameState?.gameState?.players?.player2?.username ? (
                <p className="mt-3 text-white md:text-xl text-base font-mono">
                  {initialGameState?.gameState?.players?.player2?.username}
                </p>
              ) : (
                <div className="flex flex-row gap-2 mt-4">
                  <div className="w-2 h-2 rounded-full bg-white animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.3s]"></div>
                  <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.5s]"></div>
                  <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.7s]"></div>
                  <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.9s]"></div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-5">
            <p className="font-medium text-lg text-siteViolet cursor-pointer text-center mb-5">
              OR
            </p>
            <CopyButton
              link={joinLink}
              text={initialGameState?.gameState?.duelJoinKey}
              cta="Invite a friend"
              variant="outline"
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default GameLoad;
