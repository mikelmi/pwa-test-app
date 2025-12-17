import { usePushMessages } from "@/hooks";

import "./MessagesLog.css";

export default function MessagesLog() {
  const messages = usePushMessages();

  return (
    <div>
      <h3>Журнал повідомлень:</h3>

      <ul className="messages-log">
        {messages.map((msg, i) => (
          <li key={i}>
            <div>
              <b>Дата:</b> {msg.date?.toLocaleString()}
            </div>
            <div>
              <b>Розташування:</b> {msg.location?.latitude},{" "}
              {msg.location?.longitude}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
