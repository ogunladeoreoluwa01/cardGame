import React, { useState } from "react";
import { statusEffectMap } from "@/assets"; // Adjust the import path as necessary
import styles from "../styles/styles";

interface StatusEffectProps {
  statusEffects?:string; // Make statusEffects optional
}

const StatusEffectComponent: React.FC<StatusEffectProps> = ({
  statusEffects = "" // Provide a default value
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<boolean | null>(false);
   const statusEffectSrc = statusEffectMap[statusEffects];
  return (
    <div className="flex flex-wrap gap-1 ">
      <div
        className="relative"
        onMouseOver={() => {
          setHoveredIndex(true);
        }}
        onMouseLeave={() => {
          setHoveredIndex(false);
        }}
      >
        <div
          className={`${styles.glassEffect} rounded-md w-[30px] h-[30px] p-[0.35rem] flex justify-center items-center`}
        >
          <img
            src={statusEffectSrc}
            alt={statusEffects}
            style={{ cursor: "pointer" }}
            className="scale-[1.5]"
          />
        </div>
        {hoveredIndex?(
          <div
            className={`${styles.glassEffect} animate-slide-down rounded-md p-[0.35rem] text-[0.7rem] font-bold text-white capitalize absolute -bottom-[2rem] left-1/2 `}
          >
            {statusEffects}
          </div>
        ):null}
      </div>
    </div>
  );
};

export default StatusEffectComponent;
