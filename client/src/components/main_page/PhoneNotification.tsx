import phoneNotif from "@/assets/main_page/PhoneNotif.png";

interface PhoneNotificationProps {
  name: string;
  time: Date;
  location: string;
}

const PhoneNotification = ({ name, time, location }: PhoneNotificationProps) => {
  return (
    new Date() < time && (
      <div className="relative w-full grid place-items-center">
        <img className="relative w-[80%]" src={phoneNotif} alt="notification" />
        <div className="grid gap-[0.5] absolute text-black" style={{ top: "15%", left: "31%" }}>
          <div className="flex items-center gap-2">
            <h2 className="text-bold text-[0.2vw]">{name}</h2>
            <p className="text-[0.1vw]">
              {time.getHours()}:
              {time.getMinutes().toLocaleString("en-US", { minimumIntegerDigits: 2 })}
            </p>
          </div>
          <p className="text-[0.1vw]">{location}</p>
        </div>
      </div>
    )
  );
};

export default PhoneNotification;
