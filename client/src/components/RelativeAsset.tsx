import type { CSSProperties, ReactNode } from "react";
import { useState } from "react";

import { cn } from "@/utils/utils";

export interface AssetProps {
  imageSrc: string;
  linkTo?: string;
  hoverImageSrc?: string;
  extraStyles?: CSSProperties;
  extraClasses?: string;
  onHover?: () => void;
  onLeave?: () => void;
  onClick?: () => void;
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
  onClick,
  children,
}: AssetProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const curImageSrc = isHovered && hoverImageSrc ? hoverImageSrc : imageSrc;

  return (
    <div
      className={cn("relative-asset w-full absolute", extraClasses)}
      onMouseEnter={() => {
        setIsHovered(true);
        onHover ? onHover() : (() => {})();
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        onLeave ? onLeave() : (() => {})();
      }}
      onClick={() => {
        onClick ? onClick() : (() => {})();
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
