import background from "@/assets/images/major_cases/colored-thread/background.jpg";
import board from "@/assets/images/major_cases/colored-thread/board.png";
import SVGBoard from "@/components/major_cases/colored-thread/SVGBoard";

export default function ColoredThread() {
  // return <Board />;
  return (
    <div>
      <div
        className={"map relative left-1/2 transform -translate-x-1/2 max-w-screen-xl w-full h-full"}
      >
         <img className="art-bg-img" src={board} />
        <div className="art-bg">
          <img className="art-bg-img" src={background} />
        </div>
      </div>
      <SVGBoard />
    </div>
  );
}
