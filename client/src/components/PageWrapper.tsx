import Footer from "@/components/Footer";
import Navbar from "@/components/navbar/Navbar";
import { useTheme } from "@/hooks/useTheme";
import { DEFAULT_THEME } from "@/utils/themes";
import { Toaster } from "./ui/toaster";

export const PageWrapper = ({ route }: { route: React.ReactNode }) => {
  const { theme } = useTheme();

  return (
    <div
      className={`react-page text-white`}
      style={{
        backgroundColor: theme.bg_color ? theme.bg_color : DEFAULT_THEME.bg_color,
      }}
    >
      <Navbar />
      <div
        className="content min-h-[90vh] pb-2"
        style={{
          backgroundColor: theme.content_color ? theme.content_color : DEFAULT_THEME.content_color,
        }}
      >
        {route}
      </div>
      <Toaster />
      <Footer
        extraStyle={{
          backgroundColor: theme.footer_color ? theme.footer_color : DEFAULT_THEME.footer_color,
        }}
      />
    </div>
  );
};
