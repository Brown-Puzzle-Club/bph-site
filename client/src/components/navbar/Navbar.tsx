import * as React from "react";
import { useState } from "react";
import Countdown from "react-countdown";
import { FaFolderOpen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import type { HashLinkProps as LinkProps } from "react-router-hash-link";
import { HashLink as Link } from "react-router-hash-link";
import { BeatLoader } from "react-spinners";

import hint_token from "@/assets/main_page/vote_icons/hintcoin.png";
import voucher_token from "@/assets/main_page/vote_icons/solvecoin.png";
import bluenoir_logo from "@/assets/navbar_logo_head.png";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuRight,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useAuth } from "@/hooks/useAuth";
import { useDjangoContext } from "@/hooks/useDjangoContext";
import { useTheme } from "@/hooks/useTheme";
import useBPHStore from "@/stores/useBPHStore";
import { DEFAULT_THEME } from "@/utils/themes";
import { cn } from "@/utils/utils";

import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import LoginNavbar from "./LoginNavbar";
import TeamNavbar from "./TeamNavbar";

const components: { title: string; to: string; description: string }[] = [
  {
    title: "Hunt Details",
    to: "/info#important-info",
    description: "Information on when, where, and how to participate in the event.",
  },
  {
    title: "In-Person Participation",
    to: "/info#on-campus",
    description: "All are welcome to participate in-person! Find out more here.",
  },
  {
    title: "What is a puzzlehunt?",
    to: "/info#FAQ",
    description: "Details on our event structure with examples and helpful links.",
  },
  {
    title: "I'm stuck! What do I do?",
    to: "/info#stuck",
    description: "Resources and tips for when you're lost.",
  },
];

export const ListItem = React.forwardRef<React.ElementRef<typeof Link>, Omit<LinkProps, "ref">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <Link
            smooth
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none truncate">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </Link>
        </NavigationMenuLink>
      </li>
    );
  },
);
ListItem.displayName = "ListItem";

const IconItem = React.forwardRef<React.ElementRef<typeof Link>, Omit<LinkProps, "ref">>(
  ({ className, title, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <Link
            smooth
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
          </Link>
        </NavigationMenuLink>
      </li>
    );
  },
);

IconItem.displayName = "IconItem";

const hunt_start_timer = ({
  days,
  hours,
  minutes,
  seconds,
  completed,
}: {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
}) => {
  if (completed) {
    return <span>Click to enter the site!!</span>;
  } else {
    return (
      <span>
        {days}d {hours}h {minutes}m {seconds}s
      </span>
    );
  }
};

const HuntLogo = () => {
  const [hover, setHover] = useState(false);

  return (
    <Link
      smooth
      to="/"
      className="text-white font-bold pl-3 pr-4 md:pr-1 whitespace-nowrap justify-center"
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
    >
      <img
        src={bluenoir_logo}
        alt="Brown Puzzlehunt 2024 Logo"
        className="h-7 w-7 inline mr-1"
        style={{
          transition: "200ms ease",
          transform: hover ? "rotate(20deg)" : "none",
        }}
      />
      <span>Brown Puzzlehunt</span>
    </Link>
  );
};

