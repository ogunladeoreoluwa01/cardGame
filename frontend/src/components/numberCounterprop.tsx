// NumberCounter.tsx
import React from "react";

interface NumberCounterProps {
  number: number;
}

const NumberCounter: React.FC<NumberCounterProps> = ({ number }) => {
  const formatNumber = (num: number): string => {
    if(num){
   if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, "")}m`;
    }
    if (num >= 1_000) {
      return `${(num / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
    }
    return num.toString();
  }else{
    return '0';
  }
    }
 

  return <span>{formatNumber(number)}</span>;
};

export default NumberCounter;
