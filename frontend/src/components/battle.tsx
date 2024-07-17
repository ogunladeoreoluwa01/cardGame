/* eslint-disable prefer-destructuring */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import styles from "../styles/styles";

import ActionButton from "./ActionButton";
import PlayerInfo from "./PlayerInfo";
import GameCardComp from "./gameCardComp";
import {
  attack,
  attackSound,
  defense,   defenseSound,
  player01 as player01Icon,
  player02 as player02Icon,
} from "../assets";
import { playAudio } from "../utils/animations";


const Battle = () => {

  const [player2, setPlayer2] = useState({});
  const [player1, setPlayer1] = useState({});
  const { battleName } = useParams();
  const navigate = useNavigate();


  const makeAMove = async (choice) => {
    playAudio(choice === 1 ? attackSound : defenseSound);
  };
  const dummyPlayer = {
    health: 100,
    mana: 500,
  };

  return (
    <div
      className={`flex flex-col w-screen h-screen justify-center items-center ${styles.glassEffect}`}
    >
      <PlayerInfo
        player={dummyPlayer}
        playerIcon="https://i.pinimg.com/originals/b4/9c/0d/b49c0d0cf01e2de348fb58d90079768e.png"
        initialHealth={100}
        liveHealth={40}
        isPlayerOne={false}
        isThePlayer={false}
      />

      <div className={`${styles.flexCenter} gap-8 flex-col`}>
        <GameCardComp />

        <div className="flex items-center justify-center gap-4 flex-row">
          <ActionButton
            imgUrl={attack}
            handleClick={() => makeAMove(1)}
            restStyles="hover:border-yellow-400 transition-all duration-300 ease-in-out"
          />

          <GameCardComp />

          <ActionButton
            imgUrl={defense}
            handleClick={() => makeAMove(2)}
            restStyles="hover:border-red-600 transition-all duration-300 ease-in-out"
          />
        </div>
      </div>

      <div>
        <PlayerInfo
          player={dummyPlayer}
          playerIcon="https://i.pinimg.com/originals/b4/9c/0d/b49c0d0cf01e2de348fb58d90079768e.png"
          initialHealth={100}
          liveHealth={100}
          isPlayerOne={true}
          isThePlayer={true}
        />
      </div>
     
    </div>
  );
};

export default Battle;
