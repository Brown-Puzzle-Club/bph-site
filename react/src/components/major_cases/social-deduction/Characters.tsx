import background from '../../../assets/major_cases/social-deduction/Background.png'
import RelativeAsset from '../../RelativeAsset'

// characters
import invisiguy from '../../../assets/major_cases/social-deduction/Invisiguy.png'
import daisycula from '../../../assets/major_cases/social-deduction/daisycula.png'
import gorgon from '../../../assets/major_cases/social-deduction/gorgon.png'
import greenribbon from '../../../assets/major_cases/social-deduction/greenribbon.png'
import wolfguy from '../../../assets/major_cases/social-deduction/wolfguy.png'

// ghosts
import anxiousghost from '../../../assets/major_cases/social-deduction/anxiousghost.png'
import happyghost from '../../../assets/major_cases/social-deduction/happyghost.png'
import heartghost from '../../../assets/major_cases/social-deduction/heartghost.png'
import normalghost from '../../../assets/major_cases/social-deduction/normalghost.png'
import sleepyghost from '../../../assets/major_cases/social-deduction/sleepyghost.png'

export default function Characters () {
  return (
    <section className="characters">
      <div className="map relative left-1/2 transform -translate-x-1/2 aspect-w-4 aspect-h-3 max-w-screen-xl w-full">
        
        {/* MAIN CHARACTERS */}
        <RelativeAsset imageSrc={greenribbon}
          extraStyles={{
            top: '16%',
            left: '7%',
            width: '28%',
            zIndex: 1,
          }}
        />
        <RelativeAsset imageSrc={daisycula}
          extraStyles={{
            top: '30%',
            left: '14%',
            width: '30%',
            zIndex: 2,
          }}
        />
        <RelativeAsset imageSrc={invisiguy}
          extraStyles={{
            top: '24%',
            left: '36%',
            width: '22%',
            zIndex: 1,
          }}
        />
        <RelativeAsset imageSrc={wolfguy}
          extraStyles={{
            top: '24%',
            left: '56%',
            width: '21%',
            zIndex: 1,
          }}
        />
        <RelativeAsset imageSrc={gorgon}
          extraStyles={{
            top: '30%',
            left: '63%',
            width: '32%',
            zIndex: 2,
          }}
        />

        {/* GHOSTS */}
        <RelativeAsset imageSrc={heartghost}
          extraStyles={{
            top: '46%',
            left: '2%',
            width: '6%',
            zIndex: 1,
          }}
        />
        <RelativeAsset imageSrc={normalghost}
          extraStyles={{
            top: '4%',
            left: '21%',
            width: '8%',
            zIndex: 1,
          }}
        />
        <RelativeAsset imageSrc={happyghost}
          extraStyles={{
            top: '13%',
            left: '78%',
            width: '7%',
            zIndex: 1,
          }}
        />
        <RelativeAsset imageSrc={anxiousghost}
          extraStyles={{
            top: '19%',
            left: '86%',
            width: '7%',
            zIndex: 1,
          }}
        />
        <RelativeAsset imageSrc={sleepyghost}
          extraStyles={{
            top: '70%',
            left: '91%',
            width: '7%',
            zIndex: 3,
          }}
        />
        
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