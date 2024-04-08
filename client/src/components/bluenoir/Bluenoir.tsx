import frame from "@/assets/bluenoir/frame.png";
import test from "@/assets/bluenoir/test.jpeg";
import Typewriter from "typewriter-effect";

const Bluenoir = ({ show, setShow }: { show: boolean; setShow: (show: boolean) => void }) => {
  const text =
    "Nice work, kiddo. At this rate, you'll have the entire agency eating out of the palm of your hand.";
  // Absolute floating box top left corner
  return (
    <div className={show ? "" : "hidden"}>
      <div className="fixed top-12 left-4 z-[100] text-white rounded-lg bg-slate-900 p-3 pr-4 shadow-lg shadow-slate-800">
        <div className="absolute top-2 right-2 text-slate-500 text-sm">
          <button onClick={() => setShow(false)}>✕</button>
        </div>
        <div className="flex flex-row gap-4 items-center">
          <div className="h-[80px] w-[80px]">
            <div className="h-[55px] w-[55px] absolute mx-[12px] my-[12px]">
              <img src={test} />
            </div>
            <div className="h-[80px] w-[80px] absolute mx-auto my-auto">
              <img src={frame} />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="font-extrabold font-mono text-sm underline underline-offset-2">
              Bluenoir
            </div>
            <div className="flex font-mono font-light max-w-xs text-xs">
              <p className="text-slate-900">{text}</p>
              <div className="absolute">
                <Typewriter
                  onInit={(typewriter) => {
                    typewriter.typeString(text).start();
                  }}
                  options={{
                    cursor: "",
                    delay: 20,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bluenoir;
