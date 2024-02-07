import LandingInfo from "../components/landing/LandingInfo";
import LandingSplash from "../components/landing/LandingSplash";


export default function Landing() {
  return (
    <div className="landing bg-[#02031d] text-white"> 
      <LandingSplash />
      <LandingInfo />
    </div>
  )
}