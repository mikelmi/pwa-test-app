import { usePushMessages } from "@/hooks";

export default function MessagesLog() {
  const messages = usePushMessages();

  return (
    <div>
      <h3>Журнал повідомлень:</h3>

      <ul>
        {messages.map((msg, i) => (
          <li key={i}>{JSON.stringify(msg)}</li>
        ))}
      </ul>
    </div>
  );
}
