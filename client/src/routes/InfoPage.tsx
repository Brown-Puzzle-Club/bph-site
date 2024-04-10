import ProgressDocs from "@/components/ProgressDocs";
import { FaCar } from "react-icons/fa";
import { FaBus, FaLocationDot, FaTrain } from "react-icons/fa6";

import macmillan from "../assets/info/macmillan_squiggle.png";
import salomon from "../assets/info/salomon_squiggle.png";

import brown from "../assets/info/browndooble.svg";
import team from "../assets/info/dooble1.svg";
import guy from "../assets/info/dooble3.svg";
import gift from "../assets/info/giftdooble.svg";
import google from "../assets/info/googlydooble.svg";
import hooray from "../assets/info/kingdooble.svg";
import building from "../assets/info/kongdooble.svg";
import rubix from "../assets/info/rubixdooble.svg";
import wiggle from "../assets/info/squigglydooble.svg";
import waiver from "../assets/info/waiverdooble.svg";
import { HashLink as Link } from "react-router-hash-link";

const smoothScroll = (element_id: string) => {
  const element = document.getElementById(element_id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

const LocationBox = ({
  location_name,
  location_addr,
  location_desc,
  map_link,
  img_src,
  justify_left,
}: {
  location_name: string;
  location_addr: string;
  location_desc: string;
  map_link: string;
  img_src?: string;
  justify_left?: boolean;
}) => {
  return (
    <div
      className={`location-box flex items-center flex-1 ${
        justify_left ? "justify-start" : "justify-end"
      }`}
    >
      {justify_left && (
        <div className="map float-left">
          <img className="object-contain h-40 w-40" src={img_src}></img>
        </div>
      )}
      <div className={`text flex flex-col px-5 ${(!justify_left && "text-right") || "text-left"}`}>
        <h6 className="name text-xl md:text-3xl font-bold text-white tracking-wide">
          {location_name}
        </h6>
        <a className="location" href={map_link}>
          {!justify_left && <FaLocationDot className="inline-block" />}
          {location_addr}
          {justify_left && <FaLocationDot className="inline-block" />}
        </a>
        <div className="description text-[#94a3b8]">{location_desc}</div>
      </div>
      {!justify_left && (
        <div className="map float-right">
          <img className="object-contain h-60 w-60" src={img_src}></img>
        </div>
      )}
    </div>
  );
};

export default function InfoPage() {
  //bg-[#02031d]
  return (
    <div className="info bg-slate-900 text-white h-[90vh]">
      <ProgressDocs>
        <h1 id="important-info">Important Info</h1>
        <h4>What is this?</h4>
        <img className="h-52 invert float-right m-4" src={wiggle} />
        <div>
          <p>
            This is a puzzlehunt! Teams of people will compete to solve puzzles (think escape room,
            not jigsaw) using information both online and in real life. Brown Puzzlehunt 2024 is
            Brown Puzzle Club's second annual puzzlehunt; to see an example of a complete event,
            check out last year's <a href="https://2023.brownpuzzlehunt.com/">hunt archive</a>.
          </p>
        </div>
        <h4 className="pb-2">When and where is it?</h4>
        <div>
          <p>
            <b className="text-lg pb-2">Brown Puzzlehunt 2024</b> is taking place at{" "}
            <b className="text-lg pb-2">Brown University, in Providence, Rhode Island.</b>
          </p>
          <p>
            <b className="text-lg pb-2">Kickoff</b> will start promptly on{" "}
            <strong>Saturday, April 13, 2024 at 11:00 AM EDT</strong>, in{" "}
            <b>MacMillan Hall Room 117</b>, with doors opening at <b>10:30 AM</b>.
          </p>
          <p>
            <b className="text-lg pb-2">Puzzles</b> will be released on{" "}
            <strong>Saturday, April 13, 2024 at 12:00 PM EDT</strong>. HQ will close on{" "}
            <strong>Sunday, April 14, 2024 at 7:00 PM EDT</strong>, at which point hints will no
            longer be answered, the leaderboard will be frozen, and physical puzzles will no longer
            be available to be picked up.
          </p>
          <p>
            <b className="text-lg pb-2">In-person puzzles</b> will require a physical presence
            on-campus.
            <br />
            <b className="text-lg pb-2">Physical puzzles</b> will require collecting objects from
            HQ.
            <br />
            <b className="text-lg pb-2">Events</b> are not essential to finish, but will be fun and
            help you progress.
          </p>
          <p>
            <b className="text-lg pb-2">Wrap-up</b> will be held on{" "}
            <strong>Sunday, April 14, 2024 at 8:30 PM EDT</strong> in <b>MacMillan Hall Room 117</b>
            , with doors opening at <b>8:15pm</b>. Kickoff and Wrap-up will both be livestreamed.
          </p>
        </div>
        <h4>What's the goal?</h4>
        <img className="h-52 invert float-right m-4" src={gift} />
        <div>
          <p>
            Teams will compete to be the first to earn Brown Investigation Bureau's prestigious
            'Detective of the Month' award!
          </p>
          <p>
            Any detective worth their salt would kill for this title! But watch out - only teams
            present in-person for the final runaround of the hunt are eligible to claim it for
            themselves.
          </p>
          <p>
            Additionally, for your team to win, you must have at least one current Brown/RISD
            student on-campus. If you don't have a current Brown/RISD student on your team, you'll
            be able to do the final runaround, but you won't be able to win.
          </p>
        </div>
        <img className="h-48 invert float-left m-4" src={team} />
        <div className="text-right">
          <h4>Who can participate?</h4>
          <p>
            Brown Puzzlehunt is open to anyone, anywhere in the world. We have taken steps to ensure
            that every puzzle is accessible to remote solvers (except for the final runaround).
            However, teams familiar with Brown/RISD culture may have some advantage in solving
            puzzles.
          </p>
          <p>
            <b>We recommend teams to be around 7 to 10 people</b>. The maximum team size is 12
            people, but there's no minimum team size - you can still have fun with a team of 2!
            Students and those new to hunting are encouraged to build teams on the larger side.
          </p>
        </div>
        <h4>How do puzzles work?</h4>
        <img className="h-60 invert float-right m-4" src={rubix} />
        <div>
          <p>
            All puzzles will be visible on the website. This is where you will submit your answers
            and receive new puzzles. If something on-campus is part of a puzzle, the website will
            direct you towards it first.
          </p>
          <p>
            Some puzzles will be available at the start of the hunt, and solving puzzles will lead
            to unlocking more puzzles.
          </p>
          <p>Each answer is a string of letters A-Z. Answers are not case- or space-sensitive.</p>
          <p>
            You have <b>20 total guesses</b> for each puzzle. If you run out of guesses,{" "}
            <Link to="/contact">contact us</Link>, and we would be happy to grant more. Random
            guessing and brute-forcing are discouraged.
          </p>
        </div>
        <img className="h-72 invert float-left m-4" src={hooray} />
        <div className="text-right">
          <h4>How do hints work?</h4>
          <p>
            Starting on <strong>Saturday, April 13, 2024</strong>, at <b>3:00 PM EDT</b>, teams will
            gain one hint request every three hours, which they can use to ask for help on any
            puzzle.
          </p>
          <p>
            You can use a hint to get help on a puzzle. This can be something like a nudge in the
            right direction (i.e. you give us your progress on the puzzle and we'll try to get you
            unstuck) or an answer to a question (e.g. “Which answers to these crossword clues are
            wrong?”).
          </p>
          <p>
            If you are a beginner student team or a team with a strong on-site presence that is not
            in the running to win, we will also visit you frequently to check on your progress and
            help you along.{" "}
            <b className="bg-[#1d3650]">If you are struggling, do not hesitate to reach out</b> —
            the event is meant to be fun, and we want to ensure no hunter is left behind! If you
            want someone on HQ to come and visit you, you can email us at any time.
          </p>
          <p>
            You can only have <b>one open hint request</b> at a time.
          </p>
        </div>
        <h4>I'm a non-Brown/RISD participant on-campus.</h4>
        <div>
          <p>
            Anyone who is participating on-campus will need to print and fill out{" "}
            <a href="https://studentactivities.brown.edu/sites/default/files/safety/Physical%20Activity%20Release.pdf">
              this waiver form
            </a>
            . We'll collect these at kickoff.
          </p>
          <p>
            For essential information, check out{" "}
            <a onClick={() => smoothScroll("on-campus")}>On-Campus</a> Information.
          </p>
        </div>
        <h4>What else?</h4>
        <img className="h-60 invert float-right m-4" src={google} />
        <div>
          <p>
            You may use any external sources for help, including other people, as long as they
            aren't helping other teams and aren't actively participating in the hunt.
          </p>
          <p>
            <b className="bg-[#1d3650]">Use of Google is not only permitted, but essential</b>. You
            may also benefit from other online tools, such as:
          </p>
          <ul className="pl-3">
            <li>
              Online wordplay solvers: <a href="https://nutrimatic.org/">nutrimatic</a>,{" "}
              <a href="https://www.quinapalus.com/qat.html">qat</a>, or{" "}
              <a href="https://onelook.com/">OneLook</a>
            </li>
            <li>
              Logic puzzle solvers: <a href="https://www.noq.solutions/">noq</a>
            </li>
            <li>
              Reverse image searching tools: <a href="https://lens.google/">Google Lens</a> or{" "}
              <a href="https://tineye.com/">Tineye</a>
            </li>
          </ul>
          <p>You may not publicly stream a solve of our hunt when the hunt is live.</p>
          <p>
            It won't be necessary to look at the HTML source/JavaScript/CSS on any webpages for any
            puzzle. Infractions or abuse of these elements may be grounds for disqualification or
            removal from the hunt.
          </p>
          <p>We reserve the right to disqualify any team for unsportsmanlike conduct.</p>
          <p>
            We reserve the right to change any of these rules. If there's a big change, we'll
            announce it to all teams.
          </p>
          <p>
            If you have any questions about these rules, or if you want to contact us for any
            reason, feel free to <Link to="/contact">contact us</Link>.
          </p>
        </div>
        <h1 id="FAQ">FAQs</h1>
        <h4>What is a puzzlehunt? How do I solve these puzzles?</h4>
        <div>
          <p>
            If you've never heard of puzzlehunts before, here's a very brief summary: in a typical
            puzzle, you receive some information and have to extract an answer out of it, which is
            almost always an English word or phrase. Puzzles can come in many different forms; the
            only real commonality is that you usually receive no direct instructions, so it's up to
            you to figure out how to make sense of the information you're given. You can read a
            longer introduction to puzzlehunts{" "}
            <a href="https://blog.vero.site/post/puzzlehunts">here</a>.
          </p>
          <p>
            If you are new to puzzles and are interested in seeing some examples, or if you're
            looking for some practice, we recommend looking at puzzles from other online hunts such
            as <a href="https://galacticpuzzlehunt.com/">Galactic Puzzle Hunt</a>,{" "}
            <a href="https://teammatehunt.com/">Teammate Hunt</a>, or{" "}
            <a href="https://puzzlepotluck.com/">Puzzle Potluck</a>. You can also check out last
            year's <a href="https://2023.brownpuzzlehunt.com/">Brown Puzzlehunt</a>.
          </p>
        </div>
        <h4>Who's writing this hunt?</h4>
        <img className="h-36 invert float-right m-4" src={guy} />
        <div>
          <p>
            Check out our <Link to="/credits">Credits</Link> page!
          </p>
        </div>
        <h4>How hard will this hunt be? How long will it be?</h4>
        <div>
          <p>
            We've designed this hunt to be a{" "}
            <b className="bg-[#1d3650]">
              relatively easy introduction to puzzlehunting for beginner teams
            </b>
            , while also showcasing what makes puzzlehunts so fun.
          </p>
          <p>
            We expect this year's Brown Puzzlehunt to be roughly the same length as last year's, but
            much easier towards the start. Highly experienced, somewhat insane online-only teams may
            finish all online components in only a few hours, but we expect and encourage teams
            engaging with the on-campus puzzles to take longer.
          </p>
        </div>
        <h4>What's unique about this puzzlehunt?</h4>
        <img className="w-1/4 invert float-right m-4" src={brown} />
        <div>
          <p>
            Brown Puzzlehunt is a hunt written by current Brown and RISD students, and we hope that
            we are able to share some of the unique history, culture, and student zeitgeist with the
            puzzle community! We're also excited to explore the unique possibility space of
            in-person puzzles.
          </p>
        </div>
        <h4 id="stuck">I'm stuck on a puzzle. What should I do?</h4>
        <div>
          <p>Here are some general puzzle tips that might be useful:</p>
          <ul>
            <li>
              Thoroughly check the work that you've already done. Fixing a small mistake or
              incorrect assumption can greatly help with getting unstuck.
            </li>
            <li>
              Get fresh eyes on the puzzle, or conversely, take a break and look at something else.
            </li>
            <li>Consider what information you haven't used yet.</li>
            <li>Put everything you have into your favorite search engine.</li>
            <li>
              Look at{" "}
              <a href="https://devjoe.appspot.com/huntindex/index/keywords.html">
                similar examples
              </a>{" "}
              of the puzzle type you're working on.
            </li>
            <li>
              <a href="https://beta.vero.site/try">Have you tried…</a>
            </li>
          </ul>
          <p>
            Remember that after hints are released, you can also use them to get a nudge in the
            right direction. Please use them if you're stuck!
          </p>
        </div>
        <h4>I think there's a mistake in this puzzle!</h4>
        <div>
          <p>
            Please describe the error in a <Link to="/contact">contact HQ</Link> submission and
            we'll try to correct it.
          </p>
        </div>
        <h4>I have a question that's not on this list!</h4>
        <div>
          <p>
            Please <Link to="/contact">contact HQ</Link> and we'll do our best to answer it.
          </p>
        </div>
        <h1 id="on-campus">On-Campus</h1>
        <p>
          Visitors and guests are allowed on the Brown University campus without specific approvals
          or permissions. This means that all puzzlehunters are welcome to access the greens,
          outdoor areas, and some buildings during daylight hours. If you want to experience Brown
          Puzzlehunt while being on-campus, this section will help you with information and
          logistics!
        </p>
        <img className="h-60 invert float-left m-4" src={waiver} />
        <div className="text-right">
          <h4>Being Safe On-Campus</h4>
          <p>
            Brown University is not a playground for puzzlers; it is also a live university, with
            classes, students, faculty, research, and other events happening all the time. If you're
            going to be on-site,{" "}
            <b className="bg-[#1d3650]">
              please be respectful of both the community and the campus
            </b>
            .
          </p>
          <p>
            Brown Puzzlehunt will not require you to do anything illegal, immoral, or untoward,
            including accessing unauthorized spaces. If you think that a puzzle is asking you to do
            something dangerous, against the law, or disrespectful, stop and think. If you're really
            not sure, please <Link to="/contact">contact us</Link> and check.
          </p>
          <p>
            Anyone who is attending on-campus will need to print and fill out{" "}
            <a href="https://studentactivities.brown.edu/sites/default/files/safety/Physical%20Activity%20Release.pdf">
              this waiver form
            </a>
            . We'll collect these at kickoff.
          </p>
        </div>
        <h4>Minors</h4>
        <div>
          <p>
            Unfortunately, we are not in a position to accommodate minors on-campus (participants
            who are not Brown or RISD students and who are under the age of 18). Sorry! However,
            minors are welcome to participate remotely, and teams with minors can still send other
            participants who are over the age of 18 to campus to participate.
          </p>
        </div>
        <h4>Locations to Know</h4>
        <div>
          <div className="locations flex flex-col lg:flex-row items-center pt-5">
            <LocationBox
              location_name="Kickoff"
              location_addr="MacMillan Hall Room 117"
              location_desc="Doors open at 10:30 AM EDT."
              map_link="https://maps.app.goo.gl/p7xAA65kqwhHXH147"
              img_src={macmillan}
              justify_left={true}
            />
            <LocationBox
              location_name="Brown Puzzle Club HQ"
              location_addr="Salomon Center Room 003"
              location_desc="Enter through the west side through the Main Green entrance, and descend the stairs."
              img_src={salomon}
              map_link="https://www.google.com/maps/place/Salomon+Center/@41.8265578,-71.4031996,18.51z/data=!4m14!1m7!3m6!1s0x89e4453cc2dcb3eb:0x3b5e63a94276b39c!2sSalomon+Center!8m2!3d41.8265309!4d-71.4024032!16s%2Fg%2F11bbrgkqyc!3m5!1s0x89e4453cc2dcb3eb:0x3b5e63a94276b39c!8m2!3d41.8265309!4d-71.4024032!16s%2Fg%2F11bbrgkqyc"
            />
          </div>
          <p>
            Some events and puzzles might use locations that require card swipe access, which is
            limited to current undergraduate or graduate students (or some faculty). Puzzles which
            require this will be kept to a minimum and, where applicable, clearly marked as such. If
            you know ahead of time that you'll want to participate in these puzzles but have no
            current students on your team, <Link to="/contact">contact us</Link> before the hunt and
            we'll find a way to get that sorted.
          </p>
        </div>
        <h4>Getting to Providence</h4>
        <div className="pt-2">
          <div className="transport-box flex items-center">
            <div className="title">
              <FaTrain className="w-20 h-20 py-2" />
            </div>
            <span>
              Brown University is a 10-15 minute walk from our nearest train station, Providence
              Station, which is across the river from College Hill. If you're traveling from Boston,
              we recommend Amtrak Northeast Regional as the least expensive provider. Providence is
              also accessible via the MBTA Rapid Transit system, along the Providence/Stoughton
              line, starting at South Station.
            </span>
          </div>
          <div className="transport-box flex items-center">
            <div className="title">
              <FaBus className="w-20 h-20 py-2" />
            </div>
            <span>
              There are a number of bus companies which provide bus services from cities in the New
              England and New York area and beyond terminating to Providence, including but not
              limited to: FlixBus, Peter Pan Lines, and Greyhound.
            </span>
          </div>
          <div className="transport-box flex items-center">
            <div className="title">
              <FaCar className="w-20 h-20 py-2" />
            </div>
            <span>
              Providence lies at the intersection of Interstate 95 and Interstate 195. For non-Brown
              community members and visitors, parking is available at the Lot 68 Visitor Parking
              Garage, also known as the Power Street Parking Garage, located at 111 Power Street.
              The visitor entrance is located at the intersection of Power and Thayer Streets.
              Parking costs $2.00 per hour over the weekend. If you want overnight parking or
              require a permit for more than one day, you can <Link to="/contact">contact us</Link>{" "}
              and we'll try to help you out.
            </span>
          </div>
        </div>
        <h4>Accommodation</h4>
        <div>
          <p>
            Unfortunately, we are unable to provide accommodation or discounted rates for teams who
            wish to stay on-campus overnight.
          </p>
        </div>
        <h4>Solving Spaces</h4>
        <img className="h-60 invert float-right m-4" src={building} />
        <div>
          <p>
            If you are going to be on-campus,{" "}
            <b>we will need you to let us know where your HQ is</b>. This is the location where you
            will be spending most of your time solving puzzles while you're on-campus. If you are a
            student team or have student members, this might be a dorm common area or an apartment
            near campus, or a noise-tolerant space like the Student Center or some floors of the
            SciLi.
          </p>
          <p>
            If you need a place for your team to work during the hunt, let us know during the
            registration process and we will try to accommodate you. Our ability to allocate
            classrooms like this will be limited, so we will prioritize teams which do not have
            other spaces available and who register in advance.
          </p>
        </div>
        <h4>Events</h4>
        <div>
          <p>
            We're excited to say that there will be events on-campus! These events will provide one
            “free solve” to teams who complete it, which can be used to get the answer to a puzzle
            that they're stuck on. Anyone who is on-campus during the event is welcome to
            participate.
          </p>
          <div className="events flex flex-col md:flex-row p-5 space-y-5 md:space-y-0">
            <div className="event-box bg-red items-center flex-auto lg:w-1/3 text-center">
              <div className="title text-xl font-bold">Event #1</div>
              <div className="time">Saturday 3:00 PM EDT</div>
            </div>
            <div className="event-box bg-red items-center flex-auto lg:w-1/3 text-center">
              <div className="title text-xl font-bold">Event #2</div>
              <div className="time">Saturday 8:00 PM EDT</div>
            </div>
            <div className="event-box bg-red items-center flex-auto lg:w-1/3 text-center">
              <div className="title text-xl font-bold">Event #3</div>
              <div className="time">Sunday 12:00 PM EDT</div>
            </div>
          </div>
          <p>These timings may be subject to change.</p>
        </div>
        <h4>Other</h4>
        <div>
          <p>
            If you have any other questions, please <Link to="/contact">contact us</Link> at any
            time!
          </p>
        </div>
      </ProgressDocs>
    </div>
  );
}
