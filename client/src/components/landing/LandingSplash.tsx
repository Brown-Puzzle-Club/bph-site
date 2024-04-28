import type React from "react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { useDjangoContext } from "@/hooks/useDjangoContext";

import bear_regular from "../../assets/landing/bear_regular.png";
import bear_wave from "../../assets/landing/bear_wave.png";
import layer1 from "../../assets/landing/layer_1_crop.png";
import layer2 from "../../assets/landing/layer_2.png";
import layer3 from "../../assets/landing/layer_3.png";
import logo from "../../assets/landing/logo.png";
import blimp from "../../assets/landing/register_blimp.png";
import blimp_hover from "../../assets/landing/register_hover.png";
import release from "../../assets/landing/release.png";

const LandingSplash: React.FC = () => {
  const [blimpPosition, setBlimpPosition] = useState(20);
  const blimpHoverInterval = 2000;
  const blimpHoverHeight = 2;

  const navigate = useNavigate();

  const { data: context } = useDjangoContext();

  const close_date = useMemo(() => {
    if (!context) return "";
    return new Date(context?.hunt_context.close_time).toDateString();
  }, [context]);

  useEffect(() => {
    // parallax, blimp height
    const handleScroll = () => {
      const scrollY = window.scrollY;

      const layer2Element = document.querySelector(".layer-2") as HTMLElement;
      const layer3Element = document.querySelector(".layer-3") as HTMLElement;
      const layer4Element = document.querySelector(".layer-4") as HTMLElement;
      const layer5Element = document.querySelector(".layer-5") as HTMLElement;
      const layer6Element = document.querySelector(".layer-6") as HTMLElement;

      if (layer2Element) {
        layer2Element.style.transform = `translateY(-${scrollY * 0.3}px)`;
      }
      if (layer3Element) {
        layer3Element.style.transform = `translateY(-${scrollY * 0.4}px)`;
      }
      if (layer4Element) {
        layer4Element.style.transform = `translateY(-${scrollY * 0.4}px)`;
      }
      if (layer5Element) {
        layer5Element.style.transform = `translateY(-${scrollY * 0.4}px) rotate(9deg)`;
      }
      if (layer6Element) {
        layer6Element.style.transform = `translateY(-${scrollY * 0.4}px)`;
      }
    };

    const resizeHandler = () => {
      const layer1Element = document.querySelector(".layer-1") as HTMLElement;
      const artbgElement = document.querySelector(".art-bg") as HTMLElement;
      artbgElement.style.height = `${layer1Element.offsetHeight}px`;
    };

    const handleImageLoad = () => {
      resizeHandler();
    };

    const updateBlimpPosition = () => {
      const newPosition = Math.sin(Date.now() / blimpHoverInterval) * blimpHoverHeight + 15;
      setBlimpPosition(newPosition);
    };
    const blimpInterval = setInterval(updateBlimpPosition, 60);

    const layer1Image = new Image();
    layer1Image.src = layer1;
    layer1Image.addEventListener("load", handleImageLoad);

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", resizeHandler);
    return () => {
      layer1Image.removeEventListener("load", handleImageLoad);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", resizeHandler);
      clearInterval(blimpInterval);
    };
  }, []);

  return (
    <section
      className="landingtop"
      style={{
        mask: "linear-gradient(to bottom, rgba(255,255,255,1) 83%, rgba(0,0,0,0) 100%)",
        WebkitMask:
          "linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(128, 128, 128, 1) 7%, rgba(255, 255, 255, 1) 83%, rgba(255, 255, 255, 0) 100%)",
      }}
    >
      <div className="map relative left-1/2 transform -translate-x-1/2 aspect-w-3 aspect-h-2 w-full">
        <div className="art-bg select-none">
          <img className="layer-1 art-bg-img absolute top-0 left-0 w-full z-0" src={layer1} />
          <img
            className="logo art-bg-img absolute w-full z-10"
            style={{
              top: "20%",
              left: "50%",
              width: "30%",
              transform: "translate(-50%, -50%)",
            }}
            src={logo}
          />
          <img
            className="blimp art-bg-img absolute w-full z-50 hover:drop-shadow-[0_15px_15px_rgba(255,255,0,0.2)]"
            style={{
              top: `${blimpPosition}%`,
              left: "80%",
              width: "20%",
              transform: "translate(-50%, -50%)",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = blimp_hover;
              const bear = document.querySelector(".layer-4") as HTMLImageElement;
              bear.src = bear_wave;
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = blimp;
              const bear = document.querySelector(".layer-4") as HTMLImageElement;
              bear.src = bear_regular;
            }}
            onClick={() => {
              if (context?.hunt_context.hunt_is_closed) {
                toast.error("the hunt is closed :(", {
                  duration: 500,
                  position: "top-right",
                });
              } else {
                navigate("/register");
              }
            }}
            src={blimp}
          />
          <img className="layer-2 art-bg-img absolute top-0 left-0 w-full z-20" src={layer2} />
          <img className="layer-3 art-bg-img absolute top-0 left-0 w-full z-30" src={layer3} />
          <img
            className="layer-4 art-bg-img absolute w-full z-40"
            style={{
              top: "89%",
              left: "38%",
              width: "6%",
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = bear_wave;
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = bear_regular;
            }}
            src={bear_regular}
          />
          <a href="https://www.instagram.com/p/C5Q9DwRu4wT/?img_index=2">
            <img
              className="layer-5 art-bg-img absolute w-full z-40 hover:drop-shadow-[0_15px_15px_rgba(255,255,255,0.2)] hover:cursor-pointer"
              style={{
                top: "44%",
                left: "93%",
                width: "6%",
                transform: "rotate(9deg)",
              }}
              src={release}
            />
          </a>
          <div
            className="layer-6 art-bg-img absolute w-full z-40 when-box col-start-1 col-span-5 md:col-start-6 md:col-span-3 text-center dark bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md btn-gradient-1"
            style={{
              top: "72%",
              left: "65%",
              width: "34%",
            }}
          >
            <p className="text-white font-mono text-xs select-all">
              The hunt weekend is over, but you can still participate and register until{" "}
              <b>{close_date}</b> !
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingSplash;
