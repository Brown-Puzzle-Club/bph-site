import type { CSSProperties, ReactNode } from "react";
import { useState } from "react";

export interface AssetProps {
  imageSrc: string;
  linkTo?: string;
  hoverImageSrc?: string;
  extraStyles?: CSSProperties;
  extraClasses?: string;
  onHover?: () => void;
  onLeave?: () => void;
  children?: ReactNode;
}

const RelativeAsset = ({
  imageSrc,
  linkTo,
  hoverImageSrc,
  extraStyles,
  extraClasses,
  onHover,
  onLeave,
  children,
}: AssetProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const curImageSrc = isHovered && hoverImageSrc ? hoverImageSrc : imageSrc;

  return (
    <div
      className={`relative-asset w-full absolute${isHovered ? " hover-effect" : ""}${
        extraClasses ? " " + extraClasses : ""
      }`}
      onMouseEnter={() => {
        setIsHovered(true);
        onHover ? onHover() : (() => {})();
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        onLeave ? onLeave() : (() => {})();
      }}
      style={extraStyles}
    >
      <a href={linkTo}>
        <img src={curImageSrc} alt="asset" className="w-full" />
      </a>
      {children}
    </div>
  );
};

export default RelativeAsset;
