const TestArt = () => {
  return (
    <div>
      <h1>Art</h1>
      <p>TODO: Art goes here...</p>
    </div>
  );
};

const CASE_ART_COMPONENT: { [key: string]: JSX.Element } = {
  "sd-mc-1": <TestArt />,
  
};

export default function CasePageArt({ case_slug }: { case_slug: string }) {
  return <div>{CASE_ART_COMPONENT[case_slug]}</div>;
}
