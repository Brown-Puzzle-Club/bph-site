import { MajorCaseEnum } from "@/utils/constants";
import axios from "axios";

function sanitize_answer(answer: string) {
  const answer_only_letters = answer.replace(/[^a-zA-Z]/g, "");
  return answer_only_letters.trim().toUpperCase();
}

const submit_answer = async (puzzle_slug: string, answer: string) => {
  const submitUrl = `/api/puzzle/${puzzle_slug}/submit?answer=${answer}`;
  console.log(`submitting answer to ${submitUrl}`);
  const response = await axios.post(submitUrl);
  console.log(response);
  if (response.data.status === "correct") {
    alert("Correct answer!");
  }
  return response;
};

const AnswerSubmitRedThread = ({ puzzle_slug }: { puzzle_slug: string }) => {
  return (
    <div>
      <h1>RED THREAD Answer Submission for {puzzle_slug}</h1>
      <p>TODO: Answer Submission goes here...</p>
    </div>
  );
};

const AnswerSubmitRegular = ({ puzzle_slug }: { puzzle_slug: string }) => {
  return (
    <div>
      <h1>REGULAR Answer Submission</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const answer = (document.getElementById("answer") as HTMLInputElement).value;
          submit_answer(puzzle_slug, sanitize_answer(answer));
        }}
      >
        <input type="text" id="answer" />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default function AnswerSubmit({
  puzzle_slug,
  major_case,
}: {
  puzzle_slug: string;
  major_case: MajorCaseEnum;
}) {
  return (
    <div>
      {major_case === MajorCaseEnum.COLORED_THREAD ? (
        <AnswerSubmitRedThread puzzle_slug={puzzle_slug} />
      ) : (
        <AnswerSubmitRegular puzzle_slug={puzzle_slug} />
      )}
    </div>
  );
}
