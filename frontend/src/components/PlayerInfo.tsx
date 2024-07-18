import React from 'react';
import styles from '../styles/styles';

const getHealthBarColor = (healthPercentage: number): string => {
  if (healthPercentage >= 90) return 'bg-green-500';
  if (healthPercentage >= 80) return 'bg-green-400';
  if (healthPercentage >= 70) return 'bg-yellow-400';
  if (healthPercentage >= 60) return 'bg-yellow-300';
  if (healthPercentage >= 50) return 'bg-orange-400';
  if (healthPercentage >= 40) return 'bg-orange-300';
  if (healthPercentage >= 30) return 'bg-orange-200';
  if (healthPercentage >= 20) return 'bg-red-400';
  if (healthPercentage >= 10) return 'bg-red-300';
  return 'bg-red-500';
};

interface PlayerInfoProps {
  player: {
    health: number;
    mana?: number;
  };
  playerIcon: string;
  mt?: boolean;
  initialHealth: number;
  liveHealth: number;
  isPlayerOne: boolean;
  isThePlayer: boolean;
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({ player, playerIcon, mt = false, initialHealth, liveHealth, isPlayerOne,isThePlayer}) => {
  const healthPercentage = (liveHealth / initialHealth) * 100;

  return (
    <div
      className={`flex items-center justify-center fixed ${
        mt ? "mt-4" : "mb-4"
      } ${isPlayerOne ? " left-6 top-4" : " right-8 top-4 flex-row-reverse"}`}
    >
      <img
        src={playerIcon}
        alt="player"
        className="w-12 h-12 object-contain rounded-full"
      />

      <div className={`${styles.playerHealth}   relative`}>
        <div
          className={`${styles.playerHealthBar} ${getHealthBarColor(
            healthPercentage
          )} ${styles.flexCenter} transition-all duration-200 ease-linear`}
          style={{ width: `${healthPercentage}%` }}
        ></div>
        {healthPercentage < 60 && (
          <span className="text-white absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-[0.75rem]">
            {liveHealth}
          </span>
        )}
      </div>

      {isThePlayer?  <div
        className={`${styles.flexCenter} ${styles.glassEffect} ${styles.playerMana}`}
      >
        {player.mana || 0}
      </div>:<></>}
     
    </div>
  );
};


export default PlayerInfo;
