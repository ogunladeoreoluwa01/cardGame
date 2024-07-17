import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/types";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button"; // Import Button component

const ItemInventoryPage: React.FC = () => {
  return (
    <>
      <h1> hello world items </h1>
    </>
  );
};

export default ItemInventoryPage;
