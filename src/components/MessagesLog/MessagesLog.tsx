import { usePushMessages } from "@/hooks";
import { useMapModalContext } from "@/context";

import "./MessagesLog.css";

export default function MessagesLog() {
  const messages = usePushMessages();

  const { openModal } = useMapModalContext();

  return (
    <div className="block">
      <h3>Журнал повідомлень:</h3>

      <ul className="messages-log">
        {messages.map((msg, i) => (
          <li
            key={i}
            onClick={() => openModal(msg)}
            style={{ cursor: "pointer" }}
          >
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
