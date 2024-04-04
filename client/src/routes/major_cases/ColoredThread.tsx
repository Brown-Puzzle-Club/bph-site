import background from "@/assets/major_cases/colored-thread/background.jpg";
import board from "@/assets/major_cases/colored-thread/board.png";
import RelativeAsset from "@/components/RelativeAsset";
import SVGBoard from "@/components/major_cases/colored-thread/SVGBoard";
import { ArtWrapper } from "@/components/minor_cases/CasePageArt";

export default function ColoredThread() {
  // return <Board />;
  return (
    <div>
      <ArtWrapper background_src={background}>
        <RelativeAsset imageSrc={board} />
        <SVGBoard />
      </ArtWrapper>
    </div>
  );
}
