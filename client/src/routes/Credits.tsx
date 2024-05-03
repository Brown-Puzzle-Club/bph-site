import { useEffect } from "react";
import { HashLink as Link } from "react-router-hash-link";

import ArtCredit from "@/components/ArtCredits";
import { useTheme } from "@/hooks/useTheme";
import { DEFAULT_THEME } from "@/utils/themes";

export default function Credits() {
  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme(DEFAULT_THEME);
  }, [setTheme]);

  return (
    <div className="credits bg-slate-900 text-white overscroll-contain overflow-hidden overflow-y-auto ">
      <div className="credits-top text-center p-5">
        <p>
          Brown Puzzlehunt is put together by <Link to="/club">Brown Puzzle Club</Link>.
        </p>
      </div>
      <div className="credits-content text-center dark bg-gradient-to-b from-muted/50 to-muted/80 p-6 no-underline outline-none focus:shadow-md btn-gradient-1 relative mx-[5%] md:mx-[20%]">
        <div className="credits-box btn-gradient-bot pb-5">
          <h4 className="text-5xl font-bold pb-5">Leadership</h4>
          <ul>
            <li>
              <b>General Director:</b> <strong>Nishka Pant</strong> (&apos;24)
            </li>
            <li>
              <b>Puzzle Construction Director:</b> <strong>Thomas Gordon</strong> (&apos;26)
            </li>
            <li>
              <b>Puzzle Test Director:</b> <strong>Ian Rider</strong> (&apos;24)
            </li>
            <li>
              <b>Tech + Design Director:</b> <strong>Orion Bloomfield</strong> (&apos;24)
            </li>
            <li>
              <b>Art Director:</b> <strong>Jaclyn Cohen</strong> (&apos;26)
            </li>
            <li>
              <b>Story Director:</b> <strong>Aren Guralp</strong> (&apos;27)
            </li>
          </ul>
        </div>

        <div className="credits-box py-5 btn-gradient-bot">
          <h4 className="text-2xl font-bold pb-3">Puzzle Writers / HQ</h4>
          <ul>
            <li>
              <strong>Sierra Bornheim</strong> (&apos;24)
            </li>
            <li>
              <strong>Orion Bloomfield</strong> (&apos;24)
            </li>
            <li>
              <strong>Jiahua Chen</strong> (&apos;24)
            </li>
            <li>
              <strong>Alex Duchnowski</strong> (&apos;24)
            </li>
            <li>
              <strong>Lorenzo Mahoney</strong> (&apos;24)
            </li>
            <li>
              <strong>Abigail Nelkin</strong> (&apos;24)
            </li>
            <li>
              <strong>Nishka Pant</strong> (&apos;24)
            </li>
            <li>
              <strong>Ian Rider</strong> (&apos;24)
            </li>
            <li>
              <strong>Jay Sarva</strong> (&apos;24.5)
            </li>
            <li>
              <strong>Jeremy Fleming</strong> (&apos;25)
            </li>
            <li>
              <strong>Zach Gottshall</strong> (&apos;25)
            </li>
            <li>
              <strong>Megan Carlson</strong> (&apos;26)
            </li>
            <li>
              <strong>Julia Ceccarelli</strong> (&apos;26)
            </li>
            <li>
              <strong>Thomas Gordon</strong> (&apos;26)
            </li>
            <li>
              <strong>Bailey Merlino</strong> (&apos;26)
            </li>
            <li>
              <strong>Phil Avilov</strong> (RISD &apos;27)
            </li>
            <li>
              <strong>Audrey Feigin</strong> (&apos;27)
            </li>
            <li>
              <strong>Erin Finn</strong> (&apos;27)
            </li>
            <li>
              <strong>Eliot Geer</strong> (&apos;27)
            </li>
            <li>
              <strong>Aren Guralp</strong> (&apos;27)
            </li>
            <li>
              <strong>Alex Wang</strong> (&apos;27)
            </li>
            <li>
              <strong>Thomas Mowen</strong>
            </li>
            <li>
              <strong>Liam Oliva</strong>
            </li>
          </ul>
        </div>

        <div className="credits-box py-5 btn-gradient-bot">
          <h4 className="text-2xl font-bold pb-3">Art Team</h4>
          <ul>
            <li>
              (<b>Team Lead</b>) <strong>Jaclyn Cohen</strong> (&apos;26)
              <ArtCredit artist="Jaclyn Cohen" />
            </li>
            <li>
              <strong>Lucid Clairvoyant</strong> (&apos;24)
              <ArtCredit artist="Lucid Clairvoyant" />
            </li>
            <li>
              <strong>
                Michelle Ding (@<a href="https://www.instagram.com/fishing.ttf/">fishing.ttf</a>)
              </strong>{" "}
              (RISD &apos;24)
              <ArtCredit artist="Michelle Ding" />
            </li>
            <li>
              <strong>Christine Wang</strong> (RISD &apos;24)
              <ArtCredit artist="Christine Wang" />
            </li>
            <li>
              <strong>Bailey Merlino</strong> (&apos;26)
              <ArtCredit artist="Bailey Merlino" />
            </li>
            <li>
              <strong>Eliot Geer</strong> (&apos;27)
              <ArtCredit artist="Eliot Geer" />
            </li>
            <li>
              <strong>Annie Johnson</strong> (&apos;27)
              <ArtCredit artist="Annie Johnson" />
            </li>
            <li>
              <strong>Phil Avilov</strong> (RISD &apos;27)
              <ArtCredit artist="Phil Avilov" />
            </li>
            <li>
              <strong>
                Talia Bloomfield (@<a href="https://marshmanta.carrd.co/">Pix</a>)
              </strong>
              <ArtCredit artist="Talia Bloomfield" />
            </li>
            <li>
              <strong>
                Kristine Lee (@<a href="https://www.instagram.com/codnjs.oo/">codnjs.oo</a>)
              </strong>
              <ArtCredit artist="Kristine Lee" />
            </li>
          </ul>
        </div>

        <div className="credits-box py-5 btn-gradient-bot">
          <h4 className="text-2xl font-bold pb-3">Tech Team</h4>
          <ul>
            <li>
              (<b>Team Lead</b>) <strong>Orion Bloomfield</strong> (&apos;24)
            </li>
            <li>
              <strong>Nick Bottone</strong> (&apos;24)
            </li>
            <li>
              <strong>Jiahua Chens</strong> (&apos;24)
            </li>
            <li>
              <strong>Hammad Izhar</strong> (&apos;24)
            </li>
            <li>
              <strong>Andrew Li</strong> (&apos;24)
            </li>
            <li>
              <strong>Ryan Huang</strong> (&apos;26)
            </li>
            <li>
              <strong>Owen Carson</strong> (&apos;25) (design)
            </li>
            <li>
              <strong>Tenzin Choezin</strong> (&apos;25) (design)
            </li>
            <li>
              <strong>Laurence Nunes</strong> (&apos;27) (design)
            </li>
          </ul>
        </div>

        <div className="credits-box py-5">
          <h4 className="text-xl font-bold pb-3">Special Thanks</h4>
          <ul>
            <li className="py-1">
              To <strong>Karan Kashyap</strong> and Full Stack at Brown for their support roping in
              developers and designers for our website.
            </li>
            <li className="py-1">
              To <strong>Josh, Joe,</strong> and <strong>Steve</strong> for their eager willingness
              to record shenanigans about blue detective animals.
            </li>
            <li className="py-1">
              To <strong>Heidi Erwin</strong> for inspiring our club members, and for completing our
              Connections puzzle.
            </li>
            <li className="py-1">
              To <strong>Cassie Sutten Coats</strong> and Brown SAO for the guidance, kind words,
              and permission to book every remaining classroom space on campus.
            </li>
          </ul>
        </div>
      </div>

      <div className="credits-end text-center py-5">
        <p>
          We hope you enjoy our second annual hunt! If you are affiliated with Brown and are
          interested in joining our team, please <Link to="/club">join the club</Link> and/or{" "}
          <a href="mailto:puzzle@brown.edu">email us</a>!
        </p>
      </div>
    </div>
  );
}
