import { Link } from "react-router-dom";
import NavLinkComp from "./navlinksComponet";
import { GoHomeFill } from "react-icons/go";
import { GiPawPrint } from "react-icons/gi";
import { MdInventory2 } from "react-icons/md";
import { GrMoney } from "react-icons/gr";


interface NavBarCompProps {
  accessTokenState: { userAccessToken: any | null };
  refreshTokenState: { userRefreshToken: any | null };
  userState: { userInfo: any | null };
}



const NavBarComp: React.FC<NavBarCompProps> = ({ userState }) => {

  const navigationLinks = [
    { link: "home", url: "/", icon: GoHomeFill },
    { link: "duels", url: "/duels", icon: GiPawPrint },
    {
      link: "blackmarket",
      url: `/market/pet`,
      icon: GrMoney,
    },
    {
      link: "inventory",
      url: `/inventory/${userState?.userInfo?._id}/pet`,
      icon: MdInventory2,
    },
  ];
  return (
    <>
      {/* Desktop Navbar */}
      <nav className="md:w-[350px] backdrop-blur-3xl w-[100dvw] md:rounded-[0.75rem] fixed bottom-0 md:bottom-[0.3rem] left-1/2 -translate-x-[50%] z-[9999999]  bg-background border text-muted-foreground flex items-center justify-center py-2 px-5">
        <ul className="flex gap-5 justify-center items-center  md:w-[350px] w-[100dvw]">
          {navigationLinks.map((navLink, index) => {
            return (
              <li key={index} className="w-full text-center self-center">
                <NavLinkComp navigationLinks={[navLink]} />
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
};

export default NavBarComp;
