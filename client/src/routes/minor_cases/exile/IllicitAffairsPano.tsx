import { useMemo, useState } from "react";
import { ReactPhotoSphereViewer } from "react-photo-sphere-viewer";

import pano1 from "@/assets/minor_cases/exile/pano/1low.jpg";
import pano2 from "@/assets/minor_cases/exile/pano/2low.jpg";
import pano3 from "@/assets/minor_cases/exile/pano/3low.jpg";
import pano4 from "@/assets/minor_cases/exile/pano/4low.jpg";
import pano5 from "@/assets/minor_cases/exile/pano/5low.jpg";
import pano6 from "@/assets/minor_cases/exile/pano/6low.jpg";
import postIt from "@/assets/minor_cases/exile/post-it.png";
import { cn } from "@/utils/utils";

const panos = [
  <ReactPhotoSphereViewer
    key={1}
    src={pano1}
    height={"50vh"}
    width={"50vw"}
  ></ReactPhotoSphereViewer>,
  <ReactPhotoSphereViewer
    key={2}
    src={pano2}
    height={"50vh"}
    width={"50vw"}
  ></ReactPhotoSphereViewer>,
  <ReactPhotoSphereViewer
    key={3}
    src={pano3}
    height={"50vh"}
    width={"50vw"}
  ></ReactPhotoSphereViewer>,
  <ReactPhotoSphereViewer
    key={4}
    src={pano4}
    height={"50vh"}
    width={"50vw"}
  ></ReactPhotoSphereViewer>,
  <ReactPhotoSphereViewer
    key={5}
    src={pano5}
    height={"50vh"}
    width={"50vw"}
  ></ReactPhotoSphereViewer>,
  <ReactPhotoSphereViewer
    key={6}
    src={pano6}
    height={"50vh"}
    width={"50vw"}
  ></ReactPhotoSphereViewer>,
];

export default function IllicitAffairsPano() {
  const [currentTab, setCurrentTab] = useState<number>(0);

  const currentPano = useMemo(() => {
    return panos[currentTab];
  }, [currentTab]);

  const handleButtonClick = (index: number) => {
    setCurrentTab(index);
  };
  return (
    <div>
      <h1 className="text-center text-4xl font-extrabold">Illicit Affairs</h1>
      <div className="flex justify-center h-full my-5 border border-slate-500 rounded lg:mx-[35vw] md:mx-[25vw] mx-[15vw] max-h-[12rem] ">
        <p className="rounded p-4 italic text-center text-sm">
          I don&apos;t know what he&apos;s been drinking and i don&apos;t know where he&apos;s been
          (or in what region), but i do know he wasn&apos;t with his wife.
        </p>
      </div>
      <img
        className="flex self-center h-full lg:mx-[43vw] md:mx-[25vw] mx-[15vw] max-h-[12rem]"
        src={postIt}
      ></img>

      <div className="flex justify-center my-4">
        {panos.map((_, index) => (
          <button
            key={index}
            className={cn(
              "mx-2 p-2 bg-blue-500 text-white rounded",
              currentTab === index
                ? "bg-[white] text-black"
                : "hover:bg-slate-200 hover:text-black",
            )}
            onClick={() => handleButtonClick(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <div className="flex justify-center rounded-xl">{currentPano}</div>
    </div>
  );
}
