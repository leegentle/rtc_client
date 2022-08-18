import React, { FC, useState, useEffect, ChangeEvent, FormEvent } from "react";
import Button from "antd/lib/button";
import Input from "antd/lib/input";
import { useNavigate } from "react-router-dom";

import "./App.css";

const App: FC = () => {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState("");
  const [nick, setNick] = useState("");

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const goToRoom = () => {
    if (roomName === "") {
      alert("방 이름을 입력해주세요");
      return;
    }
    navigate(`/room/${roomName}`, { state: { nick: nick } });
  };

  useEffect(() => {}, []);

  return (
    <div id="Index">
      <form
        className="Index_form"
        onSubmit={(e: FormEvent<HTMLFormElement>) => submit(e)}
      >
        <Input
          value={nick || ""}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNick(e.target.value)
          }
          placeholder="닉네임 입력"
          type="text"
        />
        <Input
          value={roomName || ""}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setRoomName(e.target.value)
          }
          placeholder="방이름 입력"
          type="text"
        />
        <Button
          onClick={goToRoom}
          className="Index_form_button"
          htmlType="submit"
        >
          방 입장
        </Button>
      </form>
    </div>
  );
};

export default App;
