import React, { useEffect, useState } from "react";
import {
  MdOutlineWifi,
  MdOutlineWifi2Bar,
  MdOutlineWifi1Bar,
} from "react-icons/md";

interface PingBarProps {
  pingIN: number;
}

const PingBar: React.FC<PingBarProps> = ({ pingIN }) => {
  const [ping, setPing] = useState<number>(0);
  const [pingColor, setPingColor] = useState<string>("bg-green-500");
  const [PingIcon, setPingIcon] = useState<JSX.Element>(<MdOutlineWifi />);

  useEffect(() => {
    setPing(pingIN);
  }, [pingIN]);

  useEffect(() => {
    if (pingIN < 150) {
      setPingColor("text-emerald-500");
      setPingIcon(<MdOutlineWifi />);
    } else if (pingIN < 400) {
      setPingColor("text-amber-500");
      setPingIcon(<MdOutlineWifi2Bar />);
    } else {
      setPingColor("text-red-500");
      setPingIcon(<MdOutlineWifi1Bar />);
    }
  }, [pingIN]);

  return (
    <div className={`flex flex-col items-center ${pingColor} fixed top-[4rem] left-3`}>
      {PingIcon}
      <p className="text-[0.65rem] ">{ping} ms</p>
    </div>
  );
};

export default PingBar;
