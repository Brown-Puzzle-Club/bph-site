import { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { BeatLoader } from 'react-spinners';
import CharacterRoleTooltip from './CharacterRoleTooltip';
import { InternalCharacter, Role } from './constants';

export default function Verdict() {
  const [output, setOutput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assignments, setAssignments] = useState({});
  // console.log(assignments)

  const handleAssignRole = (character: InternalCharacter, role: Role) => {
    setAssignments((prevAssignments) => ({
      ...prevAssignments,
      [character]: role,
    }));
  };

  // remove the role from the assignments if it is already assigned
  const handleRemoveAssignment = (role: Role) => {
    const character = Object.keys(assignments).find((key) => assignments[key as keyof typeof assignments] === role);
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
  }

  const submit = async () => {
    setIsSubmitting(true);

    const csrftoken = getCookie('csrftoken');
    
    try {
      const result = await fetch("/social-deduction/submit", {
        method: 'POST',
        body: JSON.stringify({
          assignments
        }),
        headers: { "X-CSRFToken": csrftoken || '', 'Content-Type': 'application/json' },
      });

      if (!result.ok) {
        // HTTP response code was not 2xx. Maybe introspect more...
        setOutput(`Error: ${result.status} ${result.statusText}`);
      } else {
        const res = await result.json();
        console.log(res)
        setOutput(res['content']);
      }
    } catch (e) {
      // This error handling will be very poor.
      setOutput(`Error: ${e}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCookie = (name: string) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  const RoleDraggable = ({ role, assigned }: { role: Role, assigned?: boolean }) => {
    const [, roleRef] = useDrag({
      type: "role",
      item: { role },
    });
    const assigned_character: boolean = Object.keys(assignments).find((key) => assignments[key as keyof typeof assignments] === role) !== undefined;
    return (
      (assigned_character && !assigned) ? <></> :
      <div ref={roleRef} className="draggable-role inline-flex cursor-grab">
        <CharacterRoleTooltip char_role={role} />
      </div>
    );
  };

  const RoleDropTarget = ({ character }: { character: InternalCharacter}) => {
    const [, drop] = useDrop({
      accept: "role",
      drop: (item : { role: Role }) => {
        handleRemoveAssignment(item.role)
        handleAssignRole(character, item.role)
      },
    });
    return (
    <div ref={drop} className="role-drop-target inline-flex items-center ml-1">
      {" "}{
      character in assignments ? <RoleDraggable role={assignments[character as keyof typeof assignments]} assigned={true} /> 
      : <div className="empty-slot bg-[#67676a45] rounded-xl w-30 h-6 px-10">...</div>}
    </div>
    );
  };

  return (
      <div className="roles content p-10">
        <div className="verdict characters">
          {Object.values(InternalCharacter).map((character) => {
            if (character === InternalCharacter.NONE) return <></>;
            return (
              <div className={"character " + character}>
                <CharacterRoleTooltip char_role={character}/>
                {" "}was the 
                <RoleDropTarget character={character} />
                <br/>
              </div>
            )}
          )}
        </div>
        <br></br><br></br>
        <div className="verdict roles space-x-2">
          {Object.values(Role).map((role) => {
            return (
                <RoleDraggable role={role} />
            )}
          )}
      </div>
      <br></br>
      
      <div className="flex justify-center space-x-2 px-10">
        <button onClick={submit} disabled={isSubmitting}>
          Submit
        </button>
        <button onClick={handleResetAssignments}>
          Reset
        </button>
      </div>
      <div className="flex justify-center space-x-2 px-10 py-5">
        {isSubmitting ? (
              <BeatLoader color={'#fff'} size={12} />
            ) : (
              <div id="output">
                {output}
              </div>
          )}
      </div>
    </div>
  );
}