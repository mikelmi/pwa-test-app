import { usePushMessages } from "@/hooks";

export default function MessagesLog() {
  const messages = usePushMessages();

  return (
    <div>
      <h3>Журнал повідомлень:</h3>

      <ul>
        {messages.map((msg, i) => (
          <li key={i}>
            <pre>
              Дата: {msg.date?.toLocaleDateString()}. Розташування:{" "}
              {msg.location?.latitude}, {msg.location?.longitude}
            </pre>
          </li>
        ))}
      </ul>
    </div>
  );
}
