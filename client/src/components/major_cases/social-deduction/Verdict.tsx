import axios from "axios";
import { useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import ReactMarkdown from "react-markdown";
import { BeatLoader } from "react-spinners";
import remarkGfm from "remark-gfm";

import { MarkdownComponents } from "@/components/puzzle/MarkdownComponent";

import { InternalCharacter, Role } from "../../../utils/major_cases/social-deduction/constants";
import CharacterRoleTooltip from "./CharacterRoleTooltip";

export default function Verdict({
  CHAR_NAMES,
}: {
  CHAR_NAMES: { [key in InternalCharacter]: string };
}) {
  const [output, setOutput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assignments, setAssignments] = useState({});

  // Load assignments from localStorage on component mount
  useEffect(() => {
    const cachedAssignments = localStorage.getItem("assignments");
    const parsed = JSON.parse(cachedAssignments || "{}");
    if (Object.keys(parsed).length !== 0) {
      setAssignments(parsed);
    }
  }, []);

  // Save assignments to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("assignments", JSON.stringify(assignments));
  }, [assignments]);

  const handleAssignRole = (character: InternalCharacter, role: Role) => {
    setAssignments((prevAssignments) => ({
      ...prevAssignments,
      [character]: role,
    }));
  };

  // remove the role from the assignments if it is already assigned
  const handleRemoveAssignment = (role: Role) => {
    const character = Object.keys(assignments).find(
      (key) => assignments[key as keyof typeof assignments] === role,
    );
    if (character) {
      setAssignments((prevAssignments) => {
        const newAssignments = { ...prevAssignments };
        delete newAssignments[character as keyof typeof assignments];
        return newAssignments;
      });
    }
  };

  const handleResetAssignments = () => {
    setAssignments({});
  };

  const submit = async () => {
    setIsSubmitting(true);

    axios
      .post("/api/puzzle/social-deduction/verdict_guess", {
        assignments,
      })
      .then((response) => {
        setOutput(response.data["content"]);
      })
      .catch((error) => {
        setOutput(`Error: ${error}`);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const RoleDraggable = ({ role, assigned }: { role: Role; assigned?: boolean }) => {
    const [, roleRef] = useDrag({
      type: "role",
      item: { role },
    });
    const assigned_character: boolean =
      Object.keys(assignments).find(
        (key) => assignments[key as keyof typeof assignments] === role,
      ) !== undefined;
    return assigned_character && !assigned ? (
      <></>
    ) : (
      <div ref={roleRef} className="draggable-role inline-flex cursor-grab">
        <CharacterRoleTooltip
          char_role={role}
          extraClasses={assigned ? "border-2 border-[#b8a38738]" : ""}
          CHAR_NAMES={CHAR_NAMES}
        />
      </div>
    );
  };

  const RoleDropTarget = ({ character }: { character: InternalCharacter }) => {
    const [, drop] = useDrop({
      accept: "role",
      drop: (item: { role: Role }) => {
        handleRemoveAssignment(item.role);
        handleAssignRole(character, item.role);
      },
    });
    return (
      <div ref={drop} className="role-drop-target inline-flex items-center ml-1">
        {" "}
        {character in assignments ? (
          <RoleDraggable
            role={assignments[character as keyof typeof assignments]}
            assigned={true}
          />
        ) : (
          <div className="empty-slot bg-[#67676a2b] rounded-xl w-30 h-7 px-10 border-2 border-[#595454]"></div>
        )}
      </div>
    );
  };

  const RoleBox = () => {
    const [, drop] = useDrop({
      accept: "role",
      drop: (item: { role: Role }) => {
        handleRemoveAssignment(item.role);
      },
    });
    return (
      <div
        ref={drop}
        className="verdict roles space-x-2 text-xl bg-[#26222252] rounded-md border-2 border-[#5c51514d] p-3"
      >
        {Object.values(Role).map((role, i) => {
          return <RoleDraggable role={role} key={"roledrag-" + i} />;
        })}
      </div>
    );
  };

  return (
    <div className="roles content p-10">
      <div className="verdict characters text-lg">
        {Object.values(InternalCharacter).map((character, i) => {
          if (character === InternalCharacter.NONE) return <div key={"verdict-" + i}></div>;
          return (
            <div
              className={"text-xl py-1 flex items-center space-x-1 character " + character}
              key={"verdict-" + i}
            >
              <CharacterRoleTooltip char_role={character} CHAR_NAMES={CHAR_NAMES} />
              <p>was the</p>
              <RoleDropTarget character={character} />
              <br />
            </div>
          );
        })}
      </div>
      <div className="text-break h-1 w-50 bg-[#80808024] mx-auto mb-8 mt-5 rounded-md"></div>
      <RoleBox />
      <br></br>

      <div className="flex justify-center space-x-2 px-10">
        <button onClick={() => submit()} disabled={isSubmitting}>
          Submit
        </button>
        <button onClick={() => handleResetAssignments()}>Reset</button>
      </div>
      <div className="flex justify-center space-x-2 px-10 py-5">
        {isSubmitting ? (
          <BeatLoader color={"#fff"} size={12} />
        ) : (
          <div id="output">
            {
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents}>
                {output}
              </ReactMarkdown>
            }
          </div>
        )}
      </div>
    </div>
  );
}
