

export default function Credits () {
  return (
    <div className="credits bg-slate-900 text-white h-[90vh] overscroll-contain overflow-hidden overflow-y-auto ">
      <div className="credits-top text-center p-5">
        <p>Brown Puzzlehunt is put together by <a href="/club">Brown Puzzle Club</a>.</p>
      </div>
      <div className="credits-content text-center dark bg-gradient-to-b from-muted/50 to-muted/80 p-6 no-underline outline-none focus:shadow-md btn-gradient-1 relative mx-[5%] md:mx-[20%]">
        <div className="credits-box btn-gradient-bot pb-5">
          <h4 className="text-5xl font-bold pb-5">Leadership</h4>
          <ul>
            <li><b>General Director:</b> <strong>Nishka Pant</strong> ('24)</li>
            <li><b>Puzzle Construction Director:</b> <strong>Thomas Gordon</strong> ('26)</li>
            <li><b>Puzzle Test Director:</b> <strong>Ian Rider</strong> ('24)</li>
            <li><b>Tech + Design Director:</b> <strong>Orion Bloomfield</strong> ('24)</li>
            <li><b>Art Director:</b> <strong>Jaclyn Cohen</strong> ('26)</li>
            <li><b>Story Director:</b> <strong>Aren Guralp</strong> ('27)</li>
          </ul>
        </div>

        <div className="credits-box py-5 btn-gradient-bot"> 
          <h4 className="text-2xl font-bold pb-3">Puzzle Writers / HQ</h4>
          <ul>
            <li><strong>Sierra Bornheim</strong> ('24)</li>
            <li><strong>Orion Bloomfield</strong> ('24)</li>
            <li><strong>Jiahua Chen</strong> ('24)</li>
            <li><strong>Alex Duchnowski</strong> ('24)</li>
            <li><strong>Lorenzo Mahoney</strong> ('24)</li>
            <li><strong>Abigail Nelkin</strong> ('24)</li>
            <li><strong>Nishka Pant</strong> ('24)</li>
            <li><strong>Ian Rider</strong> ('24)</li>
            <li><strong>Jay Sarva</strong> ('24.5)</li>
            <li><strong>Jeremy Fleming</strong> ('25)</li>
            <li><strong>Zach Gottshall</strong> ('25)</li>
            <li><strong>Megan Carlson</strong> ('26)</li>
            <li><strong>Thomas Gordon</strong> ('26)</li>
            <li><strong>Bailey Merlino</strong> ('26)</li>
            <li><strong>Audrey Feigin</strong> ('27)</li>
            <li><strong>Erin Finn</strong> ('27)</li>
            <li><strong>Eliot Geer</strong> ('27)</li>
            <li><strong>Aren Guralp</strong> ('27)</li>
            <li><strong>Alex Wang</strong> ('27)</li>
            <li><strong>Thomas Mowen</strong></li> 
            <li><strong>Alex DeFranco</strong></li>
            <li><strong>Liam Oliva</strong></li>
          </ul>
        </div>

        <div className="credits-box py-5 btn-gradient-bot"> 
          <h4 className="text-2xl font-bold pb-3">Art Team</h4>
          <ul>
            <li>(<b>Team Lead</b>) <strong>Jaclyn Cohen</strong> ('26)</li>
            <li><strong>Lucid Clairvoyant</strong> ('24)</li>
            <li><strong>Christine Wang</strong> (RISD '24)</li>
            <li><strong>Eliot Geer</strong> ('27)</li>
            <li><strong>Annie Johnson</strong> ('27)</li>
            <li><strong>Phil Avilov</strong> (RISD '28)</li>
            <li><strong>@<a href="https://www.instagram.com/codnjs.oo/">codnjs.oo</a></strong></li>
          </ul>
        </div>


        <div className="credits-box py-5 btn-gradient-bot"> 
          <h4 className="text-2xl font-bold pb-3">Tech Team</h4>
          <ul>
            <li>(<b>Team Lead</b>) <strong>Orion Bloomfield</strong> ('24)</li>
            <li><strong>Nick Bottone</strong> ('24)</li>
            <li><strong>Hammad Izhar</strong> ('24)</li>
            <li><strong>Andrew Li</strong> ('25)</li>
            <li><strong>Ryan Huang</strong> ('26)</li>
            <li><strong>Owen Carson</strong> ('25) (design)</li>
            <li><strong>Tenzin Choezin</strong> ('25) (design)</li>
            <li><strong>Laurence Nunes</strong> ('27) (design)</li>
          </ul>
        </div>

        

        <div className="credits-box py-5"> 
          <h4 className="text-xl font-bold pb-3">Special Thanks</h4>
          <ul>
            <li className="py-1">To <strong>Karan Kashyap</strong> and Full Stack at Brown for their support roping in developers and designers for our website.</li>
            <li className="py-1">To <strong>Cassie Sutten Coats</strong> and Brown SAO for the guidance, kind words, and permission to book every remaining classroom space on campus.</li>
          </ul>
        </div>
        
      </div>

      <div className="credits-end text-center py-5">
        <p>We hope you enjoy our second annual hunt! If you are affiliated with Brown and are interested in joining our team, please <a href="/club">join the club</a> and/or <a href="mailto:puzzle@brown.edu">email us</a>!</p>
      </div>
    </div>
  )
}