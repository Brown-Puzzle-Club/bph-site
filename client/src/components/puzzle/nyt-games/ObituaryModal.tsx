import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { BeatLoader } from "react-spinners";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const obituarySchema = z.object({
  connections_answer: z.string(),
  letterboxd_answer: z.string(),
  wordle_answer: z.string(),
});

interface SubscriptionModalProps {
  setIsModalOpen: (isOpen: boolean) => void; // Define prop for setting the modal open state
  setCorrectAnswer: (answer: string) => void; // Define prop for setting the correct answer
}

const SubscriptionModal = ({ setIsModalOpen, setCorrectAnswer }: SubscriptionModalProps) => {
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<z.infer<typeof obituarySchema>>({
    resolver: zodResolver(obituarySchema),
  });

  const submit_answer = async (values: z.infer<typeof obituarySchema>) => {
    setSubmitting(true);
    // Submit the answer
    try {
      const response = await axios.post("/api/puzzle/nyt/obituary-check", values);
      const data = response.data;
      if (response.status === 200 && data.correct === true) {
        setIsModalOpen(false);
        setCorrectAnswer(data.answer);
      } else {
        toast.error("Incorrect answer. Please try again.", {
          duration: 5000,
          position: "top-center",
        });
      }
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("An error has occured.", { duration: 5000, position: "top-center" });
    } finally {
      setSubmitting(false);
    }
  };

  // Render the modal only if isOpen is true
  return (
    <div className="w-full inset-0 flex items-center justify-center">
      <div className="w-full inset-x-0 bottom-0 mx-auto p-6 bg-white shadow-lg">
        {/* Modal Content */}
        <div className="text-center h-100 items-center justify-center flex flex-col">
          <p className="">
            You&apos;ve reached your limit of free articles. Already a subscriber? <b>Log in</b>
          </p>
          <div className="border-2 border-blue-500 rounded-md max-w-screen-md py-5 mt-4 w-9/12">
            <h2 className="text-xl font-bold mb-4 ">Special offer:</h2>
            <h2 className="text-lg">Get unlimited access by proving you&apos;re</h2>
            <h2 className="text-lg">not a robot and clicking the &apos;Subscribe</h2>
            <h2 className="text-lg mb-4">Now&apos; button below.</h2>
            <h2 className="text-lg mb-4 text-zinc-500">$0.00/week</h2>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(submit_answer)}
                className="text-white dark space-y-2 px-10"
              >
                <FormField
                  control={form.control}
                  name="connections_answer"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormControl>
                        <Input type="text" placeholder="Connection: Final Category" {...field} />
                      </FormControl>
                      <FormMessage className="text-right" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="letterboxd_answer"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Lettertroxd: Final Word in 3rd Game"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-right" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="wordle_answer"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormControl>
                        <Input type="text" placeholder="Wordlangman: Final Word" {...field} />
                      </FormControl>
                      <FormMessage className="text-right" />
                    </FormItem>
                  )}
                />
                <div className="">
                  {submitting ? (
                    <BeatLoader className="self-center" color={"#fff"} size={12} />
                  ) : (
                    <Button
                      className="font-sans bg-blue-500 text-white font-semibold py-2 px-8 rounded-md hover:bg-blue-600 mr-2"
                      type="submit"
                    >
                      SUBSCRIBE NOW
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
