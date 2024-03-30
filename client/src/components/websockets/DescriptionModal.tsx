import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DescriptionModalProps {
  caseName: string;
  desc: string;
}

const DescriptionModal = ({ caseName, desc }: DescriptionModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{caseName}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="capitalize">{caseName}</DialogTitle>
          <DialogDescription>{desc}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default DescriptionModal;
