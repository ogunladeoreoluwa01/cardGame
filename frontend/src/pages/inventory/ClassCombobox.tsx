"use client";
import {
  GiTurtleShell,
  GiTigerHead,
  GiFairyWings,
  GiPorcupine,
  GiSmallFire,
  GiDrop,
  GiStonePile,
  GiTornado,
  GiLightningTrio,
  GiIceBolt,
  GiSundial,
  GiMoon,
  GiVineLeaf,
  GiCompass,
  GiMetalBar,
} from "react-icons/gi";
import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import {
  useNavigate,
  useParams,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const petClasses = [
  {
    class: "Guardian",
    label: "Guardian",
    color: "#2E7D32",
    icon: <GiTurtleShell />,
    effect: "Provides exceptional defense and protection for allies.",
  },
  {
    class: "Breaker",
    label: "Breaker",
    color: "#8B4513",
    icon: <GiPorcupine />,
    effect: "Breaks through enemy defenses with powerful attacks.",
  },
  {
    class: "Predator",
    label: "Predator",
    color: "#8B0000",
    icon: <GiTigerHead />,
    effect: "Uses speed and ferocity to overwhelm opponents.",
  },
  {
    class: "Nimble",
    label: "Nimble",
    color: "#AD1457",
    icon: <GiFairyWings />,
    effect: "Dodges attacks and strikes with precision and agility.",
  },
];


const classData: Record<
  string,
  { class:string; color: string; icon: JSX.Element; effect: string }
> = {
  Guardian: {
    class: "Guardian",
    color: "#2E7D32",
    icon: <GiTurtleShell />,
    effect: "Provides exceptional defense and protection for allies.",
  },
  Breaker: {
    class:"Breaker",
    color: "#8B4513",
    icon: <GiPorcupine />,
    effect: "Breaks through enemy defenses with powerful attacks.",
  },
  Predator: {
    class:"Predator",
    color: "#8B0000",
    icon: <GiTigerHead />,
    effect: "Uses speed and ferocity to overwhelm opponents.",
  },
  Nimble: {
    class:"Nimble",
    color: "#AD1457",
    icon: <GiFairyWings />,
    effect: "Dodges attacks and strikes with precision and agility.",
  },
};

export function ClassCombobox() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
   let [searchParams, setSearchParams] = useSearchParams();


     React.useEffect(() => {
    const classParam = searchParams.get("class");
    if (classParam) {
      setValue(classParam.toString());
      console.log(classParam.toString());
    } else {
      setValue("");
    }
  }, [searchParams]);

    const handleClassParams = (petclass: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (newParams.get("class") === petclass) {
      newParams.delete("class");
    } else {
      newParams.set("class", petclass);
       
    }
     setValue(petclass === value ? "" : petclass);
    setOpen(false);
    setSearchParams(newParams);
  };

  console.log(value)
  const backgroundColor =
    value
      ? classData[petClasses.find((petClass) => petClass.class === value)?.label].color
      : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] hover:bg- justify-between border-gray-400 bg-white backdrop-filter backdrop-blur-lg bg-opacity-10"
          style={{
            backgroundColor: backgroundColor,
          }}
        >
          <span className="flex gap-2 items-center">
            {value ? (
              <div
                style={{
                  backgroundColor: backgroundColor,
                }}
                className={` rotate-[45deg] elementCounts h-[1.35rem] w-[1.35rem] text-xl md:text-md flex justify-center items-center backdrop-filter transition-all duration-300 ease-in-out backdrop-blur-lg rounded-sm ${
                  // Replace true with your actual condition
                  true
                    ? "bg-primary bg-opacity-90"
                    : "bg-zinc-400 bg-opacity-10 group-md:hover:bg-opacity-90 group-md:hover:bg-primary"
                }`}
              >
                <span className="-rotate-[45deg] text-[0.8rem]">
                  {
                    classData[
                      petClasses.find((petClass) => petClass.class === value)
                        ?.label
                    ].icon
                  }
                </span>
              </div>
            ) : null}
            {value
              ? petClasses.find((petClass) => petClass.class === value)?.label
              : "Select a  class..."}
          </span>

          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 border-gray-400 bg-black backdrop-filter backdrop-blur-lg bg-opacity-20">
        <Command className="bg-black backdrop-filter backdrop-blur-lg bg-opacity-20">
          <CommandInput placeholder="Search class..." className="h-9  " />
          <CommandList>
            <CommandEmpty>No class found.</CommandEmpty>
            <CommandGroup>
              {petClasses.map((petClass) => (
                <CommandItem
                  key={petClass.class}
                  value={petClass.class}
                  onSelect={(currentValue) => {
                    handleClassParams(currentValue);
                  }}
                  style={{
                    backgroundColor:
                      value === petClass.class && backgroundColor,
                  }}
                  className="data-[selected=true]:bg-white data-[selected=true]:bg-opacity-10  data-[selected=true]:backdrop-blur-lg"
                >
                  <span className="flex gap-2 items-center">
                    <div
                      style={{
                        backgroundColor: classData[petClass.class].color,
                      }}
                      className={` rotate-[45deg] elementCounts h-[1.35rem] w-[1.35rem] text-xl md:text-md flex justify-center items-center backdrop-filter transition-all duration-300 ease-in-out backdrop-blur-lg rounded-sm ${
                        // Replace true with your actual condition
                        true
                          ? "bg-primary bg-opacity-90"
                          : " bg-opacity-10 group-md:hover:bg-opacity-90 group-md:hover:bg-primary"
                      }`}
                    >
                      <span className="-rotate-[45deg] text-[0.8rem]">
                        {classData[petClass.class].icon}
                      </span>
                    </div>
                    {petClass.label}
                  </span>

                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === petClass.class ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
