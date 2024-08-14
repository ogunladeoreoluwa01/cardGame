import fireBackground from "@/assets/static/aboutPage/Default_Fire_Arena_Volcanic_CraterDescription_The_Fire_Arena_i_0.jpg";
import waterBackground from "@/assets/static/aboutPage/Default_Description_The_Oceanic_Abyss_arena_is_a_vast_underwat_3.jpg";
import earthBackground from "@/assets/static/aboutPage/Default_Arena_Mountain_StrongholdDescription_The_Mountain_Stro_2.jpg";
import airBackground from "@/assets/static/aboutPage/Default_Arena_Sky_TempleDescription_The_Sky_Temple_arena_float_2.jpg";
import electricBackground from "@/assets/static/aboutPage/Default_Arena_Stormy_PeakDescription_The_Stormy_Peak_arena_is_2.jpg";
import natureBackground from "@/assets/static/aboutPage/Default_Arena_Enchanted_ForestDescription_The_Enchanted_Forest_2.jpg";
import iceBackground from "@/assets/static/aboutPage/Default_Arena_Frozen_TundraDescription_The_Frozen_Tundrais_a_v_2.jpg";
import darkBackground from "@/assets/static/aboutPage/Default_Arena_Haunted_CastleDescription_The_Haunted_Castle_are_3.jpg";
import lightBackground from "@/assets/static/aboutPage/Default_Arena_Radiant_GardenDescription_The_Radiant_Garden_are_3.jpg";
import metalBackground from "@/assets/static/aboutPage/Default_Arena_Forge_of_TitansDescription_The_Forge_of_Titans_a_3.jpg";
import styles from "../styles/styles";
import { Skeleton } from "@/components/ui/skeleton";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/types";
import { useToast } from "@/components/ui/use-toast";

import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams, Link } from "react-router-dom";
import getPetDetails from "@/services/petServices/getAPet";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import DateConverter from "@/components/dateConverterComponent";
import NumberCounter from "@/components/numberCounterprop";
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
  GiTwoCoins,
  GiSundial,
  GiMoon,
  GiVineLeaf,
  GiMagicSwirl,
  GiBouncingSword,
  GiVibratingShield,
  GiMetalBar,
  GiMineralHeart,
  GiConvergenceTarget,
} from "react-icons/gi";

const backgroundImages: Record<string, string> = {
  Fire: fireBackground,
  Water: waterBackground,
  Earth: earthBackground,
  Air: airBackground,
  Electric: electricBackground,
  Nature: natureBackground,
  Ice: iceBackground,
  Shadow: darkBackground,
  Light: lightBackground,
  Metal: metalBackground,
};

const elementData: Record<
  string,
  {
    color: string;
    element: string;
    icon: JSX.Element;
    effect: string;
    description: string;
  }
