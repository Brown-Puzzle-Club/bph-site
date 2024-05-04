import { useState } from "react";
import { Link } from "react-router-dom";

import birbs_credit from "@/assets/art_credit/birbs.png";
import blues_clues_credit from "@/assets/art_credit/blues_clues.png";
import cat_credit from "@/assets/art_credit/cat_kris.jpg";
import data_credit from "@/assets/art_credit/data.png";
import eventpage_credit from "@/assets/art_credit/eventpage.png";
import exile_credit from "@/assets/art_credit/exile.png";
import funeral_poster from "@/assets/art_credit/funeral_poster.png";
import insta_credit from "@/assets/art_credit/insta.jpg";
import landing_credit from "@/assets/art_credit/landing.png";
import letter_credit from "@/assets/art_credit/letter.jpg";
import poster_credit from "@/assets/art_credit/poster.jpg";
import showdown_credit from "@/assets/art_credit/showdown.png";
import social_deduction_credit from "@/assets/art_credit/social_deduction.png";
import dotm from "@/assets/bdotm.png";
import bluenoir_angry from "@/assets/bluenoir/angry.png";
import bluenoir_neutral from "@/assets/bluenoir/bluenoir_neutral.png";
import bluenoir_curious from "@/assets/bluenoir/curious.png";
import bluenoir_embarassed from "@/assets/bluenoir/embarassed.png";
import bluenoir_evil from "@/assets/bluenoir/evil.png";
import bluenoir_excited from "@/assets/bluenoir/excited.png";
import bluenoir_happy from "@/assets/bluenoir/happy.png";
import bluenoir_nervous from "@/assets/bluenoir/nervous.png";
import bluenoir_proud from "@/assets/bluenoir/proud.png";
import bluenoir_sad from "@/assets/bluenoir/sad.png";
import bluenoir_sensitive from "@/assets/bluenoir/sensitive.png";
import bluenoir_smug from "@/assets/bluenoir/smug.png";
import bluenoir_surprised from "@/assets/bluenoir/surprised.png";
import bluenoir_thinking from "@/assets/bluenoir/thinking.png";
import bluenoir_tired from "@/assets/bluenoir/tired.png";
import gift_doodle from "@/assets/info/giftdooble.svg";
import blueno_what from "@/assets/landing/blueno_what.svg";
import cult_leader from "@/assets/main_page/CULT_LEADER.jpg";
import colored_thread_credit from "@/assets/major_cases/colored-thread/board.png";
import labyrithn_cover from "@/assets/minor_cases/labyrinth/labyrinth_cover.png";
import whales_credit from "@/assets/minor_cases/whales/background_whale.png";
import { cn } from "@/utils/utils";

import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";

interface ArtCreditItem {
  title: string;
  description?: string;
  src: string;
  link?: string;
  no_desc?: boolean;
  svg?: boolean;
}

