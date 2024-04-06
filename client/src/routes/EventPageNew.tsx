import background from "@/assets/main_page/Backdrop.png";
import shadow from "@/assets/main_page/Shadow.png";
import desk from "@/assets/main_page/ShadowDesk.png";
import { ArtWrapper } from "@/components/minor_cases/CasePageArt";

export default function EventPageNew() {
  return (
    <div
      className="min-h-[90vh]"
      style={{
        backgroundImage: `url(${background})`,
      }}
    >
      <div
        className="flex min-h-screen flex-col relative items-center"
        style={{
          backgroundImage: `url(${shadow})`,
        }}
      >
        <ArtWrapper
          background_src={desk}
          className="max-w-screen-xl h-auto object-contain"
        ></ArtWrapper>
      </div>
    </div>
  );
}