> = {
  Fire: {
    color: "#8B0000",
    element: "Fire",
    icon: <GiSmallFire />,
    effect: "Burns enemies over time with fire damage.",
    description:
      "Harness the destructive power of fire. Fire elements unleash intense heat and flame, causing continuous damage and igniting opponents. They excel in offensive strategies with high damage output.",
  },
  Water: {
    color: "#1C86EE",
    element: "Water",
    icon: <GiDrop />,
    effect: "Cools and calms, providing defensive and healing abilities.",
    description:
      "Control the flow of water to heal and protect. Water elements are versatile, providing both restorative abilities and defensive measures. They excel in support roles with healing and protective spells.",
  },
  Earth: {
    color: "#4B3621",
    element: "Earth",
    icon: <GiStonePile />,
    effect: "Provides stability and defensive strength.",
    description:
      "Command the raw power of the earth to create formidable defenses. Earth elements are known for their resilience and ability to fortify allies. They excel in defensive strategies and crowd control.",
  },
  Air: {
    color: "#4682B4",
    element: "Air",
    icon: <GiTornado />,
    effect: "Brings swift and evasive maneuvers, enhancing agility.",
    description:
      "Harness the winds to enhance speed and agility. Air elements are masters of evasion and rapid movement, allowing them to outmaneuver enemies and strike with precision. They excel in hit-and-run tactics.",
  },
  Lightning: {
    color: "#DAA520",
    element: "Lightning",
    icon: <GiLightningTrio />,
    effect: "Electrifies attacks with shocking damage and stunning effects.",
    description:
      "Unleash the raw power of electricity to shock and stun. Electric elements are known for their high burst damage and ability to incapacitate opponents with stunning effects. They excel in disrupting enemy strategies.",
  },
  Nature: {
    color: "#2E8B57",
    element: "Nature",
    icon: <GiVineLeaf />,
    effect: "Harmonizes with surroundings, providing healing and growth.",
    description:
      "Bask in the harmony of nature to nurture and heal. Nature elements foster growth and recovery, enhancing allies' resilience and restoring their vitality. They excel in support roles with regenerative abilities.",
  },
  Ice: {
    color: "#008B8B",
    element: "Ice",
    icon: <GiIceBolt />,
    effect: "Freezes enemies and slows their actions.",
    description:
      "Command the chilling force of ice to freeze and slow. Ice elements excel in crowd control, impairing enemy movement and actions with freezing effects. They are effective in both offensive and defensive roles.",
  },
  Shadow: {
    color: "#4B0082",
    icon: <GiMoon />,
    element: "Shadow",
    effect: "Obscures vision and deals shadowy damage.",
    description:
      "Harness the dark energies of the shadow realm. Shadow elements are adept at inflicting debilitating effects and dealing damage from the darkness. They excel in stealth and debuffing enemies.",
  },
  Light: {
    color: "#B8860B",
    element: "Light",
    icon: <GiSundial />,
    effect: "Illuminates and heals, providing clarity and purity.",
    description:
      "Wield the power of light to heal and illuminate. Light elements offer restorative magic and clarity, purging darkness and providing support to allies. They excel in healing and protective roles.",
  },
  Metal: {
    color: "#4F4F4F",
    element: "Metal",
    icon: <GiMetalBar />,
    effect: "Strengthens defenses and enhances durability.",
    description:
      "Command the strength of metal to fortify and enhance. Metal elements are known for their durability and ability to improve defenses. They excel in bolstering allies and resisting damage.",
  },
};

const classData: Record<
  string,
  {
    color: string;
    class: string;
    icon: JSX.Element;
    effect: string;
    description: string;
  }
> = {
  Guardian: {
    color: "#2E7D32",
    class: "Guardian",
    icon: <GiTurtleShell />,
    effect: "Provides exceptional defense and protection for allies.",
    description:
      "The Guardian is the stalwart defender, shielding allies with unparalleled defensive skills. Guardians are essential for protecting the team from harm and withstanding enemy assaults.",
  },
  Breaker: {
    color: "#8B4513",
    class: "Breaker",
    icon: <GiPorcupine />,
    effect: "Breaks through enemy defenses with powerful attacks.",
    description:
      "The Breaker specializes in dismantling enemy defenses with sheer power. Breakers excel in offensive tactics, delivering crushing blows that can shatter even the most fortified defenses.",
  },
  Predator: {
    color: "#8B0000",
    class: "Predator",
    icon: <GiTigerHead />,
    effect: "Uses speed and ferocity to overwhelm opponents.",
    description:
      "The Predator is a fierce and swift attacker, leveraging speed and aggression to overwhelm foes. Predators excel in striking quickly and decisively, making them formidable in combat.",
  },
  Nimble: {
    color: "#AD1457",
    class: "Nimble",
    icon: <GiFairyWings />,
    effect: "Dodges attacks and strikes with precision and agility.",
    description:
      "The Nimble class is characterized by its agility and precision. Nimble characters excel at avoiding attacks and delivering accurate strikes, making them elusive and deadly opponents.",
  },
};

