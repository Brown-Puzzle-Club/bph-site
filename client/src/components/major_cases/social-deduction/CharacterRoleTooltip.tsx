import type { Role } from "../../../utils/major_cases/social-deduction/constants";
import {
  CharacterRoleAssetMap,
  CharacterRoleColorMap,
  InternalCharacter,
} from "../../../utils/major_cases/social-deduction/constants";

export default function CharacterRoleTooltip({
  char_role,
  scale,
  extraClasses,
  CHAR_NAMES,
}: {
  char_role: InternalCharacter | Role;
  scale?: boolean;
  extraClasses?: string;
  CHAR_NAMES?: { [key in InternalCharacter]: string };
}) {
  const tooltipColor = CharacterRoleColorMap[char_role];
  const tooltipAsset = CharacterRoleAssetMap[char_role];
  const name =
    char_role in InternalCharacter
      ? CHAR_NAMES?.[char_role as InternalCharacter] ?? char_role
      : char_role;

  return (
    <div
      className={`flex items-center px-2 py-0.5 my-0.5 rounded-xl ${extraClasses}`}
      style={{
        backgroundColor: tooltipColor,
        width: "fit-content",
        fontSize: scale ? `2.25vw` : undefined,
        display: !scale ? `inline-flex  ` : undefined,
      }}
    >
      <b className="block text-nowrap">{name}</b>
      {tooltipAsset && (
        <img
          src={tooltipAsset}
          alt={`${char_role} profile`}
          className="rounded-full top-0 left-0 br-1 ml-2"
          style={{
            width: scale ? `3vw` : `1.5rem`,
            height: scale ? `3vw` : `1.5rem`,
          }}
        />
      )}
    </div>
  );
}
