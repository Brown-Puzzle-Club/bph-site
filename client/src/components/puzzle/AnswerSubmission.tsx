import { MajorCaseEnum } from "@/utils/constants";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";

import { AnswerSubmission, Puzzle } from "@/utils/django_types";
import { cn } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { z } from "zod";
import { Input } from "../ui/input";

function sanitize_answer(answer: string) {
  const answer_only_letters = answer.replace(/[^a-zA-Z]/g, "");
  return answer_only_letters.trim().toUpperCase();
}

const redThreadAnswerSchema = z.object({
  location: z.string(),
  cause: z.string(),
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
    defaultValues: {
      location: "",
      cause: "",
    },
  });

  const submit_answer = async (values: z.infer<typeof redThreadAnswerSchema>) => {
    setSubmitting(true);
    const location = sanitize_answer(values.location);
    const cause = sanitize_answer(values.cause);
    const submitUrl = `/api/red_thread_submit?slug=${puzzle_slug}&location=${location}&cause=${cause}`;
    console.log(`submitting answer to ${submitUrl}`);
    const response = await axios.post(submitUrl);
    console.log(response);
    if (response.data.status === "correct") {
      alert("Correct answer!");
    }
    const answer = `${location} ON ${cause} ST.`;
    const new_submission: AnswerSubmission = {
      id: 0,
      submitted_answer: answer,
      is_correct: response.data.status === "correct",
      submitted_datetime: new Date(),
      used_free_answer: false,
    };
    setSubmissions((submissions) => [new_submission, ...submissions]);
    setSubmitting(false);
    return response;
  };

  return (
    <div className="pt-3 lg:mx-[40%] md:mx-[30%] mx-[10%]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submit_answer)} className="text-white dark">
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
          {submitting ? (
            <BeatLoader className="justify-center content-center p-4" color={"#fff"} size={12} />
          ) : (
            <Button type="submit">Submit</Button>
          )}
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
    defaultValues: {
      answer: "",
    },
  });

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
          alert("Correct answer!");
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
      })
      .finally(() => {
        setSubmitting(false);
      });
    return Response;
  };

  return (
    <div className="pt-3 lg:mx-[40%] md:mx-[30%] mx-[10%]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submit_answer)} className="text-white dark">
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="text" placeholder="Enter answer" {...field} />
                </FormControl>
                <FormMessage className="text-right" />
              </FormItem>
            )}
          />
          {submitting ? (
            <BeatLoader className="justify-center content-center p-4" color={"#fff"} size={12} />
          ) : (
            <Button type="submit">Submit</Button>
          )}
        </form>
      </Form>
    </div>
  );
};

const SubmissionHistory = ({ submissions }: { submissions: AnswerSubmission[] }) => {
  if (!submissions || submissions.length == 0) return null;

  return (
    <div className="flex justify-center">
      <table className="table-auto border border-collapse border-slate-500">
        <tbody>
          {submissions.map((submission, i) => (
            <tr key={`submission-${i}`}>
              <td className="border border-slate-500 px-4 py-2">{submission.submitted_answer}</td>
              <td
                className={cn(
                  "border border-slate-500 px-4 py-2 font-mono text-sm",
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
  );
};

export default function AnswerSubmit({
  puzzle,
  major_case,
}: {
  puzzle: Puzzle;
  major_case: MajorCaseEnum;
}) {
  const [submissions, setSubmissions] = useState(puzzle.submissions);

  useEffect(() => {
    setSubmissions(puzzle.submissions);
  }, [puzzle]);

  return (
    <div>
      {major_case === MajorCaseEnum.COLORED_THREAD ? (
        <AnswerSubmitRedThread puzzle_slug={puzzle.slug} setSubmissions={setSubmissions} />
      ) : (
        <AnswerSubmitRegular puzzle_slug={puzzle.slug} setSubmissions={setSubmissions} />
      )}
      <SubmissionHistory submissions={submissions} />
    </div>
  );
}