const PetView = () => {
  const { petId } = useParams();

  const navigate = useNavigate();
  const { toast } = useToast();
  const userState: any | null = useSelector((state: RootState) => state.user);

  const refreshTokenState = useSelector(
    (state: RootState) => state.refreshToken
  );
  const accessTokenState = useSelector((state: RootState) => state.accessToken);

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["gatPet", petId],
    queryFn: () =>
      getPetDetails({
        petId: petId,
      }),
  });

  console.log(data);

  const [elementStyles, setElementStyles] = useState<
    {
      color: string;
      element: string;
      icon: JSX.Element;
      effect: string;
      description: string;
    }[]
  >([]);
  const [classStyle, setClassStyle] = useState<{
    color: string;
    class: string;
    icon: JSX.Element | null;
    effect: string;
    description: string;
  }>({
    color: "#4CAF50",
    class: "Guardian",
    icon: null,
    effect: "",
  });
  const [percent, setPercent] = useState(0);
  const [rarityStyle, setRarityStyle] = useState("bg-primary");
  const [textStyle, setTextStyle] = useState("bg-primary");
  const [weakAgainstStyles, setWeakAgainstStyles] = useState<
    { color: string; element: string; icon: JSX.Element; effect: string }[]
  >([]);
  const [strongAgainstStyles, setStrongAgainstStyles] = useState<
    { color: string; element: string; icon: JSX.Element; effect: string }[]
  >([]);

  useEffect(() => {
    if (!isLoading) {
      setElementStyles(data?.pet.petInfo.element.map((el) => elementData[el]));
      setClassStyle(classData[data?.pet.petInfo.class]);
      setWeakAgainstStyles(
        data?.pet.petInfo.weaknesses.map((el) => elementData[el])
      );
      setStrongAgainstStyles(
        data?.pet.petInfo.strengths.map((el) => elementData[el])
      );
      switch (data?.pet.rarity) {
        case "Rustic":
          setRarityStyle("rustic-card");
          setTextStyle("rustic-text ");

          break;
        case "Arcane":
          setRarityStyle("arcane-card");
          setTextStyle("arcane-text ");
          break;
        case "Mythic":
          setRarityStyle("mythic-card");
          setTextStyle("mythic-text ");
          break;
        case "Exalted":
          setRarityStyle("exalted-card");
          setTextStyle("exalted-text ");
          break;
        case "Ethereal":
          setRarityStyle("ethereal-card ");
          setTextStyle("ethereal-text ");
          break;
        default:
          setRarityStyle("bg-primary");
          break;
      }
      const calculatedPercent =
        (data?.pet.experience / data?.pet.xpNeededToNextLevel) * 100;
      if (calculatedPercent > 100) {
        setPercent(100);
      } else {
        setPercent(calculatedPercent);
      }
    }
  }, [data?.pet]);

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
    accessTokenState.userAccessToken,
  ]);
  return (
    <>
      {isLoading ? (
        <Skeleton className="lg:w-[60vw]  md:w-full h-[60%] p-3 md:p-6  w-full rounded-xl" />
      ) : (
        <ScrollArea
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)),url(${
              backgroundImages[data.pet.petInfo.element[0]]
            })`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
          className="rounded-[0.75rem] border-[1px] text-white lg:w-[60vw]  md:w-full  overflow-auto h-[60vh] md:h-[55vh] lg:h-[80vh] p-3 md:p-6  w-full flex flex-col  gap-3 items-start justify-start "
        >
          <section className=" flex  items-start justify-center flex-col md:flex-row my-6 ">
            <section className="w-[25%] flex justify-start items-center flex-wrap flex-col md:flex-row">
              <Card
                className={`w-[200px] md:w-[150px] h-[250px] text-white  p-[0.25rem] relative overflow-hidden ${rarityStyle}`}
              >
                <CardContent className="w-full h-full bg-muted p-0 rounded-[0.65rem] relative bg-black">
                  <img
                    src={data.pet.petInfo.illustration}
                    alt={data.pet.petInfo.name}
                    fetchPriority="auto"
                    loading="lazy"
                    className="w-full h-full  rounded-[0.65rem] object-cover   object-center text-center shimmer dark:opacity-50 "
                  />
                </CardContent>
              </Card>
            </section>

            <section className="w-[100%] md:w-[70%] flex flex-col md:flex-row items-start gap-4 flex-wrap">
              <section className="w-full flex justify-between items-center">
                <div className=" font-bold flex flex-col text-2xl pb-1">
                  <h1> {data.pet.petInfo.name}</h1>

                  {data.pet.isSystem ? (
                    <p className="text-muted-foreground text-sm">@System</p>
                  ) : (
                    <Link
                      to={`/user-profile/${data.pet.userProfile.userId}`}
                      className="text-muted-foreground text-sm  "
                    >
                      @{data.pet.userProfile.username}
                    </Link>
                  )}

                  <span className="text-muted-foreground text-sm">
                    {" "}
                    {data.pet.userProfile.previousUsers.length > 0 && (
                      <p>
                        previously owned -{" "}
                        {data.pet.userProfile.previousUsers.length} ppl
                      </p>
                    )}
                  </span>
                </div>
                <div
                  className={`font-bold text-2xl w-[95px] rounded-[0.75rem] p-[0.1rem] ${rarityStyle}  `}
                >
                  <div className="bg-muted rounded-[0.75rem]">
                    <p
                      className={`text-muted-foreground  rounded-[0.75rem]  text-base text-center  font-bold ${textStyle} `}
                    >
                      {data.pet.rarity}
                    </p>
                  </div>
                </div>
              </section>

              <div className="text-muted-foreground text-sm  pb-1">
                <p className=" py-1">{data.pet.petInfo.description}</p>

                <span className="text-white font-bold  py-1 text-md">
                  {" "}
                  Lore{" "}
                </span>

                <p>{data.pet.petInfo.lore}</p>

                <p className="text-muted-foreground text-sm  w-fit  pt-1 ">
                  pulled on -{" "}
                  <span className="text-white font-medium text-md">
                    {" "}
                    <DateConverter dateString={data.pet.createdAt} />{" "}
                  </span>
                </p>
                <p className="text-muted-foreground text-sm  w-fit  pt-1 ">
                  level -{" "}
                  <span className="text-white font-medium text-md normal-num">
                    {" "}
                    {data.pet.level}
                  </span>
                </p>

                {data.pet.isListed && (
                  <section className="my-2 flex items-center gap-2 justify-start">
                    <Link
                      to={`/view-listing/${data.pet.listingNo}`}
                      className={`flex gap-2 group  items-center  justify-center min-w-[95px] h-[30px]  p-2 rounded-[0.75rem]  ${styles.glassEffect}  min-w-[95px] `}
                    >
                      <div className=" font-bold group-hover:text-[#32CD32] transition-all duration-300 ease-in-out scale-90 text-sm uppercase text-white flex gap-1 items-center justify-center ">
                        <span className="text-[#32CD32] text-lg">
                          <GiConvergenceTarget />
                        </span>
                        see Listing
                      </div>
                    </Link>
                    <p className="text-muted-foreground text-sm  captitalize w-fit  pt-1 ">
                      Items is Listed for -{" "}
                      <span className="text-white font-medium text-sm">
                        <NumberCounter number={data.pet.listingPrice} />{" "}
                      </span>
                    </p>
                  </section>
                )}
              </div>

              <h1 className=" font-bold text-lg  ">Experience</h1>
              <section className="w-full">
                <section className=" w-full  items-center   ">
                  <div
                    className={`w-full h-2 ${styles.glassEffect}  rounded-[0.25rem] relative overflow-hidden`}
                  >
                    <div
                      style={{ width: `${percent}%` }}
                      className={`absolute rounded-[0.75rem] opacity-90 ${rarityStyle} h-2 blur-[0.5px] transition-all duration-700 ease-in-out`}
                    ></div>
                  </div>
                </section>
              </section>

              <h1 className=" font-bold text-lg ">Stats</h1>
              <div className="flex flex-wrap gap-2 ">
                <div
                  className={`flex gap-2  items-center justify-center h-[30px]  p-2 rounded-[0.75rem]  ${styles.glassEffect}  min-w-[95px] `}
                >
                  <div className=" font-bold text-sm uppercase text-white flex gap-1 items-center justify-center ">
                    <span className="text-[#B22222] text-lg">
                      <GiMineralHeart />
                    </span>
                    Hp
                  </div>
                  <h1 className="text-sm font-medium ">
                    {" "}
                    <NumberCounter number={data.pet.currentHealth} />{" "}
                  </h1>
                </div>

                <div
                  className={`flex gap-2  items-center min-w-[95px] justify-center h-[30px]  p-2 rounded-[0.75rem]  ${styles.glassEffect}  min-w-[95px] `}
                >
                  <div className=" font-bold text-sm  uppercase text-muted-foreground flex gap-1 items-center justify-center ">
                    <span className="text-stone-300 text-lg">
                      <GiTwoCoins />
                    </span>
                    AR
                  </div>
                  <h1 className="text-sm font-medium ">
                    {" "}
                    <NumberCounter number={data.pet.currentCost} />{" "}
                  </h1>
                </div>
                <div
                  className={`flex gap-2  items-center justify-center min-w-[95px] h-[30px]  p-2 rounded-[0.75rem]  ${styles.glassEffect}  min-w-[95px] `}
                >
                  <div className=" font-bold text-sm  uppercase text-muted-foreground flex gap-1 items-center justify-center ">
                    <span className="text-[#FF4500] text-lg">
                      <GiBouncingSword />
                    </span>
                    att
                  </div>
                  <h1 className="text-sm font-medium ">
                    {" "}
                    <NumberCounter number={data.pet.currentAttack} />{" "}
                  </h1>
                </div>
                <div
                  className={`flex gap-2  items-center min-w-[95px] justify-center h-[30px]  p-2 rounded-[0.75rem]  ${styles.glassEffect}  min-w-[95px] `}
                >
                  <div className=" font-bold text-sm uppercase text-muted-foreground flex gap-1 items-center justify-center ">
                    <span className="text-[#4682B4] text-lg">
                      <GiVibratingShield />
                    </span>
                    def
                  </div>
                  <h1 className="text-sm font-medium ">
                    {" "}
                    <NumberCounter number={data.pet.currentDefense} />
                  </h1>
                </div>
                <div
                  className={`flex gap-2  items-center min-w-[95px] justify-center h-[30px]  p-2 rounded-[0.75rem]  ${styles.glassEffect}  min-w-[95px] `}
                >
                  <div className=" font-bold text-sm uppercase text-muted-foreground flex gap-1 items-center justify-center ">
                    <span className="text-[#6A5ACD] text-lg">
                      <GiMagicSwirl />
                    </span>
                    mp
                  </div>
                  <h1 className="text-sm font-medium ">
                    {" "}
                    <NumberCounter number={data.pet.currentManaCost} />{" "}
                  </h1>
                </div>
              </div>
              <section className="flex gap-4 flex-col flex-wrap">
                <div>
                  <div className="flex flex-col gap-2 ">
                    <div>
                      <div className=" font-bold text-lg  pb-1">Class</div>
                      <div className="flex flex-wrap gap-2 pb-1">
                        <div
                          style={{ backgroundColor: classStyle.color }}
                          className="p-2  px-3 font-bold min-w-[95px] gap-1 h-[30px]  rounded-[0.75rem]   flex items-center justify-center"
                        >
                          {classStyle.icon}
                          {classStyle.class}
                        </div>

                        <p className="text-muted-foreground text-sm  leading-relaxed ">
                          {classStyle.effect},<br />
                          {classStyle.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  <h1 className=" font-bold text-lg  pb-1">Elements</h1>
                  <div className="flex flex-wrap md:gap-3 gap-2 ">
                    {elementStyles.map((el, index) => (
                      <div className="flex flex-wrap gap-2 pb-1">
                        <div
                          key={index}
                          style={{ backgroundColor: el.color }}
                          className="p-2 font-bold gap-1 min-w-[95px] h-[30px]  rounded-[0.75rem]  text-center flex items-center justify-center"
                        >
                          {el.icon}
                          {el.element}
                        </div>
                        <p className="text-muted-foreground text-sm  leading-relaxed ">
                          {el.effect},<br />
                          {el.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className="flex gap-4 flex-wrap">
                <div>
                  <h1 className=" font-bold text-lg  pb-1">
                    Elements Strong Against
                  </h1>
                  <div className="flex flex-wrap md:gap-3 gap-2">
                    {strongAgainstStyles.map((el, index) => (
                      <div
                        key={index}
                        style={{ backgroundColor: el.color }}
                        className="p-2 font-bold gap-1 min-w-[95px] h-[30px]  rounded-[0.75rem]  text-center flex items-center justify-center"
                      >
                        {el.icon}
                        {el.element}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
              <br />

              <section className="flex gap-4 flex-wrap">
                <div>
                  <h1 className=" font-bold text-lg  pb-1 ">
                    Elements weak Against
                  </h1>
                  <div className="flex flex-wrap md:gap-3 gap-2">
                    {weakAgainstStyles.map((el, index) => (
                      <div
                        key={index}
                        style={{ backgroundColor: el.color }}
                        className="p-1 font-bold gap-1 min-w-[95px] h-[30px] rounded-[0.75rem]   text-center flex items-center justify-center"
                      >
                        {el.icon}
                        {el.element}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </section>
          </section>
        </ScrollArea>
      )}
    </>
  );
};

export default PetView;
