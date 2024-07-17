import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/copyButton";
import { GiExitDoor } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/types";

const messages = [
  "Waiting for a worthy opponent...",
  "Tip: Use your special abilities wisely!",
  "Tip: Keep an eye on your health and mana.",
  "Tip: Plan your moves ahead to outsmart your opponent.",
  "Tip: Elemental strengths and weaknesses can turn the tide of battle.",
  "Tip: Upgrade your pets regularly to stay competitive.",
  "Tip: Join a guild to make new friends and allies.",
];

const GameLoad = () => {
  const initialGameState: any | null = useSelector(
    (state: RootState) => state.ongoingGame
  );

  const [player1RankStyle, setPlayer1RankStyle] = useState("bg-primary");
  const [player2RankStyle, setPlayer2RankStyle] = useState("bg-primary");

  const navigate = useNavigate();
  const [currentMessage, setCurrentMessage] = useState(messages[0]);
  const [fadeOut, setFadeOut] = useState(false);
  const [joinLink, setJoinLink] = useState("");
  
  const updateRankStyle = (
    rank: string,
    setRankStyle: React.Dispatch<React.SetStateAction<string>>
  ) => {
    switch (rank) {
      case "Unranked":
        setRankStyle("UnrankedStyle");
        break;
      case "Rustic":
        setRankStyle("RusticStyle");
        break;
      case "Arcane":
        setRankStyle("ArcaneStyle");
        break;
      case "Mythic":
        setRankStyle("MythicStyle");
        break;
      case "Exalted":
        setRankStyle("ExaltedStyle");
        break;
      case "Ethereal":
        setRankStyle("EtherealStyle");
        break;
      default:
        setRankStyle("bg-primary");
        break;
    }
  };

  useEffect(() => {
    setJoinLink(
      `http://localhost:5173/join-game/${initialGameState?.gameState?.duelJoinKey}`
    );
    if (initialGameState?.gameState?.players?.player1?.rank) {
      updateRankStyle(
        initialGameState.gameState.players.player1.rank,
        setPlayer1RankStyle
      );
    }
    if (initialGameState?.gameState?.players?.player2?.rank) {
      updateRankStyle(
        initialGameState.gameState.players.player2.rank,
        setPlayer2RankStyle
      );
    }
    
  }, [initialGameState]);
  

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeOut(true);
      setTimeout(() => {
        setCurrentMessage((prevMessage) => {
          const currentIndex = messages.indexOf(prevMessage);
          const nextIndex = (currentIndex + 1) % messages.length;
          return messages[nextIndex];
        });
        setFadeOut(false);
      }, 1000); // Wait for the fade-out effect to complete
    }, 30000); // Change message every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="relative w-full h-screen ">
      <div className="absolute w-full h-screen blur-sm gameLoadingBg bg-black bg-opacity-60"></div>
      <div className="absolute w-full h-screen  bg-black bg-opacity-60"></div>
      <div
        className={`flex relative justify-between items-center  inset-0 z-10 w-full h-screen backdrop-blur-3xl flex-col`}
      >
        <div className="w-full flex justify-end  absolute top-8 right-8 ">
          <Button variant="destructive" className="text-lg p-3">
            <GiExitDoor />
          </Button>
        </div>

        <div className={`flex-1 flex items-center justify-center flex-col`}>
          <h1 className={`font-bold text-white  text-3xl text-center`}>
            Waiting for a <br /> worthy opponent...
          </h1>
          <p
            className={`mt-3 z-50 text-white md:text-xl text-base message ${
              fadeOut ? "fade-out" : ""
            }`}
          >
            {currentMessage}
          </p>

          <div className="flex justify-center md:justify-evenly md:gap-20 gap-2  items-center mt-10">
            <div className={`flex items-center justify-center flex-col`}>
              <div
                className={`md:w-32 w-20 md:h-32 h-20 object-cover rounded-full drop-shadow-lg p-1 ${player1RankStyle}`}
              >
                <img
                  src={
                    initialGameState?.gameState?.players?.player1?.profileIMG
                  }
                  className="w-full h-full object-cover rounded-full drop-shadow-lg"
                />
              </div>

              <p className="mt-3 text-white md:text-xl text-base font-mono">
                {initialGameState?.gameState?.players?.player1?.username}
              </p>
            </div>

            <h2 className="font-extrabold text-siteViolet text-4xl md:mx-16 mx-8 ">
              Vs
            </h2>

            <div className={`flex items-center justify-center flex-col`}>
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
                  className="w-full h-full object-cover rounded-full drop-shadow-lg"
                />
              </div>
              {initialGameState?.gameState?.players?.player2?.username ? (
                <p className="mt-3 text-white md:text-xl text-base font-mono">
                  {initialGameState?.gameState?.players?.player2?.username}
                </p>
              ) : (
                <div className="flex flex-row gap-2 mt-4 ">
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
