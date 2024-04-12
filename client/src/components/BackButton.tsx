import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function BackButton({ to }: { to: string }) {
  return (
    <div className="fixed top-8 left-0 z-50 p-4">
      <Link to={to}>
        <div className="bg-[#0f172a80] text-white p-2 rounded-lg shadow-md hover:bg-[#0f172a] transition-colors">
          <FaArrowLeft className="w-6 h-6" />
        </div>
      </Link>
    </div>
  );
}
