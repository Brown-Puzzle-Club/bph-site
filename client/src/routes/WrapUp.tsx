import { Link } from "react-router-dom";

import ProgressDocs from "@/components/ProgressDocs";

// import MinimalSolveGraph from "@/components/stats/MinimalSolveGraph";
// import { SortableTable } from "@/components/stats/SortableTable";

// const headers = ["Team", "Correct Answers", "Total Answers", "Answer Accuracy"];

// const dummyData = [
//   { team: "turtle", correctAnswers: 23, totalAnswers: 28, answerAccuracy: 82.14 },
//   { team: "GEORGIAN BEAR PAW", correctAnswers: 26, totalAnswers: 36, answerAccuracy: 72.22 },
//   { team: "Living Off Hope", correctAnswers: 28, totalAnswers: 40, answerAccuracy: 70.0 },
//   { team: "Blueno of the Elite Four", correctAnswers: 22, totalAnswers: 39, answerAccuracy: 56.41 },
//   { team: "beep boop", correctAnswers: 26, totalAnswers: 47, answerAccuracy: 55.32 },
//   { team: "Galactic Tax Exempt", correctAnswers: 26, totalAnswers: 48, answerAccuracy: 54.17 },
//   { team: "The Geese Geese", correctAnswers: 29, totalAnswers: 54, answerAccuracy: 53.7 },
// ];

// const dummyData2 = [
//   { team: "The 25 Venters", solveData: { date: new Date(1713079907668), count: 1 } },
//   { team: "The 25 Venters", solveData: { date: new Date(1713079907668), count: 2 } },
//   { team: "The 25 Venters", solveData: { date: new Date(1713080923024), count: 3 } },
//   { team: "The 25 Venters", solveData: { date: new Date(1713086864987), count: 4 } },
// ];

// const transformData = (header: string, data: Record<string, unknown>) => {
//   switch (header) {
//     case "Team":
//       return data.team as string;
//     case "Correct Answers":
//       return data.correctAnswers as string;
//     case "Total Answers":
//       return data.totalAnswers as string;
//     case "Answer Accuracy":
//       return `${data.answerAccuracy}%`;
//     default:
//       return "";
//   }
// };

// const extractKey = (data: Record<string, unknown>) => data.team as string;

