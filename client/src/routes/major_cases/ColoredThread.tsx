import background from "@/assets/major_cases/colored-thread/background.jpg";
import board from "@/assets/major_cases/colored-thread/board.png";
import RelativeAsset from "@/components/RelativeAsset";
import SVGBoard from "@/components/major_cases/colored-thread/SVGBoard";
import { ArtWrapper } from "@/components/minor_cases/CasePageArt";
import { useTheme } from "@/hooks/useTheme";
import { BROWN_THEME } from "@/utils/themes";
import { useEffect } from "react";

export default function ColoredThread() {
  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme(BROWN_THEME);
  });

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