const ART_CREDIT_DATA: Record<string, ArtCreditItem[]> = {
  "Michelle Ding": [
    {
      title: "Showdown!",
      src: showdown_credit,
      link: "/minorcase/showdown",
    },
  ],
  "Jaclyn Cohen": [
    {
      title: "Landing Page",
      src: landing_credit,
      link: "/",
      no_desc: true,
    },
    {
      title: "The Case of Data",
      src: data_credit,
      link: "/majorcase/data",
    },
    {
      title: "Bluenoir",
      src: bluenoir_happy,
      description: "(happy)",
    },
  ],
  "Lucid Clairvoyant": [
    {
      title: "Blue's Clues",
      src: blues_clues_credit,
      link: "/minorcase/blues-clues",
    },
    {
      title: "Birbs at Brown",
      src: birbs_credit,
      link: "/minorcase/birbs-at-brown",
    },
    {
      title: "Landing Page",
      src: blueno_what,
      link: "/",
      description: "bluenoir icons",
    },
    {
      title: "Info Page Doodles",
      src: gift_doodle,
      link: "/info",
      svg: true,
    },
    {
      title: "Bluenoir",
      src: bluenoir_excited,
      description: "(excited)",
    },
    {
      title: "Bluenoir",
      src: bluenoir_evil,
      description: "(evil)",
    },
  ],
  "Annie Johnson": [
    {
      title: "The Case of Social Deduction",
      src: social_deduction_credit,
      link: "/majorcase/social-deduction",
    },
    {
      title: "God of the Labyrinth",
      src: labyrithn_cover,
      link: "/minorcase/god-of-the-labyrinth",
    },
    {
      title: "Cult Leader",
      src: cult_leader,
      link: "/final-verdict",
    },
    {
      title: "Detective of the Month",
      src: dotm,
      link: "/final-page",
    },
    {
      title: "Bluenoir",
      src: bluenoir_neutral,
      description: "(neutral)",
    },
    {
      title: "Bluenoir",
      src: bluenoir_proud,
      description: "(proud)",
    },
    {
      title: "Bluenoir",
      src: bluenoir_thinking,
      description: "(thinking)",
    },
    {
      title: "Bluenoir",
      src: bluenoir_angry,
      description: "(angry)",
    },
  ],
  "Phil Avilov": [
    {
      title: "The Case of the Colored Thread",
      src: colored_thread_credit,
      link: "/majorcase/colored-thread",
    },
    {
      title: "Whales",
      src: whales_credit,
      link: "/minorcase/whales",
    },
    {
      title: "Bluenoir",
      src: bluenoir_smug,
      description: "(smug)",
    },
    {
      title: "Bluenoir",
      src: bluenoir_tired,
      description: "(tired)",
    },
  ],
  "Talia Bloomfield": [
    {
      title: "Bluenoir",
      src: bluenoir_nervous,
      description: "(nervous)",
    },
    {
      title: "Bluenoir",
      src: bluenoir_sensitive,
      description: "(sensitive)",
    },
  ],
  "Kristine Lee": [
    {
      title: "Blue's Clues Letter",
      src: letter_credit,
      link: "/puzzle/josh",
    },
    {
      title: "Mr. Cat Board",
      src: cat_credit,
      link: "/puzzle/mr-cat",
    },
  ],
  "Bailey Merlino": [
    {
      title: "Exile",
      src: exile_credit,
      link: "/minorcase/exile",
    },
    {
      title: "Bluenoir",
      src: bluenoir_sad,
      description: "(sad)",
    },
    {
      title: "Bluenoir",
      src: bluenoir_embarassed,
      description: "(embarassed)",
    },
  ],
  "Christine Wang": [
    {
      title: "Funeral Poster",
      src: funeral_poster,
    },
  ],
  "Eliot Geer": [
    {
      title: "Main Event Page",
      src: eventpage_credit,
      link: "/eventpage",
      description: "background, folders, phone... everything!",
    },
    {
      title: "Instagram",
      src: insta_credit,
      link: "https://www.instagram.com/brownpuzzlehunt/",
      description: "custom art for every post 🤩",
    },
    {
      title: "Hunt Posters",
      src: poster_credit,
      description: "Main posters for the event",
    },
    {
      title: "Bluenoir",
      src: bluenoir_surprised,
      description: "(surprised)",
    },
    {
      title: "Bluenoir",
      src: bluenoir_curious,
      description: "(curious)",
    },
  ],
};

const LinkWrapper = ({ link, children }: { link?: string; children: JSX.Element }) => {
  return link ? (
    !link.startsWith("https") ? (
      <Link to={link}>{children}</Link>
    ) : (
      <a href={link}>{children}</a>
    )
  ) : (
    <>{children}</>
  );
};

export default function ArtCredit({
  artist,
  children,
}: {
  artist: string;
  children?: JSX.Element;
}) {
  const artist_id = artist ? artist.split(" ")[0].toLowerCase() : "";
  const [open, setOpen] = useState(window.location.hash.includes(artist_id));

  return (
    <Drawer
      open={open}
      onOpenChange={(open) => {
        window.location.hash = open ? artist_id : "";
        setOpen(open);
      }}
    >
      <DrawerTrigger>
        {children ? (
          children
        ) : (
          <Button className="dark text-xs h-5 ml-2 font-mono bg-slate-600">CREDIT</Button>
        )}
      </DrawerTrigger>
      <DrawerContent className="dark text-white max-h-[90%]">
        <DrawerHeader className="overscroll-contain overflow-y-auto">
          <DrawerTitle className="pb-4">
            <h1 className="text-center text-3xl">{artist}</h1>
          </DrawerTitle>
          <DrawerDescription className="overscroll-contain overflow-y-auto">
            <div className="flex flex-wrap content-center items-stretch">
              {ART_CREDIT_DATA[artist] &&
                ART_CREDIT_DATA[artist].map((credit, i) => (
                  <Card
                    key={`credit-${artist_id}-${i}`}
                    className={cn(
                      "md:w-[18%] w-[12rem] m-2",
                      credit.link && "hover:drop-shadow-[0_15px_15px_rgba(255,255,255,0.2)]",
                    )}
                  >
                    <LinkWrapper link={credit.link}>
                      <>
                        <CardHeader>
                          <CardTitle>{credit.title}</CardTitle>
                          {credit.description || (credit.link && !credit.no_desc) ? (
                            <CardDescription>{credit.description || credit.link}</CardDescription>
                          ) : (
                            // lol quick fix for empty desc
                            // eslint-disable-next-line no-irregular-whitespace
                            <CardDescription> </CardDescription>
                          )}
                        </CardHeader>
                        <CardContent>
                          <img
                            src={credit.src}
                            className={cn(
                              "w-full h-44 object-cover border rounded-md",
                              credit.svg && "invert",
                            )}
                          />
                        </CardContent>
                      </>
                    </LinkWrapper>
                  </Card>
                ))}
            </div>
          </DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}
