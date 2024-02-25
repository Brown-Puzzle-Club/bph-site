import { PresenceInfo } from "@/hooks/useSocket";
import Loader from "@/components/Loader";
import { CircleUserRound } from "lucide-react";

interface PresenceCounterProps {
  presenceInfo: PresenceInfo | null;
}

const PresenceCounter = ({ presenceInfo }: PresenceCounterProps) => {
  return (
    <div className="flex w-fit items-center gap-2 rounded-xl border border-red-500 p-2">
      {presenceInfo ? (
        <span className="flex h-6 w-6 items-center justify-center">
          {presenceInfo?.num_connected}
        </span>
      ) : (
        <Loader className="h-6 w-6 text-red-500" />
      )}
      <CircleUserRound className="h-6 w-6" />
    </div>
  );
};

export default PresenceCounter;
