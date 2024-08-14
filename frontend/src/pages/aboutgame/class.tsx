import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button"; // Import Button component

import fireBackground from "@/assets/static/aboutPage/Default_Fire_Arena_Volcanic_CraterDescription_The_Fire_Arena_i_0.jpg";
import breaker from "@/assets/static/aboutClass/breaker.jpg";
import guardian from "@/assets/static/aboutClass/guardian.jpg";
import nimph from "@/assets/static/aboutClass/nimph.jpg";
import Predator from "@/assets/static/aboutClass/Predator.jpg";
import {
  GiCompass,
  GiGems,
  GiBattleGear,
  GiRollingDices,
  GiSpellBook,
  GiTurtleShell,
  GiPorcupine,
  GiTigerHead,
  GiFairyWings,
} from "react-icons/gi";
import { Card, CardContent } from "@/components/ui/card";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const ClassData = {
  Guardian: {
    color: "#2E7D32",
    class: "Guardian",
    icon: <GiTurtleShell />,
    effect: "Provides exceptional defense and protection for allies.",
    illustration: guardian,
    description:
      "The Guardian is the stalwart defender of the realm, embodying the essence of protection and resilience. Guardians are the backbone of any team, providing unmatched defense and shielding allies from harm. Their presence is a beacon of hope and safety, as they stand firm against the fiercest of foes, absorbing damage and preventing allies from falling in battle. Guardians are essential for sustaining the team's morale and ensuring their survival through the toughest encounters.",
  },
  Breaker: {
    color: "#8B4513",
    class: "Breaker",
    icon: <GiPorcupine />,
    effect: "Breaks through enemy defenses with powerful attacks.",
    illustration: breaker,
    description:
      "The Breaker is the relentless force of destruction, specializing in breaking through enemy defenses with raw power and ferocity. Breakers are the spearhead of any assault, wielding massive weapons and delivering crushing blows that can shatter the toughest fortifications. Their aggressive nature and overwhelming strength make them indispensable in offensive strategies, capable of turning the tide of battle by dismantling the enemy's defenses and paving the way for their allies to strike.",
  },
  Predator: {
    color: "#8B0000",
    class: "Predator",
    icon: <GiTigerHead />,
    effect: "Uses speed and ferocity to overwhelm opponents.",
    illustration: Predator,
    description:
      "The Predator is the swift and deadly hunter, using speed and ferocity to overwhelm opponents. Predators excel in hit-and-run tactics, striking quickly and retreating before the enemy can react. Their agility and precision make them formidable assassins, capable of taking down key targets with lethal efficiency. Predators thrive in chaos, using their keen senses and natural instincts to outmaneuver and outsmart their enemies, ensuring their prey has no chance of escape.",
  },
  Nimble: {
    color: "#AD1457",
    class: "Nimble",
    icon: <GiFairyWings />,
    effect: "Dodges attacks and strikes with precision and agility.",
    illustration: nimph,
    description:
      "The Nimble class is characterized by its agility and precision, excelling at dodging attacks and striking with pinpoint accuracy. Nimbles are elusive and graceful, moving with fluidity and finesse to outmaneuver their foes",
  },
};

