import { MajorCaseEnum } from "@/utils/constants";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";

import { AnswerSubmission, Puzzle, PuzzleMessage } from "@/utils/django_types";
import { cn } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { BeatLoader } from "react-spinners";
import { z } from "zod";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";

function sanitize_answer(answer: string) {
  const answer_only_letters = answer.replace(/[^a-zA-Z]/g, "");
  return answer_only_letters.trim().toUpperCase();
}

const redThreadAnswerSchema = z.object({
  cause: z.string(),
  location: z.string(),
});

const answerSchema = z.object({
  answer: z.string(),
});

const AnswerSubmitRedThread = ({
  puzzle_slug,
  setSubmissions,
}: {
  puzzle_slug: string;
  setSubmissions: React.Dispatch<React.SetStateAction<AnswerSubmission[]>>;
}) => {
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<z.infer<typeof redThreadAnswerSchema>>({
    resolver: zodResolver(redThreadAnswerSchema),
  });

  const { toast } = useToast();

  const submit_answer = async (values: z.infer<typeof redThreadAnswerSchema>) => {
    const location = sanitize_answer(values.location);
    const cause = sanitize_answer(values.cause);
    const answer = `${cause}ON${location}ST`;
    const submitUrl = `/api/puzzle/${puzzle_slug}/submit?answer=${answer}`;
    console.log(`submitting answer to ${submitUrl}`);
    setSubmitting(true);
    axios
      .post(submitUrl)
      .then((response) => {
        console.log(response);
        if (response.data.status === "correct") {
          toast({
            variant: "answersubmit_happy",
            title: "Correct answer!",
          });
        } else {
          const guesses_left = response.data.guesses_left;
          toast({
            variant: "answersubmit",
            title: `Incorrect answer. ${guesses_left} guesses left.`,
          });
        }
        const new_submission: AnswerSubmission = {
          id: 0,
          submitted_answer: answer,
          is_correct: response.data.status === "correct",
          submitted_datetime: new Date(),
          used_free_answer: false,
        };
        setSubmissions((submissions) => [new_submission, ...submissions]);
        return response;
      })
      .catch((error) => {
        console.log(error);
        if (error.response.data.error == "Answer submission failed") {
          toast({
            variant: "answersubmit_error",
            title: `Answer already submitted.`,
          });
        } else if (error.response.error == "No guesses remaining") {
          toast({
            variant: "answersubmit_error",
            title: `You are out of guesses.`,
          });
        } else if (error.response.status == 403) {
          toast({
            variant: "answersubmit_error",
            title: `You are unauthorized to answer this puzzle.`,
          });
        }
      })
      .finally(() => {
        setSubmitting(false);
      });
    return Response;
  };

  return (
    <div className="pt-3 lg:mx-[20%] flex flex-col items-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submit_answer)}
          className="text-white dark flex items-center space-x-3" // Changed flex class to include items-center
        >
          <p>The victim was</p>
          <FormField
            control={form.control}
            name="cause"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="text" placeholder="Cause of crime" {...field} />
                </FormControl>
                <FormMessage className="text-right" />
              </FormItem>
            )}
          />
          <p className="font-mono">ON</p>
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="text" placeholder="Location of crime" {...field} />
                </FormControl>
                <FormMessage className="text-right" />
              </FormItem>
            )}
          />
          <p className="font-mono">STREET</p>
          <div className="flex justify-end">
            {submitting ? (
              <BeatLoader className="self-center" color={"#fff"} size={12} />
            ) : (
              <Button type="submit">Submit</Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

const AnswerSubmitRegular = ({
  puzzle_slug,
  setSubmissions,
}: {
  puzzle_slug: string;
  setSubmissions: React.Dispatch<React.SetStateAction<AnswerSubmission[]>>;
}) => {
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<z.infer<typeof answerSchema>>({
    resolver: zodResolver(answerSchema),
  });
  const { toast } = useToast();

  const submit_answer = async (values: z.infer<typeof answerSchema>) => {
    const answer = sanitize_answer(values.answer);
    const submitUrl = `/api/puzzle/${puzzle_slug}/submit?answer=${answer}`;
    console.log(`submitting answer to ${submitUrl}`);
    setSubmitting(true);
    axios
      .post(submitUrl)
      .then((response) => {
        console.log(response);
        if (response.data.status === "correct") {
          toast({
            variant: "answersubmit_happy",
            title: "Correct answer!",
          });
        } else if (response.data.messages.length > 0) {
          response.data.messages.forEach((message: PuzzleMessage) => {
            toast({
              variant: "answersubmit_flagged",
              title: message.response,
            });
          });
        } else {
          const guesses_left = response.data.guesses_left;
          toast({
            variant: "answersubmit",
            title: `Incorrect answer. ${guesses_left} guesses left.`,
          });
        }
        const new_submission: AnswerSubmission = {
          id: 0,
          submitted_answer: answer,
          is_correct: response.data.status === "correct",
          submitted_datetime: new Date(),
          used_free_answer: false,
        };
        setSubmissions((submissions) => [new_submission, ...submissions]);
        return response;
      })
      .catch((error) => {
        console.log(error);
        if (error.response.data.error == "Answer submission failed") {
          toast({
            variant: "answersubmit_error",
            title: `Answer already submitted.`,
          });
        } else if (error.response.error == "No guesses remaining") {
          toast({
            variant: "answersubmit_error",
            title: `You are out of guesses.`,
          });
        } else if (error.response.status == 403) {
          toast({
            variant: "answersubmit_error",
            title: `You are unauthorized to answer this puzzle.`,
          });
        }
      })
      .finally(() => {
        setSubmitting(false);
      });
    return Response;
  };

  return (
    <div className="pt-3 lg:mx-[40%] md:mx-[30%] mx-[10%] flex flex-col items-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submit_answer)} className="text-white dark flex">
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormControl>
                  <Input type="text" placeholder="Enter answer" {...field} />
                </FormControl>
                <FormMessage className="text-right" />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            {submitting ? (
              <BeatLoader className="self-center" color={"#fff"} size={12} />
            ) : (
              <Button type="submit">Submit</Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

const SubmissionHistory = ({ submissions }: { submissions: AnswerSubmission[] }) => {
  if (!submissions || submissions.length == 0) return null;

  return (
    <div className="flex justify-center h-full my-5 border border-slate-500 rounded lg:mx-[35vw] md:mx-[25vw] mx-[15vw] max-h-[12rem] ">
      <div className="w-full">
        <h3 className="text-center text-white dark border-b font-bold">SUBMISSIONS</h3>
        <div className="max-h-[10rem] overflow-auto">
          <table className="table-auto w-full">
            <tbody>
              {submissions.map((submission, i) => (
                <tr key={`submission-${i}`}>
                  <td className="border-b border-slate-500 px-4 py-2 text-left font-mono">
                    {submission.submitted_answer}
                  </td>
                  <td
                    className={cn(
                      "border-b border-slate-500 px-4 py-2 font-mono text-sm text-right",
                      submission.is_correct ? "text-green-100" : "text-red-100",
                    )}
                  >
                    {submission.is_correct ? "CORRECT" : "INCORRECT"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default function AnswerSubmit({
  puzzle,
  major_case,
}: {
  puzzle: Puzzle;
  major_case?: MajorCaseEnum;
}) {
  const [submissions, setSubmissions] = useState(puzzle.submissions);

  const PUZZLE_ANSWER = useMemo(() => {
    if (!submissions) return "";
    return submissions.filter((submission) => submission.is_correct)[0]?.submitted_answer || "";
  }, [submissions]);

  useEffect(() => {
    setSubmissions(puzzle.submissions);
  }, [puzzle]);

  return puzzle.name ? (
    <div>
      {PUZZLE_ANSWER != "" ? (
        <div className="text-white dark text-center">
          ANSWER: <span className="font-mono text-green-100">{PUZZLE_ANSWER}</span>
        </div>
      ) : major_case === MajorCaseEnum.COLORED_THREAD && puzzle.is_meta ? (
        <AnswerSubmitRedThread puzzle_slug={puzzle.slug} setSubmissions={setSubmissions} />
      ) : (
        <AnswerSubmitRegular puzzle_slug={puzzle.slug} setSubmissions={setSubmissions} />
      )}
      <SubmissionHistory submissions={submissions} />
    </div>
  ) : (
    <BeatLoader
      className="justify-center content-center pr-2 text-center"
      color={"#fff"}
      size={12}
    />
  );
}
