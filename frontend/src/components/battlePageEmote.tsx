import React, { useEffect, useState } from "react";
import { GiChatBubble } from "react-icons/gi";
import styles from "../styles/styles";
import { emojiArray } from "@/assets";
import { Socket } from "socket.io-client";

interface EmoteBarProps {
  handleEmojiClick: (emojiSrc: string) => void;
  showEmoteBar:boolean;
  setShowEmoteBar:(toggle)=> void;
}

const EmoteBar: React.FC<EmoteBarProps> = ({
  handleEmojiClick,
  showEmoteBar,
  setShowEmoteBar,
}) => {
  return (
    <>
      <section className="flex flex-col items-end gap-2">
        <div className={`${styles.glassEffect} rounded-md w-[30px] h-[30px] `}>
          <button
            onClick={() => setShowEmoteBar((prev) => !prev)}
            className="flex text-lg items-center justify-center p-[0.35rem] cursor-pointer rounded-md text-neutral-400 hover:text-neutral-100 hover:border-foreground font-medium relative z-[9999999999] transition-all  duration-300 ease-in"
          >
            <GiChatBubble />
          </button>
        </div>
        {showEmoteBar && (
          <div
            className={`${styles.glassEffect} slide-in-blurred-top  rounded-md w-[10rem] h-[10rem] p-[0.35rem] flex flex-wrap gap-[0.35rem] overflow-auto `}
          >
            {" "}
            {emojiArray.map((emojiSrc, index) => (
              <img
                key={index}
                src={emojiSrc}
                alt={`emoji-${index + 1}`}
                onClick={() => handleEmojiClick(emojiSrc)}
                style={{ cursor: "pointer" }}
                className="w-6 h-6"
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default EmoteBar;
