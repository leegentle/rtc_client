import { FC, useState, useEffect, ChangeEvent, FormEvent } from "react";
import "./App.css";
import socketIOClient from "socket.io-client";

interface Message {
  name: string;
  message: string;
}
const App: FC = () => {
  const [messageList, setMessageList] = useState<Message[]>([]);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const socket = socketIOClient("ws://localhost:3001/socket.io", {
    transports: ["websocket"],
  });

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit("send message", { name: name, message: value });
  };

  useEffect(() => {
    socket.on(
      "receive message",
      (message: { name: string; message: string }) => {
        setMessageList((messageList) => messageList.concat(message));
      }
    );
  }, []);

  return (
    <div className="App">
      <section className="chat-list">
        {messageList.map((item: Message, i: number) => (
          <div key={i} className="message">
            <p className="username">{item.name.toUpperCase()}</p>
            <p className="message-text">{item.message}</p>
          </div>
        ))}
      </section>
      <form
        className="chat-form"
        onSubmit={(e: FormEvent<HTMLFormElement>) => submit(e)}
      >
        <div className="chat-inputs">
          <input
            type="text"
            autoComplete="off"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
            value={name}
            placeholder="유저이름"
          />
          <input
            type="text"
            autoComplete="off"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setValue(e.target.value)
            }
            value={value}
            placeholder="메세지입력하기"
          />
        </div>
        <button type="submit">입력하기</button>
      </form>
    </div>
  );
};

export default App;
