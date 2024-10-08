import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import NumberCounter from "./numberCounterprop";
import {gold,silver} from "@/assets"
import { useNavigate } from "react-router-dom";

interface Prop {
  allPets: any[] | null;
  inventory: any[] | null;
  Aureus: number;
  Argentum: number;
  username:string;
  userId:string;
}

const DashInventoryComp: React.FC<Prop> = ({
  allPets,
  inventory,
  Aureus ,
  Argentum ,
  username,
  userId
}) => {
  const navigate = useNavigate()
  const [noOfPets, setNoOfPets] = useState(allPets ? allPets.length : 0);
  const [noOfItems, setNoOfItems] = useState(
    inventory ? inventory.length :0
  );

  useEffect(() => {
    if (allPets) {
      setNoOfPets(allPets.length );
    }
    if (inventory) {
      setNoOfItems(inventory.length);
    }
  }, [allPets, inventory]);


  

  return (
    <>
      <section className="lg:min-w-[27vw]  md:w-fit w-full  h-[10rem] bg-muted p-2 rounded-[0.75rem] ">
        <h1 className="ml-4 uppercase font-bold text-sm">
          {username}'s Inventory
        </h1>
        <section className="flex gap-6 items-center  justify-around">
          <section className="flex items-center gap-2">
            <div className="flex flex-col  justify-center items-center w-20">
              <p className="text-muted-foreground uppercase text-sm">Aureus</p>
              <img
                src={gold}
                alt=""
                className="w-[4rem] h-[4rem] rounded-full "
                fetchpriority="high"
                loading="lazy"
              />
              <p className=" uppercase text-sm text-center font-bold">
                {" "}
                <NumberCounter number={Aureus} />
              </p>
            </div>
            <div className="flex flex-col  justify-center items-center w-20">
              <p className="text-muted-foreground uppercase text-sm">
                Argentum
              </p>
              <img
                src={silver}
                alt=""
                className="w-[4rem] h-[4rem] rounded-full"
                fetchpriority="high"
                loading="lazy"
              />
              <p className=" uppercase text-sm text-center font-bold">
                {" "}
                <NumberCounter number={Argentum} />
              </p>
            </div>
          </section>

          <section className="flex flex-col items-end px-2 ">
            <div className="flex gap-2 w-24 justify-between">
              <p className=" uppercase text-sm text-center font-bold">
                {" "}
                <NumberCounter number={noOfPets} />
              </p>{" "}
              <p className="text-muted-foreground uppercase text-sm">Pets </p>
            </div>

            <div className="flex gap-2 w-24 justify-between">
              <p className=" uppercase text-sm text-center font-bold">
                {" "}
                <NumberCounter number={noOfItems} />
              </p>{" "}
              <p className="text-muted-foreground uppercase text-sm">Items</p>
            </div>
            <Button 
            onClick={()=>{navigate(`/inventory/${userId}/pet`);}}
            size="sm" className="mt-2  w-24 ">
              {" "}
              Inventory
            </Button>
            <Button onClick={()=>{navigate(`/market/pet`);}} size="sm" className="mt-2  w-24 ">
              {" "}
              Black Market
            </Button>
          </section>
        </section>
      </section>
      <div></div>

      {/* <section className="my-1 flex lg:w-[50%] w-full justify-between">
        <h1 className="font-bold text-ellipsis overflow-hidden w-full h-[24px]">
          {Aureus}
          <span className="md:text-sm text-xs w-[10%] font-light text-muted-foreground inline-block number">
            Aureus
          </span>
        </h1>
        <h1 className="font-bold text-ellipsis overflow-hidden w-full h-[24px]">
          {Argentum}
          <span className="md:text-sm text-xs w-[10%] font-light text-muted-foreground inline-block number">
            Argentum
          </span>
        </h1>
      </section> */}
    </>
  );
};

export default DashInventoryComp;
