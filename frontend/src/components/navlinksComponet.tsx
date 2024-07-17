import { NavLink } from "react-router-dom";
import React from "react";

interface NavigationLink {
  link: string;
  url: string;
  icon: React.ElementType; // Ensures the icon is a React component
}

interface NavLinkCompProps {
  navigationLinks: NavigationLink[]; // Accept navigation links as props
}

const NavLinkComp: React.FC<NavLinkCompProps> = ({ navigationLinks }) => {
  return (
    <section className="flex flex-col items-center justify-center space-y-3 w-full">
      {navigationLinks.map((navLink, index) => (
        <NavLink
          key={index}
          to={navLink.url}
          className={({ isActive }) =>
            `group flex justify-center items-center  p-[0.45rem] rounded-md drop-shadow-xl font-semibold transition-all duration-500 ${
              isActive
                ? "bg-primary scale-110 rounded-full text-foreground"
                : "hover:translate-y-[1.5px]  hover:rounded-[50%] hover:bg-primary hover:text-foreground hover:from-[#331029] hover:to-[#310413]"
            }`
          }
        >
          <navLink.icon className="w-5 h-5" />
          <span className="absolute py-1 px-2 rounded-sm backdrop-blur-3xl opacity-0 group-hover:opacity-100 group-hover:text-foreground group-hover:text-sm group-hover:-translate-y-10 duration-700">
            {navLink.link}
          </span>
        </NavLink>
      ))}
    </section>
  );
};

export default NavLinkComp;
