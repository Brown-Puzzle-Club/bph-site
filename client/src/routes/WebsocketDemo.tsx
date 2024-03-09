import CaseVoting from "@/components/websockets/CaseVoting";

const WebsocketDemo = () => {
  return (
    <div>
      <h1>Websocket Demo!</h1>
      <h2>Presence Info</h2>

      <CaseVoting
        path="ws/websocket-demo"
        votingOptions={["case-1", "case-2", "case-3", "case-4", "case-5", "case-6"]}
      />
    </div>
  );
};

export default WebsocketDemo;
