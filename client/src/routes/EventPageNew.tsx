import background from "@/assets/main_page/Backdrop.png";
import shadow from "@/assets/main_page/Shadow.png";
import desk from "@/assets/main_page/ShadowDesk.png";
import { ArtWrapperInner } from "@/components/minor_cases/CasePageArt";
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
        <ArtWrapperInner background_src={desk} className="relative max-w-screen-xl">
          
        </ArtWrapperInner>
      </div>
    </div>
    // <div
    //   className="flex min-h-screen flex-col relative items-center"
    //   style={{
    //     backgroundImage: `url(${backdrop})`,
    //   }}
    // >
    //   <div className="flex flex-1 relative max-w-screen-xl">
    //     <img className="w-full h-auto object-contain" src={shadowDesk} alt="" />
    //   </div>
    // </div>
  );
}
