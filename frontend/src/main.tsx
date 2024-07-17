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
import Dashboard from "@/pages/dashboard"
import PetView from "@/pages/petViewPage"
import InventoryPage from "./pages/inventoryPage";
import PetInventoryPage from "./pages/petInventoryPage";
import ItemInventoryPage from "./pages/itemsInventoryPage";
import AboutGame from "./pages/infoAboutpets";
import DuelsPage from "./pages/duelsPage"
import GamesPage from "./pages/gamePage";
import JoinGameLinkPage from "./pages/joinGamesLinkPage";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Use Layout component here
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
        path: "user-pet-view",
        element: <PetView />,
      },

      {
        path: "user-Inventory",
        element: <InventoryPage />,
        children: [
          {
            path: "pet",
            element: <PetInventoryPage />,
          },
          {
            path: "items",
            element: <ItemInventoryPage />,
          },
        ],
      },
    ],
  },
  {
    path: "/duels",
    element: <DuelsPage />,
  },
  {
    path: "/games-page/:duelId/duelJoinKey/:duelJoinKey",
    element: <GamesPage />,
  },
  {
    path: "/join-game/:duelJoinKey",
    element: <JoinGameLinkPage/>,
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
    path: "about-game",
    element: <AboutGame />,
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

