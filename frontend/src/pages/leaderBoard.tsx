import React from "react";
import NumberCounter from "@/components/numberCounterprop";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import NavBarComp from "@/components/navBarComponent";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/types";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import HeaderComp from "@/components/headerComponent";
import { Badges } from "@/assets";
import { useQuery } from "@tanstack/react-query";
import { GiFlatPawPrint, GiCrown, GiTrophy } from "react-icons/gi";
import fetchUserLeaderboard from "@/services/userServices/userLeaderBoard";
import { Skeleton } from "@/components/ui/skeleton";

const UserLeaderboard: React.FC = () => {
  const { sortParam } = useParams();
  const [headerText, setHeaderText] = useState<String>("Level LeaderBoards");

  const [isPet, setIsPet] = useState(false);
  const [isWon, SetIsWon] = useState(false);

  const [isRank, SetIsRank] = useState(false);
  const [limit, SetLimit] = useState(10);

  const { toast } = useToast();
  const navigate = useNavigate();
  const userState: any | null = useSelector((state: RootState) => state.user);

  const accessTokenState: any | null = useSelector(
    (state: RootState) => state.accessToken
  );
  const refreshTokenState: any | null = useSelector(
    (state: RootState) => state.refreshToken
  );

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["userLeaderBaords", limit, sortParam, userState.userInfo._id],
    queryFn: () =>
      fetchUserLeaderboard({
        limit: limit, // Provide appropriate values
        sortParam: sortParam, // Provide appropriate values
        userId: userState?.userInfo?._id, // Replace with actual userId
      }),
  });

  const paramsCheck = (Param) => {
    switch (Param) {
      case "pet":
        setHeaderText(`on The Pets Rankings`);
        setIsPet(true);
        SetIsWon(false);
        SetIsRank(false);
        break;
      case "duelwon":
        setHeaderText("on The Duels Won Rankings");
        setIsPet(false);
        SetIsWon(true);

        SetIsRank(false);
        break;

      case "rank":
        setHeaderText("on The Player Rankings");
        setIsPet(false);
        SetIsWon(false);

        SetIsRank(true);
        break;
      default:
        setHeaderText("on The Leaderboard");
        break;
    }
  };
  useEffect(() => {
    const currentPath = window.location.pathname.split("/").pop();
    paramsCheck(currentPath);
  }, []);

  const getTabStyles = (Num) => {
    if (Num === 1) {
      return "border-yellow-500"; // Gold
    } else if (Num === 2) {
      return "border-gray-400"; // Silver
    } else if (Num === 3) {
      return "border-yellow-800"; // Bronze
    } else if (Num === 4) {
      return "border-gray-600"; // Onyx (stone-like)
    } else if (Num === 5) {
      return "border-green-600"; // Wood (green and nature-groundy)
    } else {
      return "border-muted";
    }
  };

  useEffect(() => {
    if (!userState.userInfo || !refreshTokenState.userRefreshToken) {
      toast({
        variant: "warning",
        description: "user needs to login",
      });
      navigate("/login");
    }
  }, [
    navigate,
    userState.userInfo,
    refreshTokenState.userRefreshToken,
    accessTokenState.userAccessToke,
  ]);
  return (
    <>
      <div className="h-screen leaderBoardBg">
        <header className="w-full  h-fit relative  backdrop-blur-sm overflow-hidden ">
          <div className="w-full lg:px-6 px-4  h-[50px] bg-accent-foreground backdrop-filter backdrop-blur-md blur-sm opacity-[0.02] bg-opacity-10"></div>
          <nav className="lg:px-6 px-4 absolute top-0 w-full backdrop-blur-sm overflow-hidden ">
            <HeaderComp userState={userState} />
          </nav>
        </header>
        <main className="">
          <section className="mx-4  flex flex-wrap justify-between items-start">
            <section className="mt-10 lg:w-[18vw] hidden  w-full h-fit lg:flex flex-col gap-2 p-4 border-[2px] border-gray-400 bg-white backdrop-filter backdrop-blur-lg bg-opacity-10 text-secondary-foreground shadow-sm rounded-lg">
              <div className="flex h-fit items-center gap-2">
                <h1 className="text-md font-medium pl-2 ">Filters </h1>
              </div>
              <section className="flex flex-row flex-wrap md:flex-col gap-2 mb-2">
                <div
                  onClick={() => {
                    navigate("/leaderboard/duelwon");
                    paramsCheck("duelwon");
                  }}
                  className={`flex h-fit transition-all duration-300 ease-in-out items-center group gap-3 py-[0.45rem] px-3 rounded-sm ${
                    isWon
                      ? "bg-black bg-opacity-30"
                      : "hover:bg-black hover:bg-opacity-30"
                  }`}
                >
                  <div
                    className={`md:h-7 md:w-7 rotate-[45deg]  h-7 w-7 text-xl md:text-md flex justify-center items-center backdrop-filter transition-all duration-300 ease-in-out backdrop-blur-lg rounded-sm ${
                      isWon
                        ? "bg-primary border-[1px] border-white bg-opacity-90"
                        : "bg-zinc-400 bg-opacity-10 group-hover:bg-opacity-90 group-hover:bg-primary"
                    }`}
                  >
                    <span className="-rotate-[45deg] text-[0.9rem]">
                      <GiTrophy />
                    </span>
                  </div>
                  <h1 className="text-md md:hidden inline-block">Wins</h1>
                  <h1 className="text-md hidden md:inline-block">Duels Won</h1>
                </div>
                <div
                  onClick={() => {
                    navigate("/leaderboard/pet");
                    paramsCheck("pet");
                  }}
                  className={`flex h-fit transition-all duration-300 ease-in-out items-center group gap-3 py-[0.45rem] px-3 rounded-sm ${
                    isPet
                      ? "bg-black bg-opacity-30"
                      : "hover:bg-black hover:bg-opacity-30"
                  }`}
                >
                  <div
                    className={`md:h-7 md:w-7 rotate-[45deg]  h-7 w-7 text-xl md:text-md flex justify-center items-center backdrop-filter transition-all duration-300 ease-in-out backdrop-blur-lg rounded-sm ${
                      isPet
                        ? "bg-primary border-[1px] border-white bg-opacity-90"
                        : "bg-zinc-400 bg-opacity-10 group-hover:bg-opacity-90 group-hover:bg-primary"
                    }`}
                  >
                    <span className="-rotate-[45deg] text-[0.9rem]">
                      <GiFlatPawPrint />
                    </span>
                  </div>
                  <h1 className="text-md md:hidden inline-block">Pets</h1>
                  <h1 className="text-md hidden md:inline-block">Top Pets</h1>
                </div>

                <div
                  onClick={() => {
                    navigate("/leaderboard/rank");
                    paramsCheck("rank");
                  }}
                  className={`flex h-fit transition-all duration-300 ease-in-out items-center group gap-3 py-[0.45rem] px-3 rounded-sm ${
                    isRank
                      ? "bg-black bg-opacity-30"
                      : "hover:bg-black hover:bg-opacity-30"
                  }`}
                >
                  <div
                    className={`md:h-7 md:w-7 h-7 w-7  rotate-[45deg] text-xl md:text-md  flex justify-center items-center backdrop-filter transition-all duration-300 ease-in-out backdrop-blur-lg rounded-sm ${
                      isRank
                        ? "bg-primary border-[1px] border-white bg-opacity-90"
                        : "bg-zinc-400 bg-opacity-10 group-hover:bg-opacity-90 group-hover:bg-primary"
                    }`}
                  >
                    <span className="-rotate-[45deg] text-[0.9rem]">
                      <GiCrown />
                    </span>
                  </div>
                  <h1 className="text-md md:hidden inline-block">Rank</h1>
                  <h1 className="text-md hidden md:inline-block">Rankings</h1>
                </div>
              </section>
              <div className="flex h-fit items-center gap-2">
                <h1 className="text-md font-medium pl-2 ">Limits </h1>
              </div>

              <section className="flex px-2 py-[0.45rem] gap-2  items-center flex-wrap ">
                <button
                  onClick={() => {
                    SetLimit(10);
                  }}
                  className={`p-1 font-bold  rounded-sm text-xs min-w-7 h-7 transition-all duration-300  ease-in-out ${
                    limit === 10
                      ? "bg-primary bg-opacity-30 border-[1px] border-white hover:scale-105"
                      : "bg-black bg-opacity-30  hover:bg-primary hover:scale-105"
                  }`}
                >
                  10
                </button>
                <button
                  onClick={() => {
                    SetLimit(25);
                  }}
                  className={`p-1 font-bold  rounded-sm text-xs min-w-7 h-7 transition-all duration-300  ease-in-out ${
                    limit === 25
                      ? "bg-primary bg-opacity-30 border-[1px] border-white hover:scale-105"
                      : "bg-black bg-opacity-30 hover:bg-primary hover:scale-105"
                  }`}
                >
                  25
                </button>
                <button
                  onClick={() => {
                    SetLimit(50);
                  }}
                  className={`p-1 font-bold  rounded-sm text-xs min-w-7 h-7 transition-all duration-300  ease-in-out ${
                    limit === 50
                      ? "bg-primary bg-opacity-30 border-[1px] border-white hover:scale-105"
                      : "bg-black bg-opacity-30 hover:bg-primary hover:scale-105"
                  }`}
                >
                  50
                </button>
                <button
                  onClick={() => {
                    SetLimit(100);
                  }}
                  className={`p-1 font-bold  rounded-sm text-xs min-w-7 h-7 transition-all duration-300  ease-in-out ${
                    limit === 100
                      ? "bg-primary bg-opacity-30 border-[1px] border-white hover:scale-105"
                      : "bg-black bg-opacity-30 hover:bg-primary hover:scale-105"
                  }`}
                >
                  100
                </button>

                <button
                  onClick={() => {
                    SetLimit(150);
                  }}
                  className={`p-1 font-bold  rounded-sm text-xs min-w-7 h-7 transition-all duration-300  ease-in-out ${
                    limit === 150
                      ? "bg-primary bg-opacity-30 border-[1px] border-white hover:scale-105"
                      : "bg-black bg-opacity-30 hover:bg-primary hover:scale-105"
                  }`}
                >
                  150
                </button>
                <button
                  onClick={() => {
                    SetLimit(200);
                  }}
                  className={`p-1 font-bold  rounded-sm text-xs min-w-7 h-7 transition-all duration-300  ease-in-out ${
                    limit === 200
                      ? "bg-primary bg-opacity-30 border-[1px] border-white hover:scale-105"
                      : "bg-black bg-opacity-30 hover:bg-primary hover:scale-105"
                  }`}
                >
                  200
                </button>
              </section>
            </section>
            <section className="lg:w-[76vw] lg:mt-2 md:w-[95vw] w-[90vw]  flex flex-col  gap-1 h-fit justify-center items-start relative">
              <div className="flex h-fit items-center gap-5">
                <div className="h-6 w-1 bg-primary  rounded-md transition-all duration-400 ease-in-out"></div>
                <h1 className="text-2xl h-[64px] md:h-fit lg:text-xl font-bold ">
                  Top {limit} {headerText}{" "}
                </h1>
              </div>
              <section className="lg:w-[18vw] my-2 lg:hidden w-full h-fit flex flex-col gap-2 p-2 border-[2px] border-gray-400 bg-white backdrop-filter backdrop-blur-lg bg-opacity-10  text-secondary-foreground shadow-sm rounded-lg">
                <div className="flex h-fit items-center gap-2">
                  <h1 className="text-md font-medium pl-2 ">Filters </h1>
                </div>
                <section className="flex flex-row flex-wrap md:flex-col gap-2 mb-2">
                  <div
                    onClick={() => {
                      navigate("/leaderboard/duelwon");
                      paramsCheck("duelwon");
                    }}
                    className={`flex  h-fit transition-all duration-300 ease-in-out items-center group gap-3 py-[0.45rem] px-3 rounded-sm ${
                      isWon
                        ? "bg-black bg-opacity-30"
                        : "hover:bg-black hover:bg-opacity-30"
                    }`}
                  >
                    <div
                      className={`md:h-7 md:w-7  rotate-[45deg] h-7 w-7 text-xl md:text-md flex justify-center items-center backdrop-filter transition-all duration-300 ease-in-out backdrop-blur-lg rounded-sm ${
                        isWon
                          ? "bg-primary border-[1px] border-white bg-opacity-90"
                          : "bg-zinc-400 bg-opacity-10 group-hover:bg-opacity-90 group-hover:bg-primary"
                      }`}
                    >
                      <span className="-rotate-[45deg] text-[0.9rem]">
                        <GiTrophy />
                      </span>
                    </div>
                    <h1 className="text-md md:hidden inline-block">Wins</h1>
                    <h1 className="text-md hidden md:inline-block">
                      Duels Won
                    </h1>
                  </div>
                  <div
                    onClick={() => {
                      navigate("/leaderboard/pet");
                      paramsCheck("pet");
                    }}
                    className={`flex h-fit transition-all duration-300 ease-in-out items-center group gap-3 py-[0.45rem] px-3 rounded-sm ${
                      isPet
                        ? "bg-black bg-opacity-30"
                        : "hover:bg-black hover:bg-opacity-30"
                    }`}
                  >
                    <div
                      className={`md:h-7 md:w-7  rotate-[45deg] h-7 w-7 text-xl md:text-md flex justify-center items-center backdrop-filter transition-all duration-300 ease-in-out backdrop-blur-lg rounded-sm ${
                        isPet
                          ? "bg-primary border-[1px] border-white bg-opacity-90"
                          : "bg-zinc-400 bg-opacity-10 group-hover:bg-opacity-90 group-hover:bg-primary"
                      }`}
                    >
                      <span className="-rotate-[45deg] text-[0.9rem]">
                        <GiFlatPawPrint />
                      </span>
                    </div>
                    <h1 className="text-md md:hidden inline-block">Pets</h1>
                    <h1 className="text-md hidden md:inline-block">Top Pets</h1>
                  </div>

                  <div
                    onClick={() => {
                      navigate("/leaderboard/rank");
                      paramsCheck("rank");
                    }}
                    className={`flex h-fit transition-all duration-300 ease-in-out items-center group gap-3 py-[0.45rem] px-3 rounded-sm ${
                      isRank
                        ? "bg-black bg-opacity-30"
                        : "hover:bg-black hover:bg-opacity-30"
                    }`}
                  >
                    <div
                      className={`md:h-7 md:w-7 h-7 w-7 rotate-[45deg] text-xl md:text-md  flex justify-center items-center backdrop-filter transition-all duration-300 ease-in-out backdrop-blur-lg rounded-sm ${
                        isRank
                          ? "bg-primary bg-opacity-90"
                          : "bg-zinc-400 bg-opacity-10 group-hover:bg-opacity-90 group-hover:bg-primary"
                      }`}
                    >
                      <span className="-rotate-[45deg] text-[0.9rem]">
                        <GiCrown />
                      </span>
                    </div>
                    <h1 className="text-md md:hidden inline-block">Rank</h1>
                    <h1 className="text-md hidden md:inline-block">Rankings</h1>
                  </div>
                </section>
                <div className="flex h-fit items-center gap-2">
                  <h1 className="text-md font-medium pl-2 ">Limits </h1>
                </div>

                <section className="flex gap-2 px-2 py-[0.45rem]  items-center flex-wrap ">
                  <button
                    onClick={() => {
                      SetLimit(10);
                    }}
                    className={`p-1 font-bold  rounded-sm text-xs min-w-7 h-7 transition-all duration-300  ease-in-out ${
                      limit === 10
                        ? "bg-primary  bg-opacity-30 border-[1px] border-white  hover:scale-105"
                        : "bg-black bg-opacity-30 hover:bg-primary hover:scale-105"
                    }`}
                  >
                    10
                  </button>
                  <button
                    onClick={() => {
                      SetLimit(25);
                    }}
                    className={`p-1 font-bold  rounded-sm text-xs min-w-7 h-7 transition-all duration-300  ease-in-out ${
                      limit === 25
                        ? "bg-primary bg-opacity-30 border-[1px] border-white hover:scale-105"
                        : "bg-black bg-opacity-30 hover:bg-primary hover:scale-105"
                    }`}
                  >
                    25
                  </button>
                  <button
                    onClick={() => {
                      SetLimit(50);
                    }}
                    className={`p-1 font-bold  rounded-sm text-xs min-w-7 h-7 transition-all duration-300  ease-in-out ${
                      limit === 50
                        ? "bg-primary bg-opacity-30 border-[1px] border-white hover:scale-105"
                        : "bg-black bg-opacity-30 hover:bg-primary hover:scale-105"
                    }`}
                  >
                    50
                  </button>
                  <button
                    onClick={() => {
                      SetLimit(100);
                    }}
                    className={`p-1 font-bold  rounded-sm text-xs min-w-7 h-7 transition-all duration-300  ease-in-out ${
                      limit === 100
                        ? "bg-primary bg-opacity-30 border-[1px] border-white hover:scale-105"
                        : "bg-black bg-opacity-30 hover:bg-primary hover:scale-105"
                    }`}
                  >
                    100
                  </button>

                  <button
                    onClick={() => {
                      SetLimit(150);
                    }}
                    className={`p-1 font-bold  rounded-sm text-xs min-w-7 h-7 transition-all duration-300  ease-in-out ${
                      limit === 150
                        ? "bg-primary bg-opacity-30 border-[1px] border-white hover:scale-105"
                        : "bg-black bg-opacity-30 hover:bg-primary hover:scale-105"
                    }`}
                  >
                    150
                  </button>
                  <button
                    onClick={() => {
                      SetLimit(200);
                    }}
                    className={`p-1 font-bold  rounded-sm text-xs min-w-7 h-7 transition-all duration-300  ease-in-out ${
                      limit === 200
                        ? "bg-primary  bg-opacity-30 border-[1px] border-white hover:scale-105"
                        : "bg-black bg-opacity-30 hover:bg-primary hover:scale-105"
                    }`}
                  >
                    200
                  </button>
                </section>
              </section>
              <section className="flex flex-col gap-2  w-full py-2 px-2 justify-center items-center bgLeaderBoard ">
                {isLoading ? (
                  <Skeleton className="h-12  w-full md:w-[98%] rounded-xl" />
                ) : (
                  <section
                    className={`w-full md:w-[98%] border-[1px] flex justify-between items-center bg-white backdrop-filter backdrop-blur-lg bg-opacity-20 transition-all duration-400 ease-in-out p-1 rounded-[0.75rem] ${getTabStyles(
                      1 + 1
                    )}`}
                  >
                    <div className="flex w-fit gap-4 items-center">
                      <div className="w-12 h-12 relative">
                        {1 + 1 <= 5 && (
                          <img
                            src={Badges[`No${1}`]}
                            alt="User Avatar"
                            className="w-full object-center object-cover h-full rounded-sm"
                            fetchpriority="high"
                            loading="lazy"
                          />
                        )}
                      </div>
                      <Button
                        variant="secondary"
                        className="w-12 h-12 rounded-sm p-0"
                      >
                        <img
                          src={data.userInfo.profile.avatar}
                          alt={data.userInfo.username}
                          className="w-full object-center object-cover h-full rounded-sm"
                          fetchpriority="high"
                          loading="lazy"
                        />
                      </Button>
                      <div className="flex flex-col justify-center items-start">
                        <p className="text-md p-0 leading-tight">
                          you
                          <span className="text-xs text-mute">
                            ({data.userInfo.username})
                          </span>
                        </p>

                        <p
                          className={`text-md p-0 leading-tight  text-muted-foreground    font-extrabold   `}
                        >
                          #{data.userPosition}
                        </p>
                      </div>
                      <p className=" min-w-12  text-left hidden md:inline-block text-sm text-muted-foreground  capitalize ">
                        <span className="text-white font-bold">
                          <NumberCounter
                            number={data.userInfo.userStats.duelsWon}
                          />
                        </span>{" "}
                        duels won
                      </p>
                      <p className=" min-w-12  text-left hidden md:inline-block text-sm text-muted-foreground  capitalize ">
                        <span className="text-white font-bold">
                          <NumberCounter
                            number={
                              data.userInfo.userStats.duelsWon +
                              data.userInfo.userStats.duelsLost
                            }
                          />
                        </span>{" "}
                        matches played
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <img
                        src={Badges[data.userInfo.playerRank]}
                        alt={data.userInfo.username}
                        className="w-12 h-12 object-center object-cover rounded-sm"
                        fetchpriority="high"
                        loading="lazy"
                      />
                      <h1 className="text-xs font-semibold text-right w-[4.5rem] bg-black bg-opacity-40 h-fit px-2 py-[2px] rounded-sm hidden md:inline-block">
                        {data.userInfo.userStats.Duelpoints}
                      </h1>
                    </div>
                  </section>
                )}
                <section className=" flex gap-2 flex-wrap justify-center w-full md:w-[98%] px-2 py-3">
                  {isLoading ? (
                    <>
                      {Array(3)
                        .fill()
                        .map((_, index) => (
                          <div
                            key={index}
                            className="flex flex-col w-full md:w-[32%]  space-y-3"
                          >
                            <Skeleton className="h-[9.5rem] bg-white backdrop-filter backdrop-blur-lg bg-opacity-10 border-[1px]  w-full rounded-xl" />
                          </div>
                        ))}
                    </>
                  ) : (
                    <>
                      {data?.leaderBoard.slice(0, 3).map((item, index) => (
                        <Link
                          to={`/user-profile/${item?._id}`}
                          key={item._id}
                          className={`md:w-[32%] w-full h-[10rem] p-2 bg-white backdrop-filter backdrop-blur-lg bg-opacity-10 border-[1px] flex flex-col justify-center  items-center gap-3 rounded-[0.75rem] ${getTabStyles(
                            index + 1
                          )}`}
                        >
                          <div className="flex items-start w-full justify-between ">
                            <div className="flex gap-2 items-start">
                              <Button
                                variant="secondary"
                                className="w-16 h-16 rounded-sm p-0 relative"
                              >
                                <img
                                  src={item.profile.avatar}
                                  alt={item.username}
                                  className="w-full h-full object-center object-cover rounded-sm"
                                  fetchpriority="high"
                                  loading="lazy"
                                />
                              </Button>

                              <div className="flex flex-col w-[40%] justify-center items-start">
                                <p className="text-md  line-clamp-2">
                                  {item.username}
                                </p>
                                <h1
                                  className={`text-md text-muted-foreground  flex items-center justify-center    w-6 h-6 text-center  font-bold p-1 rounded-full `}
                                >
                                  #{index + 1}
                                </h1>
                              </div>
                            </div>

                            <div className="w-12 h-12 flex-col justify-center items-center">
                              <img
                                src={Badges[`No${index + 1}`]}
                                alt={`No${index + 1}`}
                                className="w-full h-full object-center object-cover rounded-sm"
                                fetchpriority="high"
                                loading="lazy"
                              />
                            </div>
                          </div>

                          <div className="w-full flex">
                            <img
                              src={Badges[item.playerRank]}
                              alt={item.playerRank}
                              className="w-12 h-12 object-center object-cover rounded-sm"
                              fetchpriority="high"
                              loading="lazy"
                            />
                            <div className="flex w-1/4 flex-col  justify-center items-center">
                              <p className="text-muted-foreground uppercase text-sm">
                                WINS
                              </p>

                              <p className=" uppercase   text-sm text-center font-bold">
                                {" "}
                                <NumberCounter
                                  number={item.userStats.duelsWon}
                                />
                              </p>
                            </div>
                            <div className="flex w-1/4 flex-col  justify-center items-center">
                              <p className="text-muted-foreground uppercase text-sm">
                                Matches
                              </p>

                              <p className=" uppercase text-sm text-center font-bold">
                                {" "}
                                <NumberCounter
                                  number={
                                    item.userStats.duelsWon +
                                    item.userStats.duelsLost
                                  }
                                />
                              </p>
                            </div>
                            <div className="flex w-1/4 flex-col  justify-center items-center">
                              <p className="text-muted-foreground uppercase text-sm">
                                Points
                              </p>

                              <p className=" uppercase text-sm text-center font-bold">
                                {" "}
                                <NumberCounter
                                  number={item.userStats.Duelpoints}
                                />
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </>
                  )}
                </section>

                <div
                  className={`bg-white backdrop-filter backdrop-blur-lg px-2 bg-opacity-10 border-[1px] w-full md:w-[98%] flex justify-between items-center border-gray-400  transition-all duration-400 ease-in-out p-1 rounded-[0.75rem]`}
                >
                  <div className="flex w-fit gap-4 items-center">
                    <div className="w-12  relative"></div>

                    <p className="w-12  text-md p-0 leading-tight  text-muted-foreground    font-extrabold    ">
                      Players
                    </p>
                    <div className="w-12  hidden md:inline-block "></div>

                    <p className=" w-12 hidden md:inline-block text-md p-0 leading-tight  text-muted-foreground    font-extrabold ">
                      Wins
                    </p>
                    <p className=" w-12  hidden md:inline-block text-left text-md p-0 leading-tight  text-muted-foreground    font-extrabold  ">
                      Matches
                    </p>
                  </div>
                  <div className="flex items-center  gap-3">
                    <p className=" w-12 pl-4 md:pl-0  text-left text-md p-0 leading-tight  text-muted-foreground    font-extrabold  ">
                      Rank
                    </p>
                    <p className=" w-12  hidden md:inline-block text-left text-md p-0 leading-tight  text-muted-foreground    font-extrabold  ">
                      Points
                    </p>
                  </div>
                </div>
              </section>

              <div className="w-full  flex flex-col items-center gap-2 max-h-[60rem] overflow-auto">
                {isLoading ? (
                  <>
                    {Array(6)
                      .fill()
                      .map((_, index) => (
                        <div key={index} className="w-full ">
                          <Skeleton className="h-12 p-2 w-full md:w-[98%] border-[1px] rounded-[0.75rem]" />
                        </div>
                      ))}
                  </>
                ) : (
                  <>
                    {data?.leaderBoard.slice(3).map((item, index) => {
                      const OriginalIndex = index + 3; // Calculate the original index
                      return (
                        <Link
                          key={item.id}
                          to="/user-profile" // Provide the correct path here
                          className={`w-full md:w-[98%] border-[1px] flex justify-between items-center bg-muted transition-all duration-400 ease-in-out p-1 rounded-[0.75rem] ${getTabStyles(
                            OriginalIndex + 1
                          )}`}
                        >
                          <div className="flex w-fit gap-4 items-center">
                            <div className="w-12 h-12 relative">
                              {OriginalIndex + 1 <= 5 && (
                                <img
                                  src={Badges[`No${OriginalIndex + 1}`]}
                                  alt={`No${OriginalIndex + 1}`}
                                  className="w-full object-center object-cover h-full rounded-sm"
                                  fetchpriority="high"
                                  loading="lazy"
                                />
                              )}
                            </div>
                            <Button
                              variant="secondary"
                              className="w-12 h-12 rounded-sm p-0"
                            >
                              <img
                                src={item.profile.avatar}
                                alt={item.username}
                                className="w-full object-center object-cover h-full rounded-sm"
                                fetchpriority="high"
                                loading="lazy"
                              />
                            </Button>
                            <div className="flex flex-col justify-center items-start">
                              <p className="text-md p-0 leading-tight">
                                {item.username}
                              </p>

                              <p
                                className={`text-md p-0 leading-tight  text-muted-foreground    font-extrabold   `}
                              >
                                #{OriginalIndex + 1}
                              </p>
                            </div>
                            <p className=" w-12  text-left hidden md:inline-block text-sm text-muted-foreground  capitalize ">
                              <NumberCounter number={item.userStats.duelsWon} />
                            </p>
                            <p className=" w-12  text-left hidden md:inline-block text-sm text-muted-foreground  capitalize ">
                              <NumberCounter
                                number={
                                  item.userStats.duelsWon +
                                  item.userStats.duelsLost
                                }
                              />
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <img
                              src={Badges[item.playerRank]}
                              alt={item.playerRank}
                              className="w-12 object-center object-cover h-12 rounded-sm"
                              fetchpriority="high"
                              loading="lazy"
                            />
                            <h1 className="text-xs font-semibold text-right w-[4.5rem] bg-black bg-opacity-40 h-fit px-2 py-[2px] rounded-sm hidden md:inline-block">
                              {item.userStats.Duelpoint}
                            </h1>
                          </div>
                        </Link>
                      );
                    })}
                  </>
                )}
              </div>
            </section>
          </section>
        </main>
        <NavBarComp
          accessTokenState={accessTokenState}
          refreshTokenState={refreshTokenState}
          userState={userState}
        />
      </div>
    </>
  );
};

export default UserLeaderboard;