export default function WrapUp() {
  return (
    <div className="info bg-slate-900 text-white">
      <ProgressDocs>
        <h1 id="wrapup">BPH 2024 WRAPUP!</h1>

        <p>
          Congratulations to the XXXX teams that finished the hunt, and to the XXXX teams that
          solved the first meta XXXX.
        </p>
        <p>Congratulations also to our first on site teams who completed the runaround: XXXX</p>
        <p>And our first remote team to complete all 3 metas: XXXX</p>
        <p>
          This was our second annual hunt, and we&apos;re very proud of how it turned out,
          especially given some of the ambitious approaches we had for the structure of the hunt!
          This wrapup will talk about our process and how we approached this, as well as some cute
          spoilers about the lore of the hunt.
        </p>
        <h1>Quick Stats</h1>
        <ul>
          <li>Total teams: XXX</li>
          <li>Total participants: XXX</li>
          <li>Hints asked: XXX</li>
          <li>Total guesses: XXX</li>
          <li>Total solves: XXX</li>
          <li>Metas solved: XXX</li>
        </ul>

        <h4>Team Achievements</h4>
        <ul>
          <li>XXX teams solved all 3 Major Cases</li>
          <li>XXX teams successfully inaugurated the new BIB director</li>
          <li>
            First in-person puzzle solve: XXX solved XXX at (time) after answer submissions opened
          </li>
          <li>First remote puzzle solve: XXX solved XXX at (time)</li>
        </ul>

        <p>Teams with the fewest incorrect answers:</p>
        <table>
          <thead>
            <tr>
              <th>Team Name</th>
              <th>Incorrect Answers</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>

        <h4>Teams with the most incorrect answers</h4>
        <table>
          <thead>
            <tr>
              <th>Team Name</th>
              <th>Incorrect Answers</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>

        <h4>Winning teams with the best answer accuracy</h4>
        <table>
          <thead>
            <tr>
              <th>Team Name</th>
              <th>Correct Answers</th>
              <th>Total Answers</th>
              <th>Answer Accuracy</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>

        <h4>Teams that finished without hints</h4>
        <table>
          <thead>
            <tr>
              <th>Team Name</th>
              <th>Hints Requested</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Team Name 1</td>
              <td>0</td>
            </tr>
            <tr>
              <td>Team Name 2</td>
              <td>0</td>
            </tr>
            <tr>
              <td>Team Name 3</td>
              <td>0</td>
            </tr>
            <tr>
              <td>Team Name 4</td>
              <td>0</td>
            </tr>
            <tr>
              <td>Team Name 5</td>
              <td>0</td>
            </tr>
            <tr>
              <td>Team Name 6</td>
              <td>0</td>
            </tr>
            <tr>
              <td>Team Name 7</td>
              <td>0</td>
            </tr>
            <tr>
              <td>Team Name 8</td>
              <td>0</td>
            </tr>
            <tr>
              <td>Team Name 9</td>
              <td>0</td>
            </tr>
          </tbody>
        </table>

        <p>[Insert solve graph here]</p>

        <h4>Lore and On-Campus Components [Story Spoilers]!</h4>
        <p>(lore dump with photos)</p>

        <h1>Art Direction</h1>
        <p>(art dump with photos)</p>

        <h1>Website</h1>
        <p>Hi Orion :)</p>

        <h1>Physical Puzzles</h1>
        <h4>Flowers</h4>
        <h4>Playbill</h4>
        <p>
          One physical puzzle given out at kickoff was the playbill! Designed to provide
          astoundingly little actual information about the play, this merely pointed solvers to the
          time and location at which it would take place. It also served a dual purpose– one which
          you&apos;ll have to figure out yourself by solving The World Is Quiet Here. Here are some
          pictures of what it looked like printed:
        </p>
        <p>[INSERT PLAYBILL PICTURES]</p>
        <h4>Nomenclept</h4>
        <h4>Ballads</h4>
        <h4>Silent Killer</h4>

        <h1>Events</h1>
        <h4>Sailing Team Applications</h4>
        <p>
          For both of our events, we planned to do them in coordination with student-run clubs on
          campus. This was extremely successful for both the involved clubs and the hunt - it gave
          the events unique Brown spirit, and allowed those groups to focus on making their events
          special separate from the hunt itself.
        </p>
        <p>
          <strong>Interrogation:</strong> 3pm on Saturday. Pls pls pls incl pics
        </p>
        <p>
          <strong>Astro:</strong> 8pm on Saturday
        </p>

        <h4>Not Events but Things Kindaish Like Events</h4>
        <h4>TWIQH</h4>
        <p>
          The first Not Event But Thing Kindaish Like An Event of the weekend was our rendition of
          Waiting For Godot, written in-house! Performed by our wonderful volunteer actors, this
          took place at 1:30pm at an undisclosed location (hmm, was that a playbill given out at
          kickoff?). Teams were told to bring writing utensils, and upon arrival each representative
          was handed a copy of the script. Not to spoil the puzzle, they had to note down the
          occurrence of certain phenomena during the performance, and refer back to their notes to
          extract the answer.
        </p>
        <p>
          Development of the play made for an entertaining break from rewriting The Case of Data for
          the gazillionth time, and was certainly much smoother, only having to be reworked a single
          time to adjust difficulty. The version uploaded to the hunt website was different from
          that performed live, largely due to logistical constraints and actor availability. In all,
          The World Is Quiet Here made for a novel puzzle experience, as well as an opportunity for
          the dramatically-inclined members of Brown Puzzle Club to showcase their talents.
        </p>
        <h4>Twitch Plays CIT</h4>

        <h4>The Final Runaround</h4>
        <p>
          **i actually dk how much lore we want in this part but the runaround doesn&apos;t make
          much sense w/o story imo so i&apos;m including it for now, feel free to change
        </p>
        <p>
          After the shocking revelation that their mentor Bluenoir was the mastermind behind all
          three major cases, in-person teams were instructed to collect evidence of his guilt. Upon
          being directed to HQ, teams received a case file on Josiah S. Carberry&apos;s
          disappearance prompting them to visit the Rockefeller Library. [abigail puzzle elaborate
          here]
        </p>
        <p>
          Armed with a note written from Bluenoir to Josiah on the day of his disappearance, teams
          proceeded to Josiah&apos;s, a dining hall on Brown&apos;s campus famous for their spicy
          chicken sandwiches with cheese, the coveted ‘spicy-with&apos;. At Jo&apos;s, solvers
          discovered a recording of Bluenoir ordering a convoluted burger and were tasked with
          reassembling the order given a series of crochet props.
        </p>
        <p>
          But what was Bluenoir doing ordering food for Josiah? Teams proceeded to MacMillan Hall,
          home of some of the most diabolical chemistry lectures and labs Brown has to offer. They
          then encountered three ‘poisons&apos; and Bluenoir&apos;s lab notebook detailing the
          qualities of each unlabeled liquid. Teams equipped their sensory skills and chemical
          knowledge to unravel the identity of the three poisons. Then, they used the police report
          detailing unidentified substances found in the spicy-with to determine which poison
          Bluenoir selected for his master plan. After securing the final piece of evidence, teams
          realized the truth: Bluenoir poisoned Josiah&apos;s spicy-with!
        </p>
        <p>*i don&apos;t have great pics of this one, someone else can fill in*</p>
        <p>
          Immediately after solving the final puzzle, teams were informed that Bluenoir was
          officially being sworn in as the head detective of the Brown Investigation Bureau in only
          a few minutes! They arrived at the ceremony just in time, and watched Bluenoir step up to
          graciously accept his new position with a speech.
        </p>
        <p>
          Before he could finish, another B.I.B. employee barged into the auditorium bearing a note
          from Josiah S. Carberry himself. In the letter, Josiah revealed that he was poisoned by
          Bluenoir, but had recovered with the assistance of the sewer rats under Perkins Hall.
          However, such a lofty claim couldn&apos;t be believed without some concrete evidence.
          Teams were then asked whether they had any evidence supporting Bluenoir&apos;s guilt, and
          were given the choice of whether to turn him in, or side with him. Out of the seven
          in-person teams that completed the final runaround, six chose to present their evidence,
          while only one team placed their evidence in the conveniently labeled ‘evidence destroying
          bin&apos; at the front of the auditorium. If teams chose to turn in Bluenoir, he was then
          arrested and escorted out, while if teams chose to side with Bluenoir, the B.I.B. employee
          was led out and Bluenoir was able to officially accept his new position.
        </p>
        <p>[could we insert the team names for each choice? Idk them off the top of my head]</p>
        <p>
          Regardless of their choice, teams were then awarded the coveted Employee of the Month
          award and serenaded with the melodies of ‘Pump Up the Jam&apos;.
        </p>

        <h1>Logistics</h1>
        <h1>Timeline</h1>
        <ul>
          <li>Sept 7th: tech team info dump meeting</li>
          <li>Oct 10th: First SAO hunt meeting</li>
          <li>Oct 15th: meta writing group formation</li>
          <li>Dec 12th: feeder answers released!</li>
          <li>Jan 28: first minor case ready for testsolving (exile)</li>
          <li>Feb 9th: BPH 2024 announced!</li>
          <li>March 15th: First puzzle uploaded to website</li>
          <li>March 23rd: First external testsolve</li>
          <li>March 30th: In person testsolve!</li>
          <li>April 7th: Physical puzzle making session! Last official club meeting pre-hunt</li>
          <li>April 12th: Last puzzle finished being written :P</li>
          <li>April 13th, 11am: Kickoff!</li>
          <li>April 15th: sleep.</li>
        </ul>

        <p>
          Our hunt team grew tremendously in all aspects (writers, tech, artists), and we were so
          excited to have such a large number of people committed to creating this hunt. We learned
          from some of our missteps last year, and started planning this hunt much farther in
          advance. Logistically, this hunt ran a lot smoother than BPH2023, with our SAO approvals
          and space requests going through without issue. We also had the chance to coordinate more
          testsolves, and have a structured internal testsolve system. There&apos;s always more to
          learn for next year :)
        </p>

        <h1>Testsolving</h1>
        <p>Reflections:</p>
        <ul>
          <li>Hunt Structure</li>
          <li>Puzzle Writing</li>
          <li>Organization</li>
        </ul>

        <h1>Credits</h1>
        <p>
          See <Link to="/credits">www.brownpuzzlehunt.com/credits</Link>
        </p>

        <h4>Exit survey</h4>
      </ProgressDocs>
    </div>
  );
}
