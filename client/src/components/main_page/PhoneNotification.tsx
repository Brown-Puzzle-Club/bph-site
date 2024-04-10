import phoneNotif from "@/assets/main_page/PhoneNotif.png";
import { cn } from "@/utils/utils";

export interface PhoneNotificationProps {
  icon?: string;
  name: string;
  time: Date;
  location: string;
  instructions?: string;
  is_soon?: boolean;
}

const PhoneNotification = ({ name, time, location, is_soon, icon }: PhoneNotificationProps) => {
  const now = new Date();
  const mins_until = new Date(time.getTime() - now.getTime()).getMinutes() + 1;

  return (
    new Date() < time && (
      <div
        className={cn("relative w-full grid place-items-center", is_soon ? "hue-rotate-30" : "")}
      >
        <img className={cn("relative w-[80%]")} src={phoneNotif} alt="notification" />
        <p
          className="absolute text-[0.5vw] select-none"
          style={{
            top: "13%",
            left: "23%",
            transform: "translateX(-50%)",
          }}
        >
          {icon}
        </p>
        <div className="grid gap-[0.5] absolute text-black" style={{ top: "15%", left: "31%" }}>
          <div className="flex items-center gap-1">
            <h2 className="text-bold text-[0.2vw] font-bold">{name}</h2>
            <p className="text-[0.1vw]">
              {time.getHours()}:
              {time.getMinutes().toLocaleString("en-US", { minimumIntegerDigits: 2 })}
            </p>
          </div>
          <p className="text-[0.1vw]">{location}</p>
          {is_soon && (
            <p className="text-[0.1vw] font-bold text-[white] bg-[red] text-center mr-[0.2vw] p-[0.05vw]">
              EVENT STARTING IN {mins_until} MINUTE
              {mins_until > 1 && "S"}
            </p>
          )}
        </div>
      </div>
    )
  );
};

export default PhoneNotification;
