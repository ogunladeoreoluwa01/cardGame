import React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import store from "@/stores";
import { Provider } from "react-redux";
import App from "@/App";
import { Toaster } from "@/components/ui/toaster";

import "./index.css";
import LoginPage from "@/pages/loginPage";
import SignupPage from "./pages/signupPage";
import Layout from "@/layout"; // Adjust the import path
import Dashboard from "@/pages/dashboard";
import PetView from "@/pages/petViewPage";
import InventoryPage from "./pages/inventory/inventoryPage";

import AboutGame from "./pages/infoAbout";
import DuelsPage from "./pages/duelsPage";
import GamesPage from "./pages/gamePage";
import JoinGameLinkPage from "./pages/joinGamesLinkPage";
import UserLeaderBoards from "./pages/leaderBoard";
import AboutElement from "./pages/aboutgame/elements";
import AboutClass from "./pages/aboutgame/class";
import PetInventoryPage from "./pages/inventory/petInventory";
import DeckInventoryPage from "./pages/inventory/deckInventoryPage";
import ItemInventoryPage from "./pages/inventory/itemInventory";
import MarketPage from "./pages/marketPlace/marketPage";
import PetMarketPage from "./pages/marketPlace/petMarketPage";
import ItemMarketPage from "./pages/marketPlace/itemMarketPage";
import ViewAlistedItemPage from "./pages/viewAlistedItemPage";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "app",
        element: <App />,
      },
      {
        path: "user-pet-view/:petId?",
        element: <PetView />,
      },
      {
    path: "view-listing/:listingno?",
    element: <ViewAlistedItemPage />,
  },
    ],
  },
  {
    path: "/duels",
    element: <DuelsPage />,
  },
  {
    path: "/games-page",
    element: <GamesPage />,
  },
  {
    path: "/join-game/:duelJoinKey",
    element: <JoinGameLinkPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/sign-up",
    element: <SignupPage />,
  },
  {
    path: "/about-game",
    element: <AboutGame />,
    children: [
      {
        path: "element",
        element: <AboutElement />,
      },
      {
        path: "class",
        element: <AboutClass />,
      },
    ],
  },
  {
    path: "/leaderboard/:userId",
    element: <UserLeaderBoards />,
  },
  
  {
    path: "/inventory/:userId",
    element: <InventoryPage />,
    children: [
      {
        path: "pet",
        element: <PetInventoryPage />,
      },
      {
        path: "item",
        element: <ItemInventoryPage />,
      },
      {
        path: "deck",
        element: <DeckInventoryPage />,
      },
    ],
  },
  {
    path: "/market",
    element: <MarketPage />,
    children: [
      {
        path: "pet",
        element: <PetMarketPage />,
      },
      {
        path: "item",
        element: <ItemMarketPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <RouterProvider router={router} />
          <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
