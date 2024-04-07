import { ReactNode } from "react";

const CaseArtWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <div>This div is wrapped around the children</div>
      {children}
    </>
  );
};

export const TestCaseArt = () => {
  // TODO: make actual test art. (skewed boxes for images, etc. idk??)
  // this div will have a fixed aspect ratio to fit the left side of the case file.
  return (
    <>
      <CaseArtWrapper>
        <p>This is a test case with test art...</p>
      </CaseArtWrapper>
    </>
  );
};

// TODO: more case arts go here.

export const BluesCluesCaseArt = () => {
  // TODO...
  return null;
};


// const FOLDER_ART_COMPONENT: { [key: string]: JSX.Element } = {
//   // ...
// };