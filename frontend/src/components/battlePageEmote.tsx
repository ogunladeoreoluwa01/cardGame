import React, { useEffect, useState } from "react";
import { GiChatBubble } from "react-icons/gi";
import styles from "../styles/styles";
import { emojiArray } from "@/assets";

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
        <div className={`${styles.glassEffect} rounded-md  `}>
          <button
            onClick={() => setShowEmoteBar((prev) => !prev)}
            className="flex items-center justify-center p-[0.35rem] cursor-pointer rounded-md text-neutral-500 hover:text-neutral-100 hover:border-foreground font-medium relative z-[9999999999] data-[tooltip]:after:content-[attr(data-tooltip)] data-[tooltip]:after:mt-2 data-[tooltip]:after:text-sm data-[tooltip]:after:invisible data-[tooltip]:after:scale-50 data-[tooltip]:after:origin-top data-[tooltip]:after:opacity-0 hover:data-[tooltip]:after:visible hover:data-[tooltip]:after:opacity-100 hover:data-[tooltip]:after:scale-100 data-[tooltip]:after:transition-all data-[tooltip]:after:absolute data-[tooltip]:after:bg-white data-[tooltip]:after:top-[calc(100%+4px)] data-[tooltip]:after:left-1/2 data-[tooltip]:after:-translate-x-1/2 data-[tooltip]:after:-z-[1] data-[tooltip]:after:px-2.5 data-[tooltip]:after:py-1 data-[tooltip]:after:min-h-fit data-[tooltip]:after:min-w-fit data-[tooltip]:after:rounded-md data-[tooltip]:after:drop-shadow data-[tooltip]:before:mt-2 data-[tooltip]:before:drop-shadow data-[tooltip]:after:text-center data-[tooltip]:after:text-zinc-800 data-[tooltip]:after:whitespace-nowrap data-[tooltip]:after:text-[10px] data-[tooltip]:before:invisible data-[tooltip]:before:opacity-0 hover:data-[tooltip]:before:visible hover:data-[tooltip]:before:opacity-100 data-[tooltip]:before:transition-all data-[tooltip]:before:bg-white data-[tooltip]:before:[clip-path:polygon(50%_0,0_100%,100%_100%)] data-[tooltip]:before:absolute data-[tooltip]:before:top-full data-[tooltip]:before:left-1/2 data-[tooltip]:before:-translate-x-1/2 data-[tooltip]:before:z-0 data-[tooltip]:before:w-3 data-[tooltip]:before:h-[4px]"
          >
            <GiChatBubble />
          </button>
        </div>
        {showEmoteBar && (
          <div
            className={`${styles.glassEffect}  rounded-md w-[10rem] h-[10rem] p-[0.35rem] flex flex-wrap gap-[0.35rem] overflow-auto `}
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
