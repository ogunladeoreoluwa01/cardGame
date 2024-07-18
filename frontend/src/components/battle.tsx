/* eslint-disable prefer-destructuring */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import styles from "../styles/styles";

import ActionButton from "./ActionButton";
import PlayerInfo from "./PlayerInfo";
import GameCardComp from "./gameCardComp";
import BattleCardComp from "./battleCardComp";
import {
  attack,
  attackSound,
  defense,  defenseSound,

} from "../assets";
import { playAudio } from "../utils/animations";



const initialCards = Array.from({ length: 10 }, (_, i) => i + 1); // Example array representing your cards

const getRotation = (index, total) => {
  const mid = (total - 1) / 2;
  return (index - mid) * 5; // Adjust the 5 for the desired rotation amount
};

const getLeftPosition = (index, total) => {
  const mid = (total - 1) / 2;
  return 50 + (index - mid) * 10; // Adjust the 20 for the desired spacing
};




const Battle = () => {

  const [player2, setPlayer2] = useState({});
  const [player1, setPlayer1] = useState({});
  const { battleName } = useParams();
  const navigate = useNavigate();
  const [backgroundUrl, setBackgroundUrl] = useState(
    "https://i.pinimg.com/originals/04/55/5f/04555f5b3e8b3d4f22c2e6bf249b58f8.jpg"
  );

  const changeBackground = (url) => {
    setBackgroundUrl(url);
  };


 const [cards, setCards] = useState(initialCards);


  const makeAMove = async (choice) => {
    playAudio(choice === 1 ? attackSound : defenseSound);
  };
  const dummyPlayer = {
    health: 100,
    mana: 500,
  };

  return (
    <div
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),url(${backgroundUrl})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
        width: "100%", // Ensure it covers the entire area
        height: "100vh", // Adjust as needed
         
      }}
      className={`flex flex-col w-screen h-screen justify-center items-center overflow-hidden ${styles.glassEffect}`}
    >
      <PlayerInfo
        player={dummyPlayer}
        playerIcon="https://i.pinimg.com/originals/b4/9c/0d/b49c0d0cf01e2de348fb58d90079768e.png"
        initialHealth={100}
        liveHealth={40}
        isPlayerOne={false}
        isThePlayer={false}
      />
      <PlayerInfo
        player={dummyPlayer}
        playerIcon="https://i.pinimg.com/originals/b4/9c/0d/b49c0d0cf01e2de348fb58d90079768e.png"
        initialHealth={100}
        liveHealth={100}
        isPlayerOne={true}
        isThePlayer={true}
      />

      {/* center of the gamescreen  */}
      <div className={` `}>hi</div>

      <div className="deck-container ">
        <section className=" flex flex-col gap-3 fixed -bottom-[10rem] left-1/2 -translate-x-1/2  ">
          <div className="deck-info flex flex-col justify-center items-center ">
            <div className="flex items-center justify-center gap-4 flex-row">
              <ActionButton
                imgUrl={attack}
                handleClick={() => makeAMove(1)}
                restStyles="hover:border-yellow-400 transition-all duration-300 ease-in-out"
              />
              <p className="font-bold font-mono">Deck size: {cards.length}</p>

              <ActionButton
                imgUrl={defense}
                handleClick={() => makeAMove(2)}
                restStyles="hover:border-red-600 transition-all duration-300 ease-in-out"
              />
            </div>
          </div>
          <section className="flex gap-1 justify-center items-center">
            {cards.slice(0, 5).map((card, index) => (
              <div
                key={card}
                className="battleCard relative saturate-50 hover:saturate-100"
                style={{
                  transform: `rotate(${getRotation(index, 5) / 4}deg)`,
                }}
              >
                <BattleCardComp />
              </div>
            ))}
          </section>
        </section>
      </div>

      {/* discard pile */}
      <section className="flex gap-4 justify-center fixed scale-[0.85] grayscale  top-[40%] left-[6rem] ">
        {cards.slice(0, 5).map((card, index) => (
          <div
            key={card}
            className="absolute  transform -translate-x-1/2"
            style={{
              transform: `rotate(${getRotation(index, 5) / 3}deg)`,
            }}
          >
            <BattleCardComp />
          </div>
        ))}
      </section>
    </div>
  );
};

export default Battle;
