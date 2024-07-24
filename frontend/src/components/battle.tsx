import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/styles";
import ActionButton from "./ActionButton";
import PlayerInfo from "./PlayerInfo";
import BattleCardComp from "./battleCardComp";
import ActiveBattleCardComp from "./activeBattleCard";
import EmoteBar from "@/components/battlePageEmote";
import StatusEffectComponent from "@/components/statusEffects";
import { attack, attackSound, defense, defenseSound } from "../assets";
import { playAudio } from "../utils/animations";
import { Socket } from "socket.io-client";

const statusEffectsValid = ["burn", " freeze"];

const getRotation = (index, total) => {
  const mid = (total - 1) / 2;
  return (index - mid) * 5; // Adjust the 5 for the desired rotation amount
};

interface BattleProps {
  initialPlayers: any;
  livePlayers: any;
  arena: any;
  userId: any;
  sessionId: any;
  currentDamage:any;
  opponentDamage:any;
  socket: Socket;
}

const Battle: React.FC<BattleProps> = ({
  initialPlayers,
  livePlayers,
  arena,
  userId,
  sessionId,
  currentDamage,
  opponentDamage,
  socket,
}) => {
  const [currentInitialPlayer1, setCurrentInitialPlayer1] = useState<
    any | null
  >(null);
  const [currentInitialPlayer2, setCurrentInitialPlayer2] = useState<
    any | null
  >(null);
  const [currentLivePlayer1, setCurrentLivePlayer1] = useState<any | null>(
    null
  );
  const [currentLivePlayer2, setCurrentLivePlayer2] = useState<any | null>(
    null
  );
   const [player1Dmg, setPlayer1Dmg] = useState<any | null>(
    null
  );

    const [player2Dmg, setPlayer2Dmg] = useState<any | null>(
    null
  );
  

  useEffect(() => {
    const initialPlayer1 = initialPlayers.player1;
    const initialPlayer2 = initialPlayers.player2;
    const livePlayer1 = livePlayers.player1;
    const livePlayer2 = livePlayers.player2;
    

    if (userId === initialPlayer1.userId) {
      setCurrentInitialPlayer1(initialPlayer1);
      setCurrentLivePlayer1(livePlayer1);
      setCurrentInitialPlayer2(initialPlayer2);
      setCurrentLivePlayer2(livePlayer2);
      setPlayer1Dmg(currentDamage)
      setPlayer2Dmg(opponentDamage)

    } else {
      setCurrentInitialPlayer1(initialPlayer2);
      setCurrentLivePlayer1(livePlayer2);
      setCurrentInitialPlayer2(initialPlayer1);
      setCurrentLivePlayer2(livePlayer1);
      setPlayer2Dmg(currentDamage)
      setPlayer1Dmg(opponentDamage)
    }
  }, [userId, initialPlayers, livePlayers]);

  const navigate = useNavigate();
  
  const [showEmoteBar, setShowEmoteBar] = useState(false);

  const [backgroundUrl, setBackgroundUrl] = useState(arena);

  const handleEmojiClick = (emojiSrc: string) => {
    socket.emit("emote", {emoji:emojiSrc, userId: userId, sessionID: sessionId});
     setShowEmoteBar(false);
  };

  const toggleEmoteBar = (toggle: boolean) => {
    setShowEmoteBar(toggle);
  };

  const attackAction = () => {
    socket.emit("attackAction", { userId: userId, sessionID: sessionId });
    playAudio(attackSound);
  };
  
  const defenceAction = () => {
    socket.emit("defendAction", { userId: userId, sessionID: sessionId });
    playAudio(defenseSound);
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
     

      <div className="flex gap-1 fixed top-[7rem] left-5 ">
        {currentLivePlayer1?.statusEffects?.map((effect, index) => (
          <div key={index}>
            <StatusEffectComponent statusEffects={effect?.type} />
          </div>
        ))}
      </div>

      <div className="flex gap-1 fixed top-[4.5rem] right-10 ">
        <EmoteBar
          handleEmojiClick={handleEmojiClick}
          setShowEmoteBar={toggleEmoteBar}
          showEmoteBar={showEmoteBar}
        />

        
      </div>
      {currentLivePlayer1 &&
        currentLivePlayer2 &&
        currentInitialPlayer1 &&
        currentInitialPlayer2 && (
          <>
            <PlayerInfo
              playerIcon={currentLivePlayer1.ProfileIMG}
              initialHealth={currentInitialPlayer1.health}
              liveHealth={currentLivePlayer1.health}
              mana={currentLivePlayer1.manaPool}
              initialMana={currentInitialPlayer1.manaPool}
              playerImage={currentLivePlayer1?.profileIMG}
              playerName={currentLivePlayer1?.username}
              isPlayerOne={true}
              isThePlayer={true}
            />
            <PlayerInfo
              playerIcon={currentLivePlayer2.ProfileIMG}
              initialHealth={currentInitialPlayer2.health}
              liveHealth={currentLivePlayer2.health}
              mana={currentLivePlayer2.manaPool}
              initialMana={currentInitialPlayer2.manaPool}
              playerImage={currentLivePlayer2?.profileIMG}
              playerName={currentLivePlayer2?.username}
              isPlayerOne={false}
              isThePlayer={false}
            />
          </>
        )}

      {/* center of the gamescreen  */}
      <div className={`flex justify-center items-center gap-[7rem] `}>
        {currentLivePlayer1?.activePet && (
          <ActiveBattleCardComp
            elements={currentLivePlayer1.activePet.petInfo.element}
            classy={currentLivePlayer1.activePet.petInfo.class}
            illustration={currentLivePlayer1.activePet.petInfo.illustration}
            name={currentLivePlayer1.activePet.petInfo.name}
            level={currentLivePlayer1.activePet.level}
            health={currentLivePlayer1.activePet.currentHealth}
            attack={currentLivePlayer1.activePet.currentAttack}
            defence={currentLivePlayer1.activePet.currentDefense}
            mana={currentLivePlayer1.activePet.currentManaCost}
            rarity={currentLivePlayer1.activePet.rarity}
            damageTaken={player1Dmg}
          />
        )}
        <span></span>
        {currentLivePlayer2?.activePet && (
          <ActiveBattleCardComp
            elements={currentLivePlayer2.activePet.petInfo.element}
            illustration={currentLivePlayer2.activePet.petInfo.illustration}
            classy={currentLivePlayer2.activePet.petInfo.class}
            name={currentLivePlayer2.activePet.petInfo.name}
            level={currentLivePlayer2.activePet.level}
            health={currentLivePlayer2.activePet.currentHealth}
            attack={currentLivePlayer2.activePet.currentAttack}
            defence={currentLivePlayer2.activePet.currentDefense}
            mana={currentLivePlayer2.activePet.currentManaCost}
            rarity={currentLivePlayer2.activePet.rarity}
            damageTaken={player2Dmg}
          />
        )}
      </div>

      <div className="deck-container ">
        <section className=" flex flex-col gap-3 fixed -bottom-[10rem] left-1/2 -translate-x-1/2  ">
          <div className="deck-info flex flex-col justify-center items-center ">
            <div className="flex items-center justify-center gap-4 flex-row">
              <ActionButton
                imgUrl={attack}
                handleClick={() => attackAction()}
                restStyles="hover:border-yellow-400 transition-all duration-300 ease-in-out"
              />
              <p className="font-bold font-mono">
                Deck size: {currentLivePlayer1?.currentDeck?.length}
              </p>

              <ActionButton
                imgUrl={defense}
                handleClick={() => defenceAction()}
                restStyles="hover:border-red-600 transition-all duration-300 ease-in-out"
              />
            </div>
          </div>
          <section className="flex gap-1 justify-center items-center">
            {currentLivePlayer1?.currentDeck?.slice(0, 5).map((card, index) => (
              <div
                key={index}
                className="battleCard relative  "
                style={{
                  transform: `rotate(${getRotation(index, 5) / 4}deg)`,
                }}
              >
                <BattleCardComp
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
                />
              </div>
            ))}
          </section>
        </section>
      </div>

      {/* discard pile */}
      <section className="flex gap-4 justify-center fixed scale-[0.85] grayscale  top-[40%] left-[6rem] ">
        {currentLivePlayer1?.discardPile.map((card, index) => (
          <div
            key={index}
            className="absolute transform -translate-x-1/2"
            style={{
              transform: `rotate(${getRotation(index, 5)}deg)`,
              left: `${index * 20}px`,
              zIndex: index,
            }}
          >
            <BattleCardComp
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
            />
          </div>
        ))}
      </section>
    </div>
  );
};

export default Battle;