const NavbarLeft = () => {
  const { data: context } = useDjangoContext();
  const navigate = useNavigate();
  const setBluenoirStory = useBPHStore((state) => state.setStoryline);

  return (
    <div className="left flex justify-start w-1/3">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <HuntLogo />
          </NavigationMenuItem>
          <NavigationMenuItem className="pl-6">
            <NavigationMenuTrigger>The Hunt</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-4">
                  <NavigationMenuLink asChild>
                    <Link
                      smooth
                      className="group flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md hover:from-muted/60 hover:cursor-pointer"
                      to={context?.hunt_context?.hunt_has_started ? "/eventpage" : "/"}
                    >
                      <FaFolderOpen className="group-hover:text-slate-400 text-4xl" />
                      <div className="mb-2 mt-4 text-xl font-bold">Your Desk</div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        {context?.hunt_context?.hunt_has_started ? (
                          "The hunt has started! Good luck!"
                        ) : (
                          <Countdown
                            date={context?.hunt_context?.start_time}
                            renderer={hunt_start_timer}
                          />
                        )}
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <IconItem
                  to={context?.hunt_context.hunt_has_started ? "/puzzles" : "/"}
                  title="List of Puzzles"
                />
                <IconItem to="/leaderboard" title="Leaderboard" />
                <IconItem
                  to={context?.hunt_context.hunt_has_started ? "/story" : "/"}
                  title="Story So Far"
                />
                <IconItem to="/contact" title="Contact HQ" />
                {/* <IconItem to="/credits" title="Hunt Credits" /> */}
                {/* <IconItem to="/archive" title="Past Hunts" /> */}
                {/* <IconItem href="/club" title="Club Info" /> */}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Info</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                {components.map((component) => (
                  <ListItem key={component.title} title={component.title} to={component.to}>
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          {context?.hunt_context.hunt_has_started && !context?.hunt_context.hunt_is_closed && (
            <NavigationMenuItem>
              <Button
                className="bg-[grey] hover:text-black font-bold"
                onClick={() => {
                  setBluenoirStory("tutorial");
                  navigate("/eventpage");
                }}
              >
                Tutorial
              </Button>
            </NavigationMenuItem>
          )}
          {/* <NavigationMenuItem>
            <NavigationMenuItem>
              <Button className="dark hover:bg-accent" onClick={() => navigate("/wrapup")}>
                Wrap Up
              </Button>
            </NavigationMenuItem>
          </NavigationMenuItem> */}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

const NavbarMiddle = () => {
  return <div className="middle flex justify-center text-white w-1/3"></div>;
};

const NavbarRight = () => {
  const { team } = useAuth();
  const { isLoading, data: teamData } = team;
  const { data: context } = useDjangoContext();

  return (
    <div className="right flex justify-end w-1/3">
      <NavigationMenuRight>
        <div className="space-x-4">
          {context &&
          context?.hunt_context.hunt_has_started &&
          !context?.hunt_context.hunt_is_over &&
          context?.team_context.num_hints_remaining &&
          context?.team_context.num_hints_remaining > 0 ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="flex justify-center">
                  <div className="flex justify-center items-center text-white">
                    <img className={"max-w-[20px]"} src={hint_token} />
                    <span className="text-sm text-white">
                      x{context?.team_context.num_hints_remaining}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-900 text-white border-none">
                  <p>
                    Puzzle <b className="font-extrabold">H</b>ints Every{" "}
                    {context.hunt_context.hours_per_hint}hrs
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : null}
          {context &&
          context?.hunt_context.hunt_has_started &&
          !context?.hunt_context.hunt_is_over &&
          context?.team_context.num_free_answers_remaining &&
          context?.team_context.num_free_answers_remaining > 0 ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="flex justify-center">
                  <div className="flex justify-center items-center text-white">
                    <img className={"max-w-[20px]"} src={voucher_token} />
                    <span className="text-sm text-white">
                      x{context?.team_context.num_free_answers_remaining}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-900 text-white border-none">
                  <p>
                    Free Case <b className="font-extrabold">S</b>olves
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : null}
        </div>
        {(isLoading && (
          <BeatLoader className="justify-center content-center pr-2" color={"#fff"} size={12} />
        )) ||
          (teamData && <TeamNavbar />) || <LoginNavbar />}
      </NavigationMenuRight>
    </div>
  );
};

export default function Navbar() {
  const { theme } = useTheme();

  return (
    <div
      className={`navbar dark sticky top-0 z-40 w-full backdrop-blur-sm flex transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10 dark:border-slate-50/[0.06] supports-backdrop-blur:bg-white/60 dark:bg-transparent`}
      style={{
        backgroundColor: theme.navbar_color ? theme.navbar_color : DEFAULT_THEME.navbar_color,
      }}
    >
      <NavbarLeft />
      <NavbarMiddle />
      <NavbarRight />
    </div>
  );
}
