import React, { useEffect } from 'react';

import layer1 from '../../assets/landing/layer_1.png';
import layer2 from '../../assets/landing/layer_2.png';
import layer3 from '../../assets/landing/layer_3.png';
// import layer4 from '../../assets/landing/layer_4.png';

const LandingSplash: React.FC = () => {

  useEffect(() => {
    // Add an event listener to handle scroll and update layer positions
    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Adjust the transformation based on the scroll position
      // const layer1Element = document.querySelector('.layer-1') as HTMLElement;
      const layer2Element = document.querySelector('.layer-2') as HTMLElement;
      const layer3Element = document.querySelector('.layer-3') as HTMLElement;
      // const layer4Element = document.querySelector('.layer-4') as HTMLElement;

      // if (layer1Element) {
      //   layer1Element.style.transform = `translateY(-${scrollY * 0.2}px)`;
      // }
      if (layer2Element) {
        layer2Element.style.transform = `translateY(-${scrollY * 0.5}px)`;
      }
      if (layer3Element) {
        layer3Element.style.transform = `translateY(-${scrollY * 0.7}px)`;
      }
      // if (layer4Element) {
      //   layer4Element.style.transform = `translateY(-${scrollY * 0.5}px)`;
      // }
    };

    const resizeHandler = () => {
      const layer1Element = document.querySelector('.layer-1') as HTMLElement;
      const artbgElement = document.querySelector('.art-bg') as HTMLElement;
      artbgElement.style.height = `${layer1Element.offsetHeight}px`;
    }

    const handleImageLoad = () => {
      resizeHandler();
    };


    const layer1Image = new Image();
    layer1Image.src = layer1;
    layer1Image.addEventListener('load', handleImageLoad);

    // Attach the event listener
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', resizeHandler);
    // Remove the event listener on component unmount
    return () => {
      layer1Image.removeEventListener('load', handleImageLoad);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);

  return (
    <section className='landingtop'
    style={{
      mask: "linear-gradient(to bottom, rgba(255,255,255,1) 83%, rgba(0,0,0,0) 100%)",
      WebkitMask: "linear-gradient(to bottom, rgba(255,255,255,1) 83%, rgba(0,0,0,0) 100%)",
    }}>
      <div className='map relative left-1/2 transform -translate-x-1/2 aspect-w-3 aspect-h-2 w-full'>
        <div className="art-bg">
            <img
              className="layer-1 art-bg-img absolute top-0 left-0 w-full z-0"
              src={layer1}
            />
            <img 
              className="layer-2 art-bg-img absolute top-0 left-0 w-full z-20"
              src={layer2}
            />
            <img 
              className="layer-3 art-bg-img absolute top-0 left-0 w-full z-30"
              src={layer3}
            />
        </div>
      </div>
    </section>
  );
};

export default LandingSplash;