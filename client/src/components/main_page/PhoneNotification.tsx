// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogTitle,
//   DialogTrigger,
// } from "@radix-ui/react-dialog";
// import type { ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState, type PropsWithChildren } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaCheck } from "react-icons/fa";
import { BeatLoader } from "react-spinners";

import phoneNotif from "@/assets/main_page/PhoneNotif.png";
import { useDjangoContext } from "@/hooks/useDjangoContext";
import type { InPersonEvent } from "@/utils/django_types";
import { cn } from "@/utils/utils";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

export interface PhoneNotificationProps extends InPersonEvent {
  is_soon?: boolean;
  icon?: string;
  is_solved?: boolean;
}

const EventAnswerSubmission = (props: PhoneNotificationProps) => {
  const [isCorrect, setIsCorrect] = useState(false);
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      answer: "",
    },
  });

  const submit_answer = async (formData: { answer: string }) => {
    try {
      setLoading(true);
      const response = await axios.post(`/api/events/submit_answer`, {
        event_slug: props.slug,
        answer: formData.answer,
      });
      if (response.data.status === "correct") {
        setIsCorrect(true);
        toast.success("Correct answer! You have received a minor case solve voucher.");
        queryClient.invalidateQueries({ queryKey: ["context"] });
      } else {
        toast.error("Incorrect answer. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogHeader>
      <DialogTitle className="text-[white]">Submit Answer for {props.name}</DialogTitle>
      <DialogDescription>
        <p className="pb-4">
          You will recieve an answer on completion of the event. Submitting it here will get you one
          free minor case solve voucher!
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submit_answer)}
            className="flex items-center space-x-3" // Changed flex class to include items-center
          >
            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="text" placeholder="Event answer" {...field} />
                  </FormControl>
                  <FormMessage className="text-right" />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              {loading ? (
                <BeatLoader className="self-center" color={"#fff"} size={12} />
              ) : !isCorrect ? (
                <Button type="submit">Submit</Button>
              ) : (
                <FaCheck className="text-[green] self-center" size={20} />
              )}
            </div>
          </form>
        </Form>
      </DialogDescription>
    </DialogHeader>
  );
};

const EventCompletionDialogWrapper = ({
  children,
  ...props
}: PropsWithChildren<PhoneNotificationProps>) => {
  return (
    <Dialog>
      <DialogTrigger onClick={(e) => e.stopPropagation()}>{children}</DialogTrigger>
      <DialogContent className="dark">
        <EventAnswerSubmission {...props} />
      </DialogContent>
    </Dialog>
  );
};

const PhoneNotificationContent = ({
  name,
  timestamp,
  location,
  message,
  is_soon,
  is_solved,
  icon,
}: PhoneNotificationProps) => {
  const event_time = new Date(timestamp || "");
  const now = new Date();
  const mins_until = new Date(event_time.getTime() - now.getTime()).getMinutes() + 1;
  const event_passed = now > event_time;

  return (
    <div
      className={cn(
        "relative w-full grid place-items-center",
        is_soon ? "hue-rotate-30" : "",
        event_passed ? "hue-rotate-180 hover:cursor-select" : "",
      )}
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
          <h2 className="text-bold text-[0.2vw] font-bold tracking-tighter">{name}</h2>
          <p className="text-[0.1vw]">
            {event_time.getDate()}th {event_time.getHours()}:
            {event_time.getMinutes().toLocaleString("en-US", { minimumIntegerDigits: 2 })}
          </p>
        </div>
        <p className="text-[0.1vw] text-left">{location}</p>
        {is_soon ? (
          <span className="text-[0.1vw] font-bold text-[white] bg-[red] text-center mr-[0.6vw] p-[0.02vw]">
            IN {mins_until} MINUTE
            {mins_until > 1 && "S"}
          </span>
        ) : event_passed ? (
          is_solved ? (
            <FaCheck className="text-[#e06379] text-[0.2vw]" size={2} />
          ) : (
            <span className="text-[0.1vw] font-bold text-[white] bg-[red] text-center mr-[0.6vw] p-[0.02vw]">
              CLICK TO SUBMIT ANSWER
            </span>
          )
        ) : (
          <p className="text-[0.1vw] text-left">{message}</p>
        )}
      </div>
    </div>
  );
};

const PhoneNotification = (props: PhoneNotificationProps) => {
  const event_time = new Date(props.timestamp || "");
  const now = new Date();
  const event_passed = now > event_time;

  const { data: context } = useDjangoContext();

  const IS_SOLVED = context?.team_context.completed_events[props.slug] !== undefined;

  // if (IS_SOLVED) {
  //   return null;
  // }

  return event_passed ? (
    <EventCompletionDialogWrapper {...props}>
      <PhoneNotificationContent {...props} />
    </EventCompletionDialogWrapper>
  ) : (
    <PhoneNotificationContent {...props} is_solved={IS_SOLVED} />
  );
};

export default PhoneNotification;
