import Footer from "@/components/Footer";
import Navbar from "@/components/navbar/Navbar";
import { Toaster } from "./ui/toaster";

export const PageWrapper = ({
  bg_color,
  navbar_color,
  route,
}: {
  bg_color: string;
  navbar_color: string;
  route: React.ReactNode;
}) => {
  return (
    <div
      className={`react-page`}
      style={{
        backgroundColor: bg_color,
      }}
    >
      <Navbar navbarColor={navbar_color} />
      <div className="content min-h-[90vh]">{route}</div>
      <Toaster />
      <Footer />
    </div>
  );
};
