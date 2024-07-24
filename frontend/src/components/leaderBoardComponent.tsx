import React, { useState } from "react";
import NumberCounter from "./numberCounterprop";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function LeaderBoards() {
  const initialVisibleItems = 5;
  const [visibleItems, setVisibleItems] = useState(initialVisibleItems); // Initial number of visible items
  const [expanded, setExpanded] = useState(false);

  const items = [
    // Array of leaderboard items (mock data)
    { id: 1, name: "Aureus", duelsWon: 10000 },
    { id: 2, name: "Aureus", duelsWon: 900 },
    { id: 3, name: "Aureus", duelsWon: 800 },
    { id: 4, name: "Aureus", duelsWon: 700 },
    { id: 5, name: "Aureus", duelsWon: 600 },
    { id: 6, name: "Aureus", duelsWon: 500 },
    { id: 7, name: "Aureus", duelsWon: 400 },
    // Add more items as needed
  ];

  const handleSeeMore = () => {
    if (expanded) {
      setVisibleItems(initialVisibleItems);
    } else {
      setVisibleItems(items.length);
    }
    setExpanded(!expanded);
  };

  return (
    <section className="lg:w-[27vw] lg:mt-2 md:w-[95vw] w-[90vw] flex flex-col gap-2 h-fit relative">
      <div className="mb-2">
        <h1 className="uppercase font-bold text-sm">The LeaderBoards</h1>
      </div>
      <div className="w-full flex flex-col items-center gap-2 max-h-[60rem] overflow-auto">
        {items.slice(0, visibleItems).map((item, index) => (
          <Link
            key={item.id}
            to="/user-profile" // Provide the correct path here
            className="w-full flex justify-between items-center border bg-muted hover:bg-card transition-all duration-400 ease-in-out p-2 rounded-[0.75rem]"
          >
            <div className="flex gap-3 items-start">
              <Button variant="secondary" className="w-12 h-12 rounded-sm p-0">
                <img
                  src="https://i.pinimg.com/originals/21/6b/f1/216bf168f17efdf1fea5e9cd99150b99.gif"
                  alt="User Avatar"
                  className="w-full h-full rounded-sm"
                   fetchpriority="high"
        loading="lazy"
                />
              </Button>
              <div className="flex flex-col justify-center items-start">
                <p className="text-sm">{item.name}</p>
                <p className="text-xs text-muted-foreground text-center capitalize font-semibold">
                  <NumberCounter number={item.duelsWon} /> duels won
                </p>
              </div>
            </div>
            <h1 className="text-xl font-bold p-2 rounded-full">#{index + 1}</h1>
          </Link>
        ))}
      </div>

      {items.length > initialVisibleItems && (
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
