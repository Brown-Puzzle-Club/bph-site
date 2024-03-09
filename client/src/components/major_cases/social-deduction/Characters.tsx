import background from "../../../assets/major_cases/social-deduction/Background.jpg";
import RelativeAsset from "../../RelativeAsset";

// characters
import invisiguy from "../../../assets/major_cases/social-deduction/Invisiguy.png";
import daisyculaPose from "../../../assets/major_cases/social-deduction/daisycula-pose.png";
import daisycula from "../../../assets/major_cases/social-deduction/daisycula.png";
import gorgonPose from "../../../assets/major_cases/social-deduction/gorgon-pose.png";
import gorgon from "../../../assets/major_cases/social-deduction/gorgon.png";
import greenribbonPose from "../../../assets/major_cases/social-deduction/greenribbon-pose.png";
import greenribbon from "../../../assets/major_cases/social-deduction/greenribbon.png";
import invisiguyPose from "../../../assets/major_cases/social-deduction/invisiguy-pose.png";
import wolfguyPose from "../../../assets/major_cases/social-deduction/wolfguy-pose.png";
import wolfguy from "../../../assets/major_cases/social-deduction/wolfguy.png";

// ghosts
import { CSSProperties, useEffect, useState } from "react";
import anxiousghost from "../../../assets/major_cases/social-deduction/anxiousghost.png";
import happyghost from "../../../assets/major_cases/social-deduction/happyghost.png";
import heartghost from "../../../assets/major_cases/social-deduction/heartghost.png";
import normalghost from "../../../assets/major_cases/social-deduction/normalghost.png";
import sleepyghost from "../../../assets/major_cases/social-deduction/sleepyghost.png";

import { InternalCharacter } from "../../../utils/major_cases/social-deduction/constants";
import InternalCharacterRoleTooltip from "./CharacterRoleTooltip";

const GHOST_HOVER = "hover:drop-shadow-[0_15px_15px_rgba(255,255,255,0.2)]";

export default function InternalCharacters({
  CHAR_NAMES,
}: {
  CHAR_NAMES: { [key in InternalCharacter]: string };
}) {
  const [selectedInternalCharacter, setSelectedInternalCharacter] = useState<InternalCharacter>(
    InternalCharacter.ANXIOUS_GHOST
  );

  useEffect(() => {
    if (selectedInternalCharacter !== InternalCharacter.NONE) {
      // Add the opacity-100 class to fade in
      document.getElementById("selected-character-div")?.classList.add("opacity-100");
    } else {
      // Remove the opacity-100 class to fade out
      document.getElementById("selected-character-div")?.classList.remove("opacity-100");
    }
  }, [selectedInternalCharacter]);
  // console.log(selectedInternalCharacter)

  const InternalCharacterAsset = ({
    imageSrc,
    hoverImageSrc,
    extraStyles,
    extraClasses,
    character,
  }: {
    imageSrc: string;
    hoverImageSrc?: string;
    extraStyles: CSSProperties;
    extraClasses?: string;
    character: InternalCharacter;
  }) => {
    return (
      <RelativeAsset
        imageSrc={imageSrc}
        hoverImageSrc={hoverImageSrc}
        extraStyles={extraStyles}
        extraClasses={extraClasses}
        onHover={() => {
          setSelectedInternalCharacter(character);
        }}
        onLeave={() => {
          setSelectedInternalCharacter(InternalCharacter.NONE);
        }}
      />
    );
  };

  return (
    // TODO: setup repeating texture
    <section className="characters" style={{ backgroundColor: "#0e0c05" }}>
      <div className="map relative left-1/2 transform -translate-x-1/2 aspect-w-4 aspect-h-3 max-w-screen-xl w-full">
        {/* MAIN CHARACTERS */}
        <InternalCharacterAsset
          character={InternalCharacter.GREEN_RIBBON}
          imageSrc={greenribbon}
          hoverImageSrc={greenribbonPose}
          extraStyles={{
            top: "12%",
            left: "7%",
            width: "28%",
            zIndex: 1,
          }}
        />
        <InternalCharacterAsset
          character={InternalCharacter.DAISYCULA}
          imageSrc={daisycula}
          hoverImageSrc={daisyculaPose}
          extraStyles={{
            top: "28%",
            left: "13%",
            width: "30%",
            zIndex: 2,
          }}
        />
        <InternalCharacterAsset
          character={InternalCharacter.INVISIGUY}
          imageSrc={invisiguy}
          hoverImageSrc={invisiguyPose}
          extraStyles={{
            top: "25%",
            left: "36%",
            width: "22%",
            zIndex: 1,
          }}
        />
        <InternalCharacterAsset
          character={InternalCharacter.WOLF_GUY}
          imageSrc={wolfguy}
          hoverImageSrc={wolfguyPose}
          extraStyles={{
            top: "24%",
            left: "56%",
            width: "21%",
            zIndex: 1,
          }}
        />
        <InternalCharacterAsset
          character={InternalCharacter.GORGON}
          imageSrc={gorgon}
          hoverImageSrc={gorgonPose}
          extraStyles={{
            top: "30%",
            left: "63%",
            width: "32%",
            zIndex: 2,
          }}
        />

        {/* GHOSTS */}
        <InternalCharacterAsset
          character={InternalCharacter.HEART_GHOST}
          imageSrc={heartghost}
          extraClasses={GHOST_HOVER}
          extraStyles={{
            top: "46%",
            left: "2%",
            width: "6%",
            zIndex: 1,
          }}
        />
        <InternalCharacterAsset
          character={InternalCharacter.NORMAL_GHOST}
          imageSrc={normalghost}
          extraClasses={GHOST_HOVER}
          extraStyles={{
            top: "4%",
            left: "21%",
            width: "8%",
            zIndex: 1,
          }}
        />
        <InternalCharacterAsset
          character={InternalCharacter.HAPPY_GHOST}
          imageSrc={happyghost}
          extraClasses={GHOST_HOVER}
          extraStyles={{
            top: "13%",
            left: "78%",
            width: "7%",
            zIndex: 1,
          }}
        />
        <InternalCharacterAsset
          character={InternalCharacter.ANXIOUS_GHOST}
          imageSrc={anxiousghost}
          extraClasses={GHOST_HOVER}
          extraStyles={{
            top: "19%",
            left: "86%",
            width: "7%",
            zIndex: 1,
          }}
        />
        <InternalCharacterAsset
          character={InternalCharacter.SLEEPY_GHOST}
          imageSrc={sleepyghost}
          extraClasses={GHOST_HOVER}
          extraStyles={{
            top: "70%",
            left: "91%",
            width: "7%",
            zIndex: 3,
          }}
        />

        {/* SELECTED CHARACTER */}
        <div
          id="selected-character-div"
          className="selected-character absolute opacity-0 transition-opacity duration-300 ease-out"
          style={{
            top: "95%",
            left: "50%",
            transform: "translate(-50%, -50%)", // anchors from the center
            zIndex: 4,
          }}
        >
          <InternalCharacterRoleTooltip
            char_role={selectedInternalCharacter}
            scale={true}
            CHAR_NAMES={CHAR_NAMES}
          />
        </div>

        {/* BACKGROUND */}
        <div className="art-bg">
          <img className="art-bg-img" src={background} />
        </div>
      </div>
    </section>
  );
}
