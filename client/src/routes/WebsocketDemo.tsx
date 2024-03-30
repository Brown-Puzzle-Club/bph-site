import CaseVoting from "@/components/websockets/CaseVoting";

const WebsocketDemo = () => {
  return (
    <div className="text-white">
      <h1>Websocket Demo!</h1>
      <h2>Presence Info</h2>

      <CaseVoting path="ws://localhost:5173/ws/websocket-demo" />
    </div>
  );
};

export default WebsocketDemo;
