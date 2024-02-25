import PresenceCounter from "@/components/websockets/PresenceCounter";

const WebsocketDemo = () => {
  return (
    <div>
      <h1>Websocket Demo!</h1>
      <h2>Presence Info</h2>

      <PresenceCounter path="ws/websocket-demo" />
    </div>
  );
};

export default WebsocketDemo;
