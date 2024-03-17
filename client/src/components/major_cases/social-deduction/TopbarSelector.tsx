import { ReactNode } from "react";
import { SelectedPanel } from "../../../routes/major_cases/SocialDeduction";

const TopbarSelector = ({
  children,
  setPanel,
  cur_panel,
  NUM_CASES_SOLVED,
}: {
  children: ReactNode;
  setPanel: (panel: SelectedPanel) => void;
  cur_panel: SelectedPanel;
  NUM_CASES_SOLVED: number;
}) => {
  const buttonStyle = (target_panel: SelectedPanel) =>
    `w-full md:w-auto rounded p-3 border-2 transition-colors ${
      cur_panel == target_panel
        ? "bg-[#331508] border-[#c1bdb1]"
        : "border-[#00000000] hover:bg-[#3d362c]"
    }`;

  return (
    <div
      className="sidebar-selector py-10 px-[20px] md:px-[10rem]"
      style={{ backgroundColor: "#1c160d" }}
    >
      <div className="pt-5 rounded-md" style={{ backgroundColor: "#352c20" }}>
        <div className="flex justify-center space-x-2 px-10">
          <button
            className={buttonStyle(SelectedPanel.RULES)}
            onClick={() => setPanel(SelectedPanel.RULES)}
          >
            RULES
          </button>
          <button
            className={buttonStyle(SelectedPanel.ROLES)}
            onClick={() => setPanel(SelectedPanel.ROLES)}
          >
            ROLES
          </button>
          <button
            className={buttonStyle(SelectedPanel.CHRONOLOGY)}
            onClick={() => setPanel(SelectedPanel.CHRONOLOGY)}
          >
            CHRONOLOGY
          </button>
          {NUM_CASES_SOLVED > 3 ? (
            <button
              className={buttonStyle(SelectedPanel.VERDICT)}
              onClick={() => setPanel(SelectedPanel.VERDICT)}
            >
              VERDICT
            </button>
          ) : (
            <></>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};

export default TopbarSelector;
