import background from '../../../assets/major_cases/social-deduction/Background.png'
import RelativeAsset from '../../RelativeAsset'

// characters
import invisiguy from '../../../assets/major_cases/social-deduction/Invisiguy.png'
import daisycula from '../../../assets/major_cases/social-deduction/daisycula.png'
import gorgon from '../../../assets/major_cases/social-deduction/gorgon.png'
import greenribbon from '../../../assets/major_cases/social-deduction/greenribbon.png'
import wolfguy from '../../../assets/major_cases/social-deduction/wolfguy.png'

// ghosts
import { CSSProperties, useEffect, useState } from 'react'
import anxiousghost from '../../../assets/major_cases/social-deduction/anxiousghost.png'
import happyghost from '../../../assets/major_cases/social-deduction/happyghost.png'
import heartghost from '../../../assets/major_cases/social-deduction/heartghost.png'
import normalghost from '../../../assets/major_cases/social-deduction/normalghost.png'
import sleepyghost from '../../../assets/major_cases/social-deduction/sleepyghost.png'

import InternalCharacterRoleTooltip from './CharacterRoleTooltip'
import { InternalCharacter } from './SocialDeductionEnums'

export default function InternalCharacters () {
  const [selectedInternalCharacter, setSelectedInternalCharacter] = useState<InternalCharacter>(InternalCharacter.ANXIOUS_GHOST)

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

  const InternalCharacterAsset = ({imageSrc, extraStyles, character}: {imageSrc: string, extraStyles: CSSProperties, character: InternalCharacter}) => {
    return (
      <RelativeAsset imageSrc={imageSrc} extraStyles={extraStyles} 
        onHover={() => { setSelectedInternalCharacter(character) }}
        onLeave={() => { setSelectedInternalCharacter(InternalCharacter.NONE) }}
      />
    )
  }

  return (
    <section className="characters">
      <div className="map relative left-1/2 transform -translate-x-1/2 aspect-w-4 aspect-h-3 max-w-screen-xl w-full">
        
        {/* MAIN CHARACTERS */}
        <InternalCharacterAsset character={InternalCharacter.GREEN_RIBBON} imageSrc={greenribbon}
          extraStyles={{
            top: '16%',
            left: '7%',
            width: '28%',
            zIndex: 1,
          }}
        />
        <InternalCharacterAsset character={InternalCharacter.DAISYCULA} imageSrc={daisycula}
          extraStyles={{
            top: '30%',
            left: '14%',
            width: '30%',
            zIndex: 2,
          }}
        />
        <InternalCharacterAsset character={InternalCharacter.INVISIGUY} imageSrc={invisiguy}
          extraStyles={{
            top: '24%',
            left: '36%',
            width: '22%',
            zIndex: 1,
          }}
        />
        <InternalCharacterAsset character={InternalCharacter.WOLF_GUY} imageSrc={wolfguy}
          extraStyles={{
            top: '24%',
            left: '56%',
            width: '21%',
            zIndex: 1,
          }}
        />
        <InternalCharacterAsset character={InternalCharacter.GORGON} imageSrc={gorgon}
          extraStyles={{
            top: '30%',
            left: '63%',
            width: '32%',
            zIndex: 2,
          }}
        />

        {/* GHOSTS */}
        <InternalCharacterAsset character={InternalCharacter.HEART_GHOST} imageSrc={heartghost}
          extraStyles={{
            top: '46%',
            left: '2%',
            width: '6%',
            zIndex: 1,
          }}
        />
        <InternalCharacterAsset character={InternalCharacter.NORMAL_GHOST} imageSrc={normalghost}
          extraStyles={{
            top: '4%',
            left: '21%',
            width: '8%',
            zIndex: 1,
          }}
        />
        <InternalCharacterAsset character={InternalCharacter.HAPPY_GHOST} imageSrc={happyghost}
          extraStyles={{
            top: '13%',
            left: '78%',
            width: '7%',
            zIndex: 1,
          }}
        />
        <InternalCharacterAsset character={InternalCharacter.ANXIOUS_GHOST} imageSrc={anxiousghost}
          extraStyles={{
            top: '19%',
            left: '86%',
            width: '7%',
            zIndex: 1,
          }}
        />
        <InternalCharacterAsset character={InternalCharacter.SLEEPY_GHOST} imageSrc={sleepyghost}
          extraStyles={{
            top: '70%',
            left: '91%',
            width: '7%',
            zIndex: 3,
          }}
        />

        {/* SELECTED CHARACTER */}
          <div 
            id="selected-character-div"
            className="selected-character absolute opacity-0 transition-opacity duration-300 ease-out"
            style={{
              top: '95%',
              left: '53%',
              transform: 'translate(-50%, -50%)', // anchors from the center
              zIndex: 4,
            }}
          >
            <InternalCharacterRoleTooltip char_role={selectedInternalCharacter} scale={1.5} />
          </div>
        

        {/* BACKGROUND */}
        <div className="art-bg">
          <img
            className="art-bg-img"
            src={background}
          />
        </div>

        
      </div>
    </section>
  )
}