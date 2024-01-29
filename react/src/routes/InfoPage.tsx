import ProgressDocs from "@/components/ProgressDocs";

const smoothScroll = (element_id: string) => {
  const element = document.getElementById(element_id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

export default function InfoPage() {
  //bg-[#02031d]
  return (
    <div className="info bg-slate-900 text-white h-[90vh]"> 
      <ProgressDocs>
        <h1>Important Info</h1>
        <h4>What is this?</h4>
        <div>
          <p>This is a puzzlehunt! Teams of people will compete to solve puzzles (think escape room, not jigsaw) using information both online and in real life. Brown Puzzlehunt 2024 is Brown Puzzle Club's second annual puzzlehunt, so if you would like an example of a complete event please check out last year's <a href='https://2023.brownpuzzlehunt.com/'>hunt archive</a>.</p>
        </div>
        <h4>When and where is it?</h4>
        <div>
          <p>This puzzlehunt is taking place at <b>Brown University, in Providence, Rhode Island.</b></p>
          <p>Kickoff will start promptly at <strong>Saturday, April 13, 2024 at 11:00 AM EDT</strong>, in <b>MacMillan Hall Room 117</b>, with doors opening at <b>10:30 AM</b>.</p>
          <p>Puzzles will be released <strong>Saturday, April 13, 2024 at 12:00 PM EDT</strong>. HQ will close on <strong>Sunday, April 14, 2024 at 7:00 PM EDT</strong>, at which point hints will no longer be answered, the leaderboard will be frozen, and physical puzzles will no longer be available to be picked up.</p>
          <p>There may be <b>in-person puzzles</b>, which require physical presence on campus; <b>physical puzzles</b>, which require collecting objects from HQ; and <b>events</b>, which are not essential to finish, but will be a fun time anyway.</p>
          <p><b>Wrap-up</b> will be held at <b>8:30pm</b> in <b>MacMillan Hall Room 117</b>, with doors opening at <b>8:15pm</b>. Wrapup and Kickoff will both be livestreamed.</p>
        </div> 
        <h4>What's the goal?</h4>
        <div>
          <p>The official winner will be the first team to find Blueno hidden somewhere on campus.</p>
          <p>Only teams which are on-campus during the final runaround will be able to find Blueno. Additionally, only teams with one or more current undergraduate/graduate Brown or RISD students on-campus are eligible to find Blueno.</p>
          <p>If you know that you will be on-campus and think that you might be in the position to find Blueno first, we highly encourage you to include a Brown University or RISD undergraduate/graduate student on your team.</p>
        </div>
        <h4>Who can participate?</h4>
        <div>
          <p>Brown Puzzlehunt is open to anyone, anywhere in the world, including those not in the Brown/RISD community. We have taken steps to ensure that every puzzle is as accessible as possible to remote solvers. However, teams with current undergraduate or graduate students, or other members of the Brown/RISD community, may have some advantage in solving puzzles.</p>
          <p><b>We recommend teams to be around 7 to 10 people</b>. The maximum team size is 12 people (but you can still have fun with teams of 5!). Students and those new to hunting are encouraged to build teams on the larger side, but there's no minimum team size.</p>
        </div>
        <h4>How do puzzles work?</h4>
        <div>
          <p>All puzzles will be visible on the website; this is where you will submit your answers and receive new puzzles. If something in real life is part of a puzzle, the website will direct you towards it first.</p>
          <p>A few puzzles will be available at the start, and solving puzzles will lead to unlocking more puzzles.</p>
          <p>Each answer is a string of letters A-Z. Lowercase letters will be changed into uppercase, and any other characters will be stripped before checking for correctness.</p>
          <p>You have <b>20 total guesses</b> for each puzzle. Contact us if you run out of guesses, and we would be happy to grant more. Random guessing and brute-forcing are discouraged.</p>
        </div>
        <h4>How do hints work?</h4>
        <div>
          <p>Starting on <strong>Saturday, April 13, 2024</strong>, at 3pm, teams will gain one hint request every three hours, which they can use to ask for help on any puzzle.</p>
          <p>If you are a beginner student team or a team with a strong on-site presence that is not in the running to win, we will also visit you frequently to check on your progress and help you along. <b className="bg-[#1d3650]">If you are struggling, do not hesitate to reach out</b> — the event is meant to be fun, and we want to ensure no hunter is left behind! If you want someone on HQ to come and visit you, you can email us at any time.</p>
          <p>You can use a hint to get help on a puzzle. This can be something like a nudge in the right direction (i.e. you give us your progress on the puzzle and we’ll try to get you unstuck) or an answer to a question (e.g. “Which answers to these crossword clues are wrong?”).</p>
          <p>You can only have <b>one open hint request</b> at a time. We're a small HQ; this will help us answer in a timely manner.</p>
        </div>
        <h4>Non Brown/RISD in-person participants</h4>
        <div>
          <p>We're excited to have you join us! You'll primarily need to consider how you're getting to and from campus and where you'll be solving puzzles. Please let us know that you're coming during registration so that we'll be able to accommodate you!</p>
          <p>Anyone who is participating on-campus will need to fill out <a onClick={() => {alert("TODO: add new waiver")}}>this waiver form</a>. We'll collect these at kickoff.</p>
          <p>For essential information, check out <a onClick={() => smoothScroll("on-campus")}>On-Campus</a> Information.</p>
        </div>
        <h4>What else?</h4>
        <div>
          <p>You may use any external sources for help, including other people, as long as they aren't helping other teams and aren't actively participating in the hunt.</p>
          <p><b className="bg-[#1d3650]">Use of Google</b> (or your other search engine of choice) <b className="bg-[#1d3650]">is not only permitted, but essential</b>. You may also benefit from other online tools, such as:</p>
          <ul className="pl-3">
            <li>Online wordplay solvers, such as <a href="https://nutrimatic.org/">nutrimatic</a>, <a href="https://www.quinapalus.com/qat.html">qat</a>, or <a href="https://onelook.com/">OneLook</a></li>
            <li>Logic puzzle solvers, such as <a href="https://www.noq.solutions/">noq</a></li>
            <li>Reverse image searching tools, such as <a href="https://lens.google/">Google Lens</a> or <a href="https://tineye.com/">Tineye</a></li>
          </ul>
          <p>You may not publicly stream a solve of our hunt when the hunt is live.</p>
          <p>It won't be necessary to look at the HTML source/JavaScript/CSS on any webpages for any puzzle. Infractions or abuse of these elements may be grounds for disqualification or removal from the hunt.</p>
          <p>We reserve the right to disqualify any team for unsportsmanlike conduct.</p>
          <p>We reserve the right to change any of these rules. If there's a big change, we'll announce it to all teams.</p>
          <p>If you have any questions about these rules, or if you want to contact us for any reason, email <a href="mailto:puzzle@brown.edu">puzzle@brown.edu</a>. We will get back to you as soon as we can.</p>
        </div>
        <h1>FAQs</h1>
        <h4>What is a puzzlehunt? How do I solve these puzzles?</h4>
        <div>
          <p>If you've never heard of puzzlehunts before, here's a very brief summary: in a typical puzzle, you receive some information and have to extract an answer out of it, which is almost always an English word or phrase. Puzzles can come in many different forms; the only real commonality is that you usually receive no direct instructions, so it's up to you to figure out how to make sense of the information you're given. You can read a longer introduction to puzzlehunts <a href="https://blog.vero.site/post/puzzlehunts">here</a>.</p>
          <p>If you are new to puzzles and are interested in seeing some examples, or if you're looking for some practice, we recommend looking at puzzles from other online hunts such as <a href="https://galacticpuzzlehunt.com/">Galactic Puzzle Hunt</a>, <a href="https://teammatehunt.com/">Teammate Hunt</a>, or <a href="https://puzzlepotluck.com/">Puzzle Potluck</a>.</p>
        </div>
        <h4>What is this?</h4>a
        <h1 id="on-campus">On-Campus</h1>
        <h4>What is this?</h4>
        <h4>What is this?</h4>
        <h4>What is this?</h4>
        <h4>What is this?</h4>



















FAQs



Who's writing this hunt?
We are Brown Puzzle Club, a group of undergraduate students at Brown/RISD who are passionate about puzzles! Our goals for this hunt are to put a unique and fun experience on puzzlehunters' calendars, and to introduce more people in the Brown/RISD community to the joys of solving puzzles.
How hard will this hunt be? How long will it be?
We've designed this hunt to be a relatively easy introduction to puzzlehunting for beginner teams, while also showcasing what makes puzzlehunts so fun.
We expect this year’s Brown Puzzlehunt to be roughly the same length as last year’s, but much easier towards the start. Highly experienced, somewhat insane online-only teams may finish all online components in only a few hours, but we expect and encourage teams engaging with the on-campus puzzles to take longer.
There are tons of cool puzzlehunt events happening. What's unique about this one?
Brown Puzzlehunt is a hunt written by current Brown and RISD students, and we hope that we are able to share some of the unique history, culture, and student zeitgeist with the puzzle community! We're also excited to explore the unique possibility space of in-person puzzles.
I’m stuck on a puzzle. What should I do?
Here are some general puzzle tips that might be useful:
Thoroughly check the work that you’ve already done. Fixing a small mistake or incorrect assumption can greatly help with getting unstuck.
Get fresh eyes on the puzzle, or conversely, take a break and look at something else.
Consider what information you haven’t used yet.
It can be useful to put everything you have into your favorite search engine.
Look at similar examples of the puzzle type you’re working on.
Have you tried…
Remember that after hints are released, you can also use them to get a nudge in the right direction. Please use them if you’re stuck!
I think there’s a mistake in this puzzle!
Please describe the error in an email to puzzle@brown.edu and we’ll try to correct it.
I have a question that’s not on this list!
Contact us at puzzle@brown.edu and we’ll do our best to answer it.



/on-campus PAGE:


On-Campus
Visitors and guests are allowed on the Brown University campus without specific approvals or permissions. This means that all puzzlehunters are welcome to access the greens, outdoor areas, and some buildings during daylight hours. If you want to experience Brown Puzzlehunt while being on-campus, this page will help you with information and logistics!
Being Safe On-Campus
Brown University is not a playground for puzzlers; it is also a live university, with classes, students, faculty, research, and other events happening all the time. If you're going to be on-site, please be respectful of both the community and the campus.

Brown Puzzlehunt will not require you to do anything illegal, immoral, or untoward, including accessing unauthorized spaces. If you think that a puzzle is asking you to do something dangerous, against the law, or disrespectful, stop and think. If you're really not sure, please contact us and check.

Anyone who is attending on-campus will need to fill out this waiver form. We'll collect these at kickoff.
COVID-19 Safety Policy
Additionally, while you are on campus, you are required to abide by the COVID-19 Campus Safety Policy. As of time of writing:
Visitors are not required to sign a vaccine attestation form.
Visitors, employees, and students are required to be “up to date” with COVID-19 vaccines. That means having received all recommended COVID-19 vaccines, including any booster dose(s) when eligible. For more information, see healthy.brown.edu/vaccinations.
Wearing masks is strongly recommended for everyone when indoors with large numbers of people, regardless of vaccination status. Acceptable masks on the Brown University campus include KN95, KF94, N95 or disposable/surgical masks.
We will do our best to update these policies on this website if they change, but it's your responsibility to be up-to-date with the university's COVID-19 Safety Policies if you're planning to attend.
Minors
Unfortunately, we are not in a position to accommodate minors on-campus (participants who are not Brown or RISD students and who are under the age of 18). Sorry! However, minors are welcome to participate remotely, and teams with minors can still send other participants who are over the age of 18 to campus to participate.
Locations to Know

Kickoff
 MacMillan Hall, Room 117
Enter through the north side off Sciences Park, or through the Thayer Street entrance.

Brown Puzzle Club HQ
Sayles Hall Room 306 
Enter through the west side through the Main Green entrance.
Some events and puzzles might use locations that require card swipe access, which is limited to current undergraduate or graduate students (or some faculty). Puzzles which require this will be kept to a minimum and, where applicable, clearly marked as such. If you know ahead of time that you'll want to participate in these puzzles but have no current students on your team, contact us at puzzle@brown.edu before the hunt and we'll find a way to get that sorted.
Getting to Providence
Train
Brown University is a 10-15 minute walk from Providence Station, our nearest train station. The station is across the river from College Hill.
If you're traveling from Boston, we recommend Amtrak Northeast Regional as the least expensive provider. Providence is also accessible via the MBTA Rapid Transit system, along the Providence/Stoughton line, starting at South Station.
Bus
There are a number of bus companies which provide bus services from cities in the New England and New York area and beyond terminating to Providence, including but not limited to: FlixBus, Peter Pan Lines, and Greyhound. We recommend doing your own research if you plan to take the bus from your starting location to Providence.
Car
Providence lies at the intersection of Interstate 95 and Interstate 195. For non-Brown community members and visitors, parking is available at the Lot 68 Visitor Parking Garage, also known as the Power Street Parking Garage, located at 111 Power Street. The visitor entrance is located at the intersection of Power and Thayer Streets. Parking costs $2.00 per hour over the weekend. If you want overnight parking or require a permit for more than one day, you can email us at puzzle@brown.edu and we'll try to help you out.
Accommodation
Unfortunately, we are unable to provide accommodation or discounted rates for teams who wish to stay on-campus overnight.
Solving Spaces
If you are going to be on-campus, we will need you to let us know where your HQ is. This is the location where you will be spending most of your time solving puzzles while you're on-campus. If you are a student team or have student members, this might be a dorm common area or a flat near campus, or a noise-tolerant space like the Student Center or some floors of the SciLi.

If you need a place for your team to work during the hunt, let us know during the registration process and we will try to accommodate you. Our ability to allocate classrooms like this will be limited, so we will prioritize teams which do not have other spaces available and who register in advance.
Events
We're excited to say that there will be events which are on-campus! These events will provide one “free solve” to teams who complete it, which can be used to get the answer to a puzzle that they're stuck on. Anyone who is on-campus during the event is welcome to participate.
These timings may be subject to change.
Event #1
Saturday 3:00 PM EDT
Event #2
Saturday 7:00 PM EDT
Event #3
Sunday 12:00 PM EDT
Other
If you have any other questions, please let us know at puzzle@brown.edu.
      </ProgressDocs>
    </div>
  )
}