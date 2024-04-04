import * as React from "react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuRight,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/utils/utils";
import LoginNavbar from "./LoginNavbar";

import { useAuth } from "@/hooks/useAuth";
import { useDjangoContext } from "@/hooks/useDjangoContext";
import Countdown from "react-countdown";
import { BeatLoader } from "react-spinners";
import TeamNavbar from "./TeamNavbar";

import bluenoir_logo from "@/assets/navbar_logo_head.png";
import { useTheme } from "@/hooks/useTheme";
import { useState } from "react";
import { DEFAULT_THEME } from "@/utils/themes";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Event Details",
    href: "/info#important-info",
    description: "Information on when, where, and how to participate in the event.",
  },
  {
    title: "In-Person Participation",
    href: "/info#on-campus",
    description: "All are welcome to participate in-person! Find out more here.",
  },
  {
    title: "What is a puzzlehunt?",
    href: "/info#FAQ",
    description: "Details on our event structure with examples and helpful links.",
  },
  {
    title: "I'm stuck! What do I do?",
    href: "/info#stuck",
    description: "Resources and tips for when you're lost.",
  },
];

export const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none truncate">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});

const IconItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
  ({ className, title, ...props }, ref) => {
    return (
      <li>
        {/* TODO: make icon float on left side */}
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
          </a>
        </NavigationMenuLink>
      </li>
    );
  },
);

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
    <a
      href="/"
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
    </a>
  );
};

const NavbarLeft = () => {
  const { context } = useDjangoContext();

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
                    <a
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      href="/"
                    >
                      <div className="mb-2 mt-4 text-xl font-bold">The Hunt</div>
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
                    </a>
                  </NavigationMenuLink>
                </li>
                <IconItem href="/leaderboard" title="Leaderboard" />
                <IconItem href="/contact" title="Contact HQ" />
                <IconItem href="/credits" title="Hunt Credits" />
                <IconItem href="/archive" title="Past Hunts" />
                {/* <IconItem href="/club" title="Club Info" /> */}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Info</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                {components.map((component) => (
                  <ListItem key={component.title} title={component.title} href={component.href}>
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

const NavbarMiddle = () => {
  return <div className="middle flex justify-center text-white w-1/3"></div>;
};

const NavbarRight = () => {
  const { loggedIn, checkingLoginStatus } = useAuth();
  return (
    <div className="right flex justify-end w-1/3">
      <NavigationMenuRight>
        {(checkingLoginStatus && (
          <BeatLoader className="justify-center content-center pr-2" color={"#fff"} size={12} />
        )) ||
          (loggedIn && <TeamNavbar />) || <LoginNavbar />}
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
