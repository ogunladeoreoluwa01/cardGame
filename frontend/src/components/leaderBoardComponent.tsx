import React, { useState } from "react";
import NumberCounter from "./numberCounterprop";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badges } from "@/assets";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import fetchUserLeaderboard from "@/services/userServices/userLeaderBoard";
import { Skeleton } from "@/components/ui/skeleton";

function LeaderBoards() {
  const initialVisibleItems = 5;
  const [visibleItems, setVisibleItems] = useState(initialVisibleItems); // Initial number of visible items
  const [expanded, setExpanded] = useState(false);
  const userState: any | null = useSelector((state: RootState) => state.user);

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["userLeaderBaords", 10, "duelwon", userState.userInfo._id],
    queryFn: () =>
      fetchUserLeaderboard({
        limit: 10, // Provide appropriate values
        sortParam: "duelwon", // Provide appropriate values
        userId: userState?.userInfo?._id, // Replace with actual userId
      }),
  });

  const handleSeeMore = () => {
    if (expanded) {
      setVisibleItems(initialVisibleItems);
    } else {
      setVisibleItems(items.length);
    }
    setExpanded(!expanded);
  };

  return (
    <section className="lg:w-[27vw] lg:mt-2 md:w-[96.5vw] w-[96.5vw] flex flex-col gap-2 h-fit relative">
      <div className="mb-2 flex w-full items-center justify-between">
        <h1 className="uppercase font-bold text-sm">The LeaderBoards</h1>
        <Link
          to="/leaderboard/duelwon"
          className="text-primary text-xs font-bold"
        >
          View all
        </Link>
      </div>

      {isLoading ? (
        <Skeleton className="h-12 bg-white w-full md:w-[98%] backdrop-filter backdrop-blur-lg bg-opacity-10 border-[1px]  w-full rounded-xl" />
      ) : (
        <div className="w-full flex flex-col items-center gap-2 max-h-[60rem] overflow-auto">
          {data?.leaderBoard.slice(0, visibleItems).map((item, index) => (
            <Link
              key={item._id}
              to={`/user-profile/${item?._id}`}
              className="w-full flex justify-between items-center border bg-muted hover:bg-card transition-all duration-400 ease-in-out p-1 rounded-[0.75rem]"
            >
              <div className="flex w-fit gap-2 items-center">
                <div className="w-[2.5rem] h-[2.5rem] relative">
                  {index + 1 <= 5 && (
                    <img
                      src={Badges[`No${index + 1}`]}
                      alt={item.username}
                      className="w-full h-full object-center object-cover rounded-sm"
                      fetchpriority="high"
                      loading="lazy"
                    />
                  )}
                </div>
                <Button
                  variant="secondary"
                  className="w-[2.5rem] h-[2.5rem] rounded-sm p-0"
                >
                  <img
                    src={item.profile.avatar}
                    alt={item.username}
                    className="w-full h-full object-center object-cover rounded-sm"
                    fetchpriority="high"
                    loading="lazy"
                  />
                </Button>
                <div className="flex flex-col justify-center items-start">
                  <p className="text-sm font-bold"> {item.username}</p>
                  <p className="text-[0.65rem] md:text-[0.75rem] text-muted-foreground text-center capitalize font-semibold">
                    #{index + 1}
                  </p>
                </div>
              </div>
              <img
                src={Badges[item.playerRank]}
                alt="User Avatar"
                className="w-[2.5rem] h-[2.5rem] object-center object-cover rounded-sm"
                fetchpriority="high"
                loading="lazy"
              />
            </Link>
          ))}
        </div>
      )}

      {data?.leaderBoard.length > initialVisibleItems && (
        <Button
          size="sm"
          variant="secondary"
          onClick={handleSeeMore}
          className="relative z-10 hover:bg-card border"
        >
          {expanded ? "Show Less" : "Show All"}
        </Button>
      )}
    </section>
  );
}

export default LeaderBoards;
