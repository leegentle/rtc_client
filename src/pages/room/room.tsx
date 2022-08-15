import React, {
  FC,
  useMemo,
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
} from "react";
import { useMatch } from "react-router-dom";

import "./room.scss";
import socketIOClient from "socket.io-client";

interface Message {
  name: string;
  message: string;
}
const App: FC = () => {
  const {
    params: { room },
  } = useMatch("/room/:room")!;

  const [messageList, setMessageList] = useState<Message[]>([]);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");

  const socket = useMemo(
    () =>
      socketIOClient("localhost:4002", {
        transports: ["websocket"],
      }),
    []
  );

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit("send message", { name: name, message: value });
  };

  const socketEvent = () => {
    socket.on(
      "receive message",
      (message: { name: string; message: string }) => {
        console.log("dd");
        setMessageList((messageList) => messageList.concat(message));
      }
    );

    socket.emit("join_room", room);
  };

  useEffect(() => {
    socketEvent();
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
