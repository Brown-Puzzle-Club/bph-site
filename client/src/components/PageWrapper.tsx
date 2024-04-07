import Footer from "@/components/Footer";
import Navbar from "@/components/navbar/Navbar";
// import { useNotification } from "@/hooks/useNotification";
import { useTheme } from "@/hooks/useTheme";
import { DEFAULT_THEME } from "@/utils/themes";
import { Toaster } from "./ui/toaster";
import { useNotification } from "@/hooks/useNotification";

export const PageWrapper = ({ route }: { route: React.ReactNode }) => {
  const { theme } = useTheme();
  // useNotification({
  //   onOpen: (e) => console.log("Notifications connected", e),
  //   onClose: (e) => console.log("Notifications disconnected", e),
  //   onError: (e) => console.error("Notifications error", e),
  //   onMessage: (e) => console.log("Notifications message", e),
  // });
  // const state = useSSE("notifications/admin", {});
  useNotification();
  // useEffect(() => {
  //   console.log("loading server event source");
  //   async function fetchStream() {
  //     await fetchEventSource("notifications/admin", {
  //       onmessage(ev) {
  //         console.log(ev);
  //       },
  //     });
  //   }
  //   fetchStream();
  // }, []);

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
