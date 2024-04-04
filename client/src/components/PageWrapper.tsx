import Footer from "@/components/Footer";
import Navbar from "@/components/navbar/Navbar";
import { useTheme } from "@/hooks/useTheme";
import { Toaster } from "./ui/toaster";

export const PageWrapper = ({ route }: { route: React.ReactNode }) => {
  const { theme } = useTheme();

  return (
    <div
      className={`react-page text-white`}
      style={{
        backgroundColor: theme.bg_color,
      }}
    >
      <Navbar />
      <div className="content min-h-[90vh]">{route}</div>
      <Toaster />
      <Footer />
    </div>
  );
};
