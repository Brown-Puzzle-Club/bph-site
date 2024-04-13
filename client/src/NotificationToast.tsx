import { motion } from "framer-motion";

interface NotificationToastProps {
  Icon: React.JSXElementConstructor<Record<string, unknown>>;
}

const NotificationToast = ({ Icon, children }: React.PropsWithChildren<NotificationToastProps>) => {
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      className="flex items-center gap-4 text-white rounded-lg bg-slate-900 p-4 shadow-md shadow-slate-800"
    >
      <Icon />
      <div>{children}</div>
    </motion.div>
  );
};

export default NotificationToast;
