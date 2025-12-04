import { usePushMessages } from "../hooks/usePushMessages";
import { usePushNotifications } from "../hooks/usePushNotifications";

export default function PushNotificationsDemo() {
  const { subscribed, subscribe, status, error, notifyAlll } =
    usePushNotifications();

  const messages = usePushMessages();

  const handleNotifyAllClick = () => notifyAlll();

  return (
    <div>
      <p>Status: {status}</p>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!subscribed && <button onClick={subscribe}>Subscribe manually</button>}

      <button onClick={handleNotifyAllClick}>Notify all</button>

      <hr />

      <h3>Incoming messages:</h3>
      <ul>
        {messages.map((msg, i) => (
          <li key={i}>{JSON.stringify(msg)}</li>
        ))}
      </ul>
    </div>
  );
}