const AboutClass = () => {
  const [activeClass, setActiveClass] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveClass(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    const sections = document.querySelectorAll("section");
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains("hidden1")) {
            entry.target.classList.add("show1");
          } else if (entry.target.classList.contains("hidden2")) {
            entry.target.classList.add("show2");
          }
        } else {
          if (entry.target.classList.contains("hidden1")) {
            entry.target.classList.remove("show1");
          } else if (entry.target.classList.contains("hidden2")) {
            entry.target.classList.remove("show2");
          }
        }
      });
    });

    const hiddenElements = document.querySelectorAll(".hidden1, .hidden2");
    hiddenElements.forEach((el) => observer.observe(el));

    return () => {
      hiddenElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const handleNavigationClick = (className) => {
    const classSection = document.getElementById(ClassData[className].class);
    if (classSection) {
      classSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <>
      <section className="md:px-2 px-0 flex w-screen order-1 flex-wrap overflow-hidden">
        {Object.keys(ClassData).map((className, index) => (
          <section
            id={ClassData[className].class}
            className="w-full h-screen relative bg-black"
            key={className}
          >
            <img
              src={ClassData[className].illustration}
              alt={className}
              className="w-full h-full opacity-20 object-cover"
              fetchpriority="high"
              loading="lazy"
            />
            <div
              className={`
                ${index % 2 === 0 ? "flex-row-reverse" : ""}
                absolute z-0 p-4 top-[70%] md:top-1/2 left-1/2 -translate-x-[50%] -translate-y-[65%] md:-translate-y-[50%] flex gap-5 flex-wrap items-start justify-center w-full
              `}
            >
              <Card
                style={{ backgroundColor: ClassData[className].color }}
                className={`md:w-[210px] card md:h-[310px] w-[150px] h-[250px] text-white rounded-[0.2rem] p-[0.35rem] relative overflow-hidden ${
                  index % 2 === 0 ? "hidden1" : "hidden2"
                }`}
              >
                <CardContent className="w-full h-full bg-muted p-0 z-0 relative bg-black">
                  <img
                    src={ClassData[className].illustration}
                    alt={className}
                    fetchpriority="high"
                    loading="lazy"
                    className="w-full h-full object-fill text-center shimmer opacity-80"
                  />
                </CardContent>
              </Card>
              <div
                className={`${
                  index % 2 === 0 ? "hidden2" : "hidden1"
                } w-full md:w-[60%] h-[300px] text-sm text-white rounded-lg flex flex-col gap-1 bg-transparent border-transparent`}
              >
                <div
                  style={{ backgroundColor: ClassData[className].color }}
                  className="p-2 font-bold w-[100px] gap-1 h-[35px] text-white rounded-full text-center flex items-center justify-center"
                >
                  <span className="text-2xl">{ClassData[className].icon}</span>
                  {ClassData[className].class}
                </div>
                <p className="text-muted-foreground pb-2">
                  {ClassData[className].description}{" "}
                  {ClassData[className].effect}
                </p>
              </div>
            </div>
          </section>
        ))}
        <div className="flex justify-center items-center w-full">
          <div className="flex flex-wrap gap-3 justify-center fixed bottom-3 md:bottom-4 transition-all duration-300 ease-in-out bg-white backdrop-filter backdrop-blur-lg bg-opacity-10 p-2 items-center w-fit rounded-[0.75rem] scale-90">
            <Sheet>
              <SheetTrigger asChild>
                <span className="text-2xl text-white hover:scale-110 transition-all duration-300 ease-in-out">
                  <GiCompass />
                </span>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle className="font-bold">The Classes</SheetTitle>
                </SheetHeader>
                <div className="flex flex-wrap gap-3 py-3">
                  {Object.keys(ClassData).map((className) => {
                    const isActive = ClassData[className].class === activeClass;
                    const classColor = ClassData[className].color;

                    return (
                      <button
                        key={className}
                        className={`p-2 font-bold  shadow-md bg-muted hover:scale-105 transition-all duration-300 ease min-w-[100px] gap-1 h-[35px] rounded-full text-center flex items-center justify-center ${
                          isActive ? "text-white" : ""
                        }`}
                        style={{
                          backgroundColor: isActive ? classColor : undefined,
                          color: isActive ? "white" : classColor,
                        }}
                        onClick={() => handleNavigationClick(className)}
                      >
                        <span className="text-lg">
                          {ClassData[className].icon}
                        </span>
                        {ClassData[className].class}
                      </button>
                    );
                  })}
                </div>
                <SheetHeader>
                  <SheetTitle className="font-bold">
                    <Link
                      to="/about/elements"
                      className="hover:text-muted transition-all duration-300 ease-in-out"
                    >
                      The Elements
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <SheetDescription className="flex flex-col gap-2 py-3">
                  <Link
                    to="/about-game/element"
                    className="text-md flex items-center scale-105 justify-between p-2 rounded-sm font-bold bg-transparent hover:bg-gradient-to-r from-red-400 via-yellow-400 to-blue-400 transition-all duration-300 ease-in-out dark:text-white text-black hover:text-white"
                  >
                    Elements
                    <span className="text-xl">
                      <GiGems />
                    </span>
                  </Link>
                  <Link
                    to="/about-game/Class"
                    className="text-md flex items-center hover:scale-105 justify-between p-2 rounded-sm font-bold bg-transparent bg-gradient-to-r from-gray-400 to-gray-600 transition-all duration-300 ease-in-out dark:text-white text-black hover:text-white"
                  >
                    Class
                    <span className="text-xl">
                      <GiBattleGear />
                    </span>
                  </Link>
                  <Link
                    to="/about-game/how-to-play"
                    className="text-md flex items-center hover:scale-105 justify-between p-2 rounded-sm font-bold bg-transparent hover:bg-gradient-to-r from-green-400 to-teal-400 transition-all duration-300 ease-in-out dark:text-white text-black hover:text-white"
                  >
                    How to Play
                    <span className="text-xl">
                      <GiRollingDices />
                    </span>
                  </Link>
                  <Link
                    to="/about-game/general-knowledge"
                    className="text-md flex items- hover:scale-105 justify-between p-2 rounded-sm font-bold bg-transparent hover:bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 ease-in-out dark:text-white text-black hover:text-white"
                  >
                    General Knowledge
                    <span className="text-xl">
                      <GiSpellBook />
                    </span>
                  </Link>
                </SheetDescription>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutClass;
