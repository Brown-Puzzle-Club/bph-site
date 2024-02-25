import { cn } from "@/utils/cn";
import { Loader2 } from "lucide-react";

const Loader = ({ className }: { className?: string }) => {
  return <Loader2 className={cn("h-4 w-4 animate-spin", className)} />;
};

export default Loader;
