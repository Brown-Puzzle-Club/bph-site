import React, { CSSProperties, useState } from 'react';

interface AssetProps {
  imageSrc: string;
  linkTo?: string;
  hoverImageSrc?: string;
  extraStyles?: CSSProperties;
  onHover?: () => void;
}

const RelativeAsset: React.FC<AssetProps> = ({ imageSrc, linkTo, hoverImageSrc, extraStyles, onHover }) => {
  const [isHovered, setIsHovered] = useState(false);

  const curImageSrc = isHovered && hoverImageSrc ? hoverImageSrc : imageSrc;

  return (
    <div
      className={`relative-asset absolute${isHovered ? ' hover-effect' : ''}`}
      onMouseEnter={() => { setIsHovered(true); (onHover ? onHover() : (() => {})()) } }
      onMouseLeave={() => setIsHovered(false) }
      style={extraStyles}
    >
      <a href={linkTo}>
        <img src={curImageSrc} alt="asset" className="w-full" />
      </a>
    </div>
  );
};

export default RelativeAsset;