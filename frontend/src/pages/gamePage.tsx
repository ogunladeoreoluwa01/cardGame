import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import NavBarComp from "@/components/navBarComponent";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import HeaderComp from "@/components/headerComponent";
import { Button } from "@/components/ui/button";
import LeaderBoards from "@/components/leaderBoardComponent";
import CreateDuelButtons from "@/components/createDuelButtons";
import GameLoad from "@/components/gameLoading";
import { gameAction } from "@/stores/reducers/gameReducer";
import { gameSessionAction } from "@/stores/reducers/gameSessionReducer";
import { liveGameAction } from "@/stores/reducers/liveGameReducer";


import PingBar from "@/components/pingBar";
import Battle from "@/components/battle";

// Initialize socket
const gameSocket = io("http://localhost:5000/game", {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});

const GamesPage: React.FC = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const navigate = useNavigate();

  const [isPlayer1, setIsPlayer1] = useState(false);
  const [isWaiting, setIsWaiting] = useState(true);
  const [gameState, setGameState] = useState<any>(null);
  const [liveGameState, setLiveGameState] = useState<any>(null);
  const [ping, setPing] = useState<number | null>(null);

  const userState = useSelector((state: RootState) => state.user);
  const initialGameState = useSelector((state: RootState) => state.ongoingGame);
  const updatedGameState = useSelector((state: RootState) => state.liveGame);
  const accessTokenState = useSelector((state: RootState) => state.accessToken);
  const refreshTokenState = useSelector(
    (state: RootState) => state.refreshToken
  );
  const gameSessionState = useSelector((state: RootState) => state.gameSession);




  useEffect(() => {
    if (
      userState?.userInfo?._id ===
      initialGameState?.gameState?.players?.player1?.userId
    ) {
      setIsPlayer1(true);
    }

    if (initialGameState?.gameState) {
      gameSocket.connect();
    }

    const userId = userState?.userInfo?._id;
    const username = userState?.userInfo?.username;
    const sessionID = initialGameState?.gameState?._id;
    const duelId = initialGameState?.gameState?._id;

    const handlePong = () => {
      const latency = Date.now() - (gameSocket as any).pingSentAt;
      setPing(latency);
    };

    const checkPingInterval = setInterval(() => {
      if (gameSocket) {
        (gameSocket as any).pingSentAt = Date.now();
        gameSocket.emit("ping");
      }
    }, 30000);

    const setupSocketListeners = () => {
      gameSocket.on("pong", handlePong);

      gameSocket.on("connect", () => {
        console.log("Connected to game server with ID:", gameSocket.id);

        if (!gameSessionState.sessionId) {
          gameSocket.emit("createRoom", duelId, username, userId);
           toast({
          variant: "Success",
          description: `Connected to game server`,
        });
          dispatch(
            gameSessionAction.setSessionId(initialGameState?.gameState?._id)
          );
          localStorage.setItem(
            "gameSession",
            JSON.stringify(initialGameState?.gameState?._id)
          );
        } else {
          gameSocket.emit("reconnectToGame", {
            userId:userId,
            sessionID:sessionID,
          });

          ;
        
          console.log(`"gamestate triggered WITH${sessionID} AND ${userId}"`);
         
        }
      });

      gameSocket.on("userJoinedDuel", (socketID,userID,username) => {
        toast({
          description: `${socketID},
          ${userID},
          ${username},`
        });
      });
      gameSocket.on("notification", (notification) => {
        toast({
          description: notification,
        });
      });

      gameSocket.on("gameStart", (data) => {
        const {message , gameState}= data
        // toast({
        //   description: message,
        // });
        console.log("message")
          dispatch(gameAction.setGameState(gameState));
          localStorage.setItem("game", JSON.stringify(gameState));
          dispatch(liveGameAction.setLiveGameState(gameState));
          localStorage.setItem("liveGame", JSON.stringify(gameState));
        setIsWaiting(false);
      });

      // Add other socket event listeners here...

    gameSocket.on(
      "statusEffectApplied",
      (
        defenderId,
        attackerId,
        defenderMessage,
        attackerMessage,
        updatedGameState
      ) => {
        
        if(userId===defenderId){
toast({
  variant: "defense",
  description: defenderMessage,
});
        }
          if (userId === attackerId) {
            toast({
              variant: "defense",
              description: attackerMessage,
            });
          }
        
        dispatch(liveGameAction.setLiveGameState(updatedGameState));
        localStorage.setItem("liveGame", JSON.stringify(updatedGameState));
        setIsWaiting(false);
      }
    );

    gameSocket.on(
      "statusEffectChange",
      (forUser, message, statusEffects, updatedGameState) => {
        if (userId === forUser) {
          toast({
            variant: statusEffects,
            description: message,
          });
        }
        dispatch(liveGameAction.setLiveGameState(updatedGameState));
        localStorage.setItem("liveGame", JSON.stringify(updatedGameState));
        setIsWaiting(false);
      }
    );


    gameSocket.on("notificationError", (forUser, message) => {
      if (userId === forUser) {
        toast({
          variant: "destructive",
          description: message,
        });
      }
    });

      gameSocket.on(
        "notificationWarning",
        (forUser, message, updatedGameState) => {
          if (userId === forUser) {
            toast({
              variant: "warning",
              description: message,
            });
          }
          dispatch(liveGameAction.setLiveGameState(updatedGameState));
          localStorage.setItem("liveGame", JSON.stringify(updatedGameState));
          setIsWaiting(false);
        }
      );
        gameSocket.on("attackResult", (forUser, message, updatedGameState) => {
          if (userId === forUser) {
            toast({
              variant: "attack",
              description: message,
            });
          }
          dispatch(liveGameAction.setLiveGameState(updatedGameState));
          localStorage.setItem("liveGame", JSON.stringify(updatedGameState));
          setIsWaiting(false);
        });
          gameSocket.on(
            "defendResult",
            (forUser, message, updatedGameState) => {
              if (userId === forUser) {
                toast({
                  variant: "defense",
                  description: message,
                });
              }
              dispatch(liveGameAction.setLiveGameState(updatedGameState));
              localStorage.setItem(
                "liveGame",
                JSON.stringify(updatedGameState)
              );
              setIsWaiting(false);
            }
          );




gameSocket.on("reconnect", () => {
  console.log("Successfully reconnected");
  toast({
    variant: "Success",
    description: `Reconnect started with duel ID: ${sessionID}`,
  });
  gameSocket.emit("reconnectToGame", {
    sessionID: sessionID,
    userId: userId,
  });
});

      gameSocket.on("opponentDisconnected", (message, updatedGameState) => {
        toast({
          variant: "warning",
          description: message,
        });
        dispatch(liveGameAction.setLiveGameState(updatedGameState));
        localStorage.setItem("liveGame", JSON.stringify(updatedGameState));
        setIsWaiting(false);
      });

      

      gameSocket.on("gameEnd", (winner, message, loser, updatedGameState) => {
        if (winner === "draw" || loser === "draw") {
          toast({
            variant: "draw",
            description: message,
          });
        }

        if (userId === winner) {
          toast({
            variant: "winner",
            description: `${message}, congrats you are the winner`,
          });
        }
        if (userId === loser) {
          toast({
            variant: "loser",
            description: `${message}, better luck next time`,
          });
        }
        dispatch(liveGameAction.resetLiveGameState());
        localStorage.removeItem("game");
        // dispatch(gameAction.resetGameState());
        // localStorage.removeItem("liveGame");
        dispatch(gameSessionAction.clearSessionId());
        localStorage.removeItem("gameSession");
        dispatch(liveGameAction.setLiveGameState(updatedGameState));
        localStorage.setItem("liveGame", JSON.stringify(updatedGameState));
        setIsWaiting(false);
        gameSocket.disconnect();
      });

      gameSocket.on("reconnect_attempt", (attempt) => {
        toast({
          variant: "warning",
          description: `Reconnection attempt ${attempt}`,
        });
      });

      gameSocket.on("reconnect_failed", () => {
        toast({
          variant: "destructive",
          description: `Reconnection failed, the game has ended on the server side`,
        });
      });

      gameSocket.on("disconnect", () => {
        toast({
          description: `Disconnected from game socket`,
        });
        console.log("Disconnected from game socket");
      });
    };

    const cleanUpSocketListeners = () => {
      clearInterval(checkPingInterval);
      gameSocket.off("pong", handlePong);
      gameSocket.off("connect");
      gameSocket.off("notification");
      gameSocket.off("gameStart");
      gameSocket.off("statusEffectApplied");
      // Remove other socket event listeners here...
      gameSocket.off("reconnect");

      gameSocket.off("opponentDisconnected");
      gameSocket.off("playerReconnecting");
      gameSocket.off("playerReconnected");
      gameSocket.off("gameEnd");
      gameSocket.off("reconnect_attempt");
      gameSocket.off("reconnect_failed");
      gameSocket.off("disconnect");
    };

    if (initialGameState && updatedGameState) {
      gameSocket.auth = { username, userId, sessionID };
      setupSocketListeners();
    }

    return () => {
      cleanUpSocketListeners();
      gameSocket.disconnect();
    };
  }, []);
   const simulateDisconnect = () => {
     gameSocket.disconnect();
     setTimeout(() => {
       gameSocket.connect();
     }, 5000); // Reconnect after 5 seconds
   };

  return (
    <>
      {!isWaiting ? (
        <>
          <button onClick={simulateDisconnect}>Simulate Disconnect</button>
          <GameLoad />
        </>
      ) : (
        <>
          <section className="w-screen h-screen">
            <Battle />
            <PingBar pingIN={ping} />  
           
          </section>
        </>
      )}
    </>
  );
};

export default GamesPage;
